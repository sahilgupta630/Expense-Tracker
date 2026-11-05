#!/usr/bin/env bash
# One-shot setup of Expense Tracker on a fresh Ubuntu server (e.g. AWS EC2).
# Deploys MongoDB + backend + frontend with automatic HTTPS and auto-deploy on every push to main.
#
#   Servers with 3 GB+ RAM : k3s (Kubernetes) + Traefik + cert-manager + ArgoCD (GitOps)
#   Smaller servers (t3.micro / t3.small): Docker Compose + Caddy, with 4 GB swap and a
#   systemd timer that pulls new images. Kubernetes itself needs too much memory there.
#
# Usage (on the server):  chmod +x deploy.sh && ./deploy.sh
#
# Secrets are asked for interactively and only stored on the server (root-only file or
# Kubernetes Secret), never in this file, so this script is safe to keep in Git.
set -euo pipefail

REPO_URL="https://github.com/sahilgupta630/Expense-Tracker.git"
REPO_DIR="$HOME/Expense-Tracker"
NAMESPACE="expense-tracker"
CERT_MANAGER_VERSION="v1.17.2"
MEM_MB=$(awk '/MemTotal/ {print int($2/1024)}' /proc/meminfo)
if [ "$MEM_MB" -lt 3000 ]; then LITE=1; else LITE=0; fi

step() { echo; echo "==> $*"; }

# ---------- 1. Collect settings ----------
read -rp "Your domain (e.g. sahil-expense-tracker.duckdns.org): " DOMAIN
[ -n "$DOMAIN" ] || { echo "Domain is required"; exit 1; }
read -rsp "Gemini API key: " GEMINI_API_KEY; echo
read -rp  "Google OAuth client ID (Enter to skip Google login): " GOOGLE_CLIENT_ID
GOOGLE_CLIENT_SECRET=""
if [ -n "$GOOGLE_CLIENT_ID" ]; then read -rsp "Google OAuth client secret: " GOOGLE_CLIENT_SECRET; echo; fi

if [ "$LITE" = 1 ]; then
  echo "Detected ${MEM_MB} MB RAM -> lightweight mode (Docker Compose + Caddy, swap, timer auto-deploy)."
else
  echo "Detected ${MEM_MB} MB RAM -> full mode (k3s + ArgoCD)."
fi

# ---------- 2. Base packages ----------
step "Installing base packages"
sudo apt-get update -y
sudo apt-get install -y git curl openssl

# ---------- 3. Get the code ----------
step "Fetching $REPO_URL"
if [ -d "$REPO_DIR/.git" ]; then git -C "$REPO_DIR" pull --ff-only; else git clone "$REPO_URL" "$REPO_DIR"; fi
cd "$REPO_DIR"

# =====================================================================
#  LIGHTWEIGHT MODE: Docker Compose + Caddy
# =====================================================================
if [ "$LITE" = 1 ]; then

  if [ -z "$(swapon --show --noheadings)" ]; then
    step "Adding 4 GB swap so the small server doesn't run out of memory"
    sudo fallocate -l 4G /swapfile
    sudo chmod 600 /swapfile
    sudo mkswap /swapfile >/dev/null
    sudo swapon /swapfile
    grep -q '^/swapfile ' /etc/fstab || echo '/swapfile none swap sw 0 0' | sudo tee -a /etc/fstab >/dev/null
    echo 'vm.swappiness=10' | sudo tee /etc/sysctl.d/99-expense-tracker-swap.conf >/dev/null
    sudo sysctl -q -p /etc/sysctl.d/99-expense-tracker-swap.conf
  fi

  if command -v k3s >/dev/null 2>&1; then
    read -rp "k3s is installed but too heavy for this server. Remove it? [Y/n] " ans
    if [ "${ans:-Y}" != "n" ]; then step "Removing k3s"; sudo /usr/local/bin/k3s-uninstall.sh; fi
  fi

  if ! command -v docker >/dev/null 2>&1; then
    step "Installing Docker"
    curl -fsSL https://get.docker.com | sudo sh
  fi

  step "Writing configuration"
  sudo install -d -m 700 /etc/expense-tracker
  ENV_FILE=/etc/expense-tracker/backend.env
  # Keep existing login secrets on re-runs so users stay logged in.
  JWT_SECRET=$(sudo sed -n 's/^JWT_SECRET=//p' "$ENV_FILE" 2>/dev/null || true)
  SESSION_SECRET=$(sudo sed -n 's/^SESSION_SECRET=//p' "$ENV_FILE" 2>/dev/null || true)
  sudo tee "$ENV_FILE" >/dev/null <<EOF
