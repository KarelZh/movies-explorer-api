const { Router } = require('express');
const { createUser, login } = require('../controllers/users');
const movieRouter = require('./movie');
const userRouter = require('./user');

const router = Router();

router.use('/users', userRouter);
router.use('/movies', movieRouter);
router.post('/signup', createUser);
router.post('/signin', login);

module.exports = router;
