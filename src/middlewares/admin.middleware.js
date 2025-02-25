export const isAdmin = async (req, res, next) => {
    try {
      if (!req.user || !req.user.isAdmin()) {
        return res.status(403).json({
          success: false,
          message: "Access denied. Admin privileges required."
        });
      }
      next();
    } catch (error) {
      return res.status(500).json({
        success: false,
        message: "Error checking admin privileges"
      });
    }
  };