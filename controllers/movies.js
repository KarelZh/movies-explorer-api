const movie = require('../models/movie');
const ValidationError = require('../errors/ValidationError');
const NotFound = require('../errors/NotFoundError');
const ForbiddenError = require('../errors/ForbiddenError');

const createMovie = async (req, res, next) => {
  const {
    country,
    director,
    duration,
    year,
    description,
    image,
    trailerLink,
    nameRU,
    nameEN,
    thumbnail,
    movieId,
  } = req.body;
  const owner = req.user._id;
  movie.create({
    country,
    director,
    duration,
    year,
    description,
    image,
    trailerLink,
    nameRU,
    nameEN,
    thumbnail,
    movieId,
    owner,
  })
    .then((item) => res.status(201).send(item))
    .catch((err) => {
      if (err.name === 'ValidationError') {
        return next(new ValidationError('Переданы некорректные данные'));
      }
      return next(err);
    });
};
const getMovies = async (req, res, next) => {
  try {
    const movies = await movie.find({});
    return res.send(movies);
  } catch (err) {
    return next(err);
  }
};
const deleteMovie = async (req, res, next) => {
  const removeMovie = () => {
    movie.findByIdAndDelete(req.params.movieId)
      .then((item) => {
        res.status(200).send(item);
      })
      .catch(next);
  };
  movie.findById(req.params.movieId)
    .then((item) => {
      if (!item) {
        throw new NotFound('Фильма не существует');
      }
      if (item.owner.toString() === req.user._id) {
        return removeMovie();
      }
      return next(new ForbiddenError('Попытка удалить чужой фильм'));
    })
    .catch(next);
};

module.exports = { createMovie, getMovies, deleteMovie };
