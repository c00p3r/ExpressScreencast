const express = require('express');
const config = require('./config');
const path = require('path');
// const favicon = require('serve-favicon');
const logger = require('morgan');
const session = require('express-session');
const bodyParser = require('body-parser');
const sessionStore = require('./libs/sessionStore');
// const sassMiddleware = require('node-sass-middleware');

const app = express();
// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'pug');
// uncomment after placing your favicon in /public
//app.use(favicon(path.join(__dirname, 'public', 'favicon.ico')));
app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));

let session_conf = config.get('session');
session_conf.store = sessionStore;
app.use(session(session_conf));
// app.use(sassMiddleware({
//   src: path.join(__dirname, 'public'),
//   dest: path.join(__dirname, 'public'),
//   indentedSyntax: true, // true = .sass and false = .scss
//   sourceMap: true
// }));

app.use(express.static(path.join(__dirname, 'public')));

app.use(require('./middlewares').before);
app.use(require('./routes'));
app.use(require('./middlewares').after);

module.exports = app;
