require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const router = require('./routes/index');
const auth = require('./middlewares/auth');
const errorHandler = require('./errors/errorsHandler');
const { requestLogger, errorLogger } = require('./middlewares/logger');

const { PORT, DB_ADDRESS } = process.env;

const app = express();
mongoose.connect(DB_ADDRESS);
app.use(cors());
app.use(express.json());

app.use(requestLogger);
app.use(router);
app.use(auth);
app.use(errorLogger);
app.use(errorHandler);

app.listen(PORT, () => {
  console.log('Сервер создан');
});
