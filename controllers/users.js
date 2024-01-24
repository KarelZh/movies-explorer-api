const { NODE_ENV, JWT_SECRET } = process.env;
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const user = require('../models/user');
const NotFound = require('../errors/NotFoundError');
const ValidationError = require('../errors/ValidationError');
const ConflictError = require('../errors/ConflictError');
const UnauthorizedError = require('../errors/UnauthorizedError');

const SOLT_ROUNDS = 10;

const createUser = async (req, res, next) => {
  const { name, email, password } = req.body;
  const hash = await bcrypt.hash(password, SOLT_ROUNDS);
  user.create({ name, email, password: hash })
    .then((item) => res.status(200).send({ name: item.name, email: item.email }))
    .catch((err) => {
      if (err.code === 11000) {
        return next(new ConflictError('Такой пользователь уже существует'));
      }
      if (err.name === 'ValidationError') {
        next(new ValidationError('Переданы некорректные данные'));
      }
      return next(err);
    });
};
const login = async (req, res, next) => {
  const { email, password } = req.body;
  return user.findUserByCredentials(email, password)
    .then((item) => {
      const token = jwt.sign({ _id: item._id }, NODE_ENV === 'production' ? JWT_SECRET : 'dev-secret', { expiresIn: '7d' });
      res.send({ token });
    }).catch((err) => {
      if (err.name === 'UnauthorizedError') {
        return next(new UnauthorizedError('Переданы некорректные данные'));
      }
      return next(err);
    });
};
const updateProfile = async (req, res, next) => {
  const { email, name } = req.body;
  user.findByIdAndUpdate(req.user._id, { email, name }, { new: true, runValidators: true })
    .then((item) => res.send(item))
    .catch((err) => {
      if (err.name === 'ValidationError') {
        return next(new ValidationError('Переданы некорректные данные'));
      }
      return next(err);
    });
};
const getMe = async (req, res) => {
  const { _id } = req.user;
  user.find({ _id })
    .then((item) => {
      if (!item) {
        throw new NotFound('Запрашиваемый пользователь не найден');
      }
      return res.send(...item);
    });
};

module.exports = {
  createUser,
  updateProfile,
  getMe,
  login,
};
