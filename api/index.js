const router = require('express').Router();
module.exports = router;
console.log('This index is inside api ');
router.use('/user', require('./user'));

router.use((req, res, next) => {
  const error = new Error('Not Found');
  error.status = 404;
  next(error);
});
