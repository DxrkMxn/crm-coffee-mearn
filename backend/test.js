require('dotenv').config();
const express = require('express');
const morgan = require('morgan');
const cors = require('cors');
const passport = require('passport');
const mongoose = require('mongoose');
const path = require('path');
const app = express();

const keys = require('./config/keys');

const helmet = require('helmet');
app.use(helmet());

mongoose.connect(
  process.env.NODE_ENV === 'production' ? keys.mongoURI : 'mongodb://mongodb:27017/crm-coffee', { useUnifiedTopology: true, useNewUrlParser: true, serverSelectionTimeoutMS: 5000, dbName: 'crm-coffee' })
.then(() => console.info('MongoDB connected.'))
.catch(error => console.error('MongoDB connection error:', error));

app.use(passport.initialize());
require('./middleware/passport')(passport);

app.use(morgan('dev'));
app.use(express.json({ limit: '50mb' }));
app.use(express.urlencoded({ limit: '50mb', extended: true }));
const allowedOrigins = process.env.CORS_ORIGINS.split(',');
app.use(cors({ origin: [...allowedOrigins, "http://localhost:3000", "http://localhost:4200" ],
methods: 'GET,HEAD,PUT,PATCH,POST,DELETE',
credentials: true, }));

const request = require('supertest');
const app = require('./app');
describe('GET /api/v1/auth', () => {
  it('responds with json', done => {
    request(app)
      .get('/api/v1/auth')
      .set('Accept', 'application/json')
      .expect('Content-Type', /json/)
      .expect(200, done);
  });
});

app.enable('trust proxy');
app.use((req, res, next) => {
  if (req.secure) {
    next();
  } else {
    res.redirect('https://' + req.headers.host + req.url);
  }
});

if (process.env.NODE_ENV === 'production') {
  app.use(express.static('client/dist/client'));
  app.get('*', (req, res) => {
    res.sendFile(path.resolve(__dirname, 'client', 'dist', 'client', 'index.html'));
  });
  app.use(morgan('combined'));
} else {
  app.use(morgan('dev'));
}

app.use((error, req, res, next) => {
  console.error(error.stack);
  res.status(500).send('Something broke!');
});

const swaggerUi = require('swagger-ui-express');
const swaggerDocument = require('./swagger.json');

app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerDocument));

module.exports = app;
