#!/usr/bin/env bash
# One-shot setup of Expense Tracker on a fresh Ubuntu server (e.g. AWS EC2).
# Installs k3s (Kubernetes), cert-manager (HTTPS) and ArgoCD (auto-deploy from GitHub),
# then deploys MongoDB + backend + frontend.
#
# Usage (on the server):  chmod +x deploy.sh && ./deploy.sh
#
# Secrets are asked for interactively and only stored inside the cluster,
# never in this file, so this script is safe to keep in Git.
set -euo pipefail

REPO_URL="https://github.com/sahilgupta630/Expense-Tracker.git"
REPO_DIR="$HOME/Expense-Tracker"
NAMESPACE="expense-tracker"
CERT_MANAGER_VERSION="v1.17.2"

step() { echo; echo "==> $*"; }

# ---------- 1. Collect settings ----------
read -rp "Your domain (e.g. sahil-expense-tracker.duckdns.org): " DOMAIN
[ -n "$DOMAIN" ] || { echo "Domain is required"; exit 1; }
read -rsp "Gemini API key: " GEMINI_API_KEY; echo
read -rp  "Google OAuth client ID (Enter to skip Google login): " GOOGLE_CLIENT_ID
GOOGLE_CLIENT_SECRET=""
if [ -n "$GOOGLE_CLIENT_ID" ]; then read -rsp "Google OAuth client secret: " GOOGLE_CLIENT_SECRET; echo; fi

# ---------- 2. Base packages ----------
step "Installing base packages"
sudo apt-get update -y
sudo apt-get install -y git curl openssl

# ---------- 3. Get the code ----------
step "Fetching $REPO_URL"
if [ -d "$REPO_DIR/.git" ]; then git -C "$REPO_DIR" pull --ff-only; else git clone "$REPO_URL" "$REPO_DIR"; fi
cd "$REPO_DIR"

if ! grep -q "$DOMAIN" k8s/frontend/ingress.yaml; then
  echo "WARNING: k8s/frontend/ingress.yaml does not mention $DOMAIN."
  echo "         Update the domain in the repo (ingress, CI workflow, frontend Dockerfile) and push first."
  read -rp "Continue anyway? [y/N] " ans; [ "${ans:-N}" = "y" ] || exit 1
fi

# ---------- 4. Kubernetes (k3s) ----------
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

# ---------- 5. cert-manager (free HTTPS certificates) ----------
step "Installing cert-manager $CERT_MANAGER_VERSION"
$K apply -f "https://github.com/cert-manager/cert-manager/releases/download/${CERT_MANAGER_VERSION}/cert-manager.yaml"
$K -n cert-manager rollout status deployment/cert-manager-webhook --timeout=300s

# ---------- 6. Namespace + secret ----------
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

# ---------- 7. App manifests ----------
step "Deploying MongoDB, backend and frontend"
$K apply -f k8s/cert-manager/cluster-issuer.yaml
$K apply -f k8s/mongodb/
$K apply -f k8s/backend/deployment.yaml -f k8s/backend/service.yaml
$K apply -f k8s/frontend/

# ---------- 8. ArgoCD (redeploys automatically on every push to main) ----------
step "Installing ArgoCD"
$K create namespace argocd --dry-run=client -o yaml | $K apply -f -
$K apply -n argocd -f https://raw.githubusercontent.com/argoproj/argo-cd/stable/manifests/install.yaml
$K -n argocd rollout status deployment/argocd-server --timeout=600s
$K -n argocd patch svc argocd-server -p '{"spec": {"type": "NodePort"}}'
$K apply -f k8s/argocd/argocd-app.yaml

# ---------- 9. Summary ----------
step "Waiting for app pods"
$K -n "$NAMESPACE" rollout status deployment/backend --timeout=300s || true
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
