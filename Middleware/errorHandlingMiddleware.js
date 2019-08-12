module.exports = errorHandlingMiddlewarre = handler => {
  return async (req, res, next) => {
    try {
      //console.log(req.body);
      await handler(req, res);
    } catch (ex) {
      next(ex);
    }
  };
};
