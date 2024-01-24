const { Router } = require('express');
const { updateProfile, getMe } = require('../controllers/users');
const auth = require('../middlewares/auth');

const userRouter = Router();

userRouter.get('/me', auth, getMe);
userRouter.patch('/me', auth, updateProfile);

module.exports = userRouter;
