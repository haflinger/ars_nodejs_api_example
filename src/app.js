import Ars from './ars';
import bodyParser from 'body-parser';
import config from './config';
import express from 'express';
import morgan from 'morgan';
import soap from 'soap';

// ============
// Express init
// ============
let app = express();

// ==============
// Express config
// ==============
// Configure Logging
app.use(morgan('dev'));
// Parse application/x-www-form-urlencoded
app.use(bodyParser.urlencoded({ extended: false }));
// Parse application/json
app.use(bodyParser.json());

// =================
// ARS SOAP Services
// =================
const changes = new Ars('change'); // Changes
const incidents = new Ars('incident'); // Incidents

// ======
// Routes
// ======

// Changes
app.post('/changes', (req, res, next) => {
  changes.find(req.body.args)
  .then((changes) => res.json(changes))
  .catch((err) => next(err));
});

// Incidents
app.post('/incidents', (req, res, next) => {
  incidents.find(req.body.args)
  .then((incidents) => res.json(incidents))
  .catch((err) => next(err));
});

// Error 404
app.use((req, res, next) => {
  let err = new Error('Not found !');
  err.status = 404;
  next(err);
});

app.listen(3000, function () {
  console.log('Server Listen on port 3000');
});
