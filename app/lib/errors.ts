export const sendInvalidTokenError = (res) =>
  res.status(403).json({
    errors: [
      {
        message: 'Invalid Token'
      }
    ]
  });
