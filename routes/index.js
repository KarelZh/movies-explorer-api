const { Router } = require('express');
const { createUser, login } = require('../controllers/users');
const movieRouter = require('./movie');
const userRouter = require('./user');
const NotFound = require('../errors/NotFoundError');
const auth = require('../middlewares/auth');

const router = Router();

router.use('/users', auth, userRouter);
router.use('/movies', auth, movieRouter);
router.post('/signup', createUser);
router.post('/signin', login);

router.all('*', auth, () => {
  throw new NotFound('Неправильный путь');
});

module.exports = router;
