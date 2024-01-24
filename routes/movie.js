const { Router } = require('express');
const { createMovie, getMovies, deleteMovie } = require('../controllers/movies');
const auth = require('../middlewares/auth');

const movieRouter = Router();

movieRouter.post('/', auth, createMovie);
movieRouter.get('/', auth, getMovies);
movieRouter.delete('/:movieId', auth, deleteMovie);

module.exports = movieRouter;