JWT_SECRET=${JWT_SECRET:-$(openssl rand -hex 32)}
SESSION_SECRET=${SESSION_SECRET:-$(openssl rand -hex 32)}
FRONTEND_URL=https://$DOMAIN
BACKEND_URL=https://$DOMAIN
GEMINI_API_KEY=$GEMINI_API_KEY
GOOGLE_CLIENT_ID=$GOOGLE_CLIENT_ID
GOOGLE_CLIENT_SECRET=$GOOGLE_CLIENT_SECRET
EOF
  sudo chmod 600 "$ENV_FILE"
  echo "DOMAIN=$DOMAIN" > deploy/.env

  step "Starting MongoDB, backend, frontend and Caddy (HTTPS)"
  COMPOSE="sudo docker compose -f $REPO_DIR/deploy/docker-compose.yml"
  $COMPOSE pull -q
  $COMPOSE up -d --remove-orphans

  step "Installing auto-deploy timer (checks for new images every 2 minutes)"
  sudo tee /usr/local/bin/expense-tracker-update >/dev/null <<EOF
#!/usr/bin/env bash
# Pulls the latest main branch and the newest images from GHCR, then recreates any
# container whose image changed. CI pushes new :latest images on every push to main.
set -euo pipefail
cd "$REPO_DIR"
sudo -u $(id -un) git pull -q --ff-only origin main || true
docker compose -f deploy/docker-compose.yml pull -q
docker compose -f deploy/docker-compose.yml up -d --remove-orphans
docker image prune -f >/dev/null
EOF
  sudo chmod 755 /usr/local/bin/expense-tracker-update

  sudo tee /etc/systemd/system/expense-tracker-update.service >/dev/null <<'EOF'
[Unit]
Description=Deploy the latest Expense Tracker images
After=network-online.target docker.service

[Service]
Type=oneshot
ExecStart=/usr/local/bin/expense-tracker-update
EOF

  sudo tee /etc/systemd/system/expense-tracker-update.timer >/dev/null <<'EOF'
[Unit]
Description=Check for Expense Tracker updates every 2 minutes

[Timer]
OnBootSec=2min
OnUnitActiveSec=2min

[Install]
WantedBy=timers.target
EOF
  sudo systemctl daemon-reload
  sudo systemctl enable --now expense-tracker-update.timer

  step "Waiting for the app to come up"
  for i in $(seq 1 60); do
    $COMPOSE exec -T backend wget -qO- http://localhost:5000/health >/dev/null 2>&1 && { echo "Backend is healthy."; break; }
    sleep 5
  done
  $COMPOSE ps

  cat <<EOF

=====================================================
 Done!
 App:     https://$DOMAIN   (HTTPS certificate can take 1-2 minutes)
 Auto-deploy: every 2 min (logs: journalctl -u expense-tracker-update)
 First login: admin@expensetracker.com / admin123  -> CHANGE THIS PASSWORD NOW
=====================================================
EOF
  exit 0
fi

# =====================================================================
#  FULL MODE: k3s + Traefik + cert-manager + ArgoCD
# =====================================================================
if ! grep -q "$DOMAIN" k8s/frontend/ingress.yaml; then
  echo "WARNING: k8s/frontend/ingress.yaml does not mention $DOMAIN."
  echo "         Update the domain in the repo (ingress, CI workflow, frontend Dockerfile) and push first."
  read -rp "Continue anyway? [y/N] " ans; [ "${ans:-N}" = "y" ] || exit 1
