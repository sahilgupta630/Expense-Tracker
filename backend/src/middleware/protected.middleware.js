// Use after checkForUserAuthentication. The role comes from the user loaded
// from the verified JWT, never from a client-supplied header, so it cannot be faked.
export const checkAdmin = (req, res, next) => {
  if (!req.user) {
    return res.status(401).json({ message: "Not authenticated" });
  }

  if (req.user.role !== "Admin") {
    return res.status(403).json({ message: "Access denied. Admins only." });
  }

  next();
};
