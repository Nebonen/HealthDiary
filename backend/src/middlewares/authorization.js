/**
 * Authorization middleware to check user roles
 * @param {string[]} roles - Allowed roles for the route
 */
const authorize = (roles = []) => {
  return (req, res, next) => {
    try {
      // Make sure we have a user from authentication middleware
      if (!req.user) {
        return res.status(401).json({message: 'Unauthorized access.'});
      }

      // Check if user level is allowed
      if (roles.length && !roles.includes(req.user.userLevel)) {
        return res
          .status(403)
          .json({message: 'Forbidden. Insufficient permissions.'});
      }

      // User authorized
      next();
    } catch (error) {
      console.error('Authorization error:', error);
      res.status(500).json({message: 'Internal Server Error'});
    }
  };
};

export default authorize;
