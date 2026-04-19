export const authorize = (...roles) => {
  return (req, res, next) => {
    
    // 1.Safety check
    if (!req.user) {
      return res.status(401).json({
        success: false,
        message: "Unauthorized - user not found in request",
      });
    }

    // 2.Role check safety
    if (!req.user.role) {
      return res.status(403).json({
        success: false,
        message: "Access denied - role missing",
      });
    }

    // 3.Authorization check
    if (!roles.includes(req.user.role)) {
      return res.status(403).json({
        success: false,
        message: "Access denied (role not allowed)",
      });
    }

    next();
  };
};