fi

if command -v k3s >/dev/null 2>&1; then
  read -rp "k3s is already installed. Reinstall from scratch? This DELETES all cluster data incl. MongoDB. [y/N] " ans
  if [ "${ans:-N}" = "y" ]; then sudo /usr/local/bin/k3s-uninstall.sh; fi
fi
if ! command -v k3s >/dev/null 2>&1; then
  step "Installing k3s"
  curl -sfL https://get.k3s.io | sh -
fi
K="sudo k3s kubectl"
step "Waiting for the Kubernetes node to be ready"
until $K get nodes 2>/dev/null | grep -q " Ready"; do sleep 5; done

step "Installing cert-manager $CERT_MANAGER_VERSION"
$K apply -f "https://github.com/cert-manager/cert-manager/releases/download/${CERT_MANAGER_VERSION}/cert-manager.yaml"
$K -n cert-manager rollout status deployment/cert-manager --timeout=600s
$K -n cert-manager rollout status deployment/cert-manager-webhook --timeout=600s

step "Creating namespace and backend secret"
$K apply -f k8s/namespace.yaml
$K create secret generic backend-secret \
  --namespace "$NAMESPACE" \
  --from-literal=PORT=5000 \
  --from-literal=mongoDBURL="mongodb://mongodb:27017/expense-tracker" \
  --from-literal=JWT_SECRET="$(openssl rand -hex 32)" \
  --from-literal=SESSION_SECRET="$(openssl rand -hex 32)" \
  --from-literal=FRONTEND_URL="https://$DOMAIN" \
  --from-literal=BACKEND_URL="https://$DOMAIN" \
  --from-literal=GOOGLE_CLIENT_ID="$GOOGLE_CLIENT_ID" \
  --from-literal=GOOGLE_CLIENT_SECRET="$GOOGLE_CLIENT_SECRET" \
  --from-literal=GEMINI_API_KEY="$GEMINI_API_KEY" \
  --dry-run=client -o yaml | $K apply -f -

step "Deploying MongoDB, backend and frontend"
# The webhook and Traefik CRDs can take a little while to become available.
for i in $(seq 1 12); do $K apply -f k8s/cert-manager/cluster-issuer.yaml && break; sleep 10; done
$K apply -f k8s/mongodb/
$K apply -f k8s/backend/deployment.yaml -f k8s/backend/service.yaml
for i in $(seq 1 30); do $K apply -f k8s/frontend/ && break; sleep 10; done

step "Installing ArgoCD"
$K create namespace argocd --dry-run=client -o yaml | $K apply -f -
$K apply -n argocd -f https://raw.githubusercontent.com/argoproj/argo-cd/stable/manifests/install.yaml
$K -n argocd rollout status deployment/argocd-server --timeout=600s
$K -n argocd patch svc argocd-server -p '{"spec": {"type": "NodePort"}}'
$K apply -f k8s/argocd/argocd-app.yaml

step "Waiting for app pods"
$K -n "$NAMESPACE" rollout status statefulset/mongodb --timeout=600s || true
$K -n "$NAMESPACE" rollout status deployment/backend --timeout=600s || true
$K -n "$NAMESPACE" rollout status deployment/frontend --timeout=300s || true
$K -n "$NAMESPACE" get pods

ARGO_PORT=$($K -n argocd get svc argocd-server -o jsonpath='{.spec.ports[?(@.name=="https")].nodePort}')
ARGO_PASS=$($K -n argocd get secret argocd-initial-admin-secret -o jsonpath='{.data.password}' | base64 -d)
PUBLIC_IP=$(curl -s https://checkip.amazonaws.com || echo "<server-ip>")

cat <<EOF

=====================================================
 Done!
 App:     https://$DOMAIN   (HTTPS certificate can take 1-3 minutes)
 ArgoCD:  https://$PUBLIC_IP:$ARGO_PORT   user: admin   password: $ARGO_PASS
 First login: admin@expensetracker.com / admin123  -> CHANGE THIS PASSWORD NOW
=====================================================
EOF
