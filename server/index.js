const express = require('express');
const path = require('path');
const morgan = require('morgan');
const session = require('express-session');
const apiRoute = require('./api');
const db = require('./models');

const resolvePort = port => parseInt(port, 10);

const portData = process.env.REACT_APP_PORT || 9000;
const PORT = resolvePort(portData);

let publicPath = '';

const isProduction = process.env.NODE_ENV === 'production';
const App = express();


App.use(session({
  secret: 'somerandomlongstringfortesting',
  resave: false,
  saveUninitialized: false,
  cookie: {
    expires: 600000
  }
}));

App.disable('x-powered-by');
App.use(morgan('tiny'));

publicPath = isProduction
  ? path.join(__dirname, '..', 'build')
  : path.join(__dirname, '..', 'public');


// const hasCookie = (req,res,next) => {
//   if(req.session.cookie) {

//   }
// }; 


App.use(express.urlencoded({ extended: false }));
App.use(express.json());
App.use(express.static(publicPath));
// App.use(hasCookie);
App.use('/api', apiRoute);

App.get('/*', (req, res) => {
  const filePath = path.resolve(publicPath, 'index.html');
  res.sendFile(filePath);
});

db.sequelize.sync({ force: true }).then(() => {
  console.log('Connection has been established successfully.');
  App.listen(PORT, () => {
    console.log(`Server Running on ${PORT}`);
  });
});