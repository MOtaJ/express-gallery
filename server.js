const express = require('express');
let app = express();
const routes = require('./routes/routes.js');
const handlebars = require('express-handlebars');
const methodOverride = require('method-override');
const bodyparser = require('body-parser');
const cookieParser = require('cookie-parser');
const PORT = process.env.PORT || 3000;

let db = require('./models');

app.use(express.static('public'));
app.use(cookieParser());
app.use(session({secret: "Something"}));

app.use(methodOverride('_method'));
app.use(bodyparser.urlencoded({extended : true}));
app.use(bodyparser.json());

const hbs = handlebars.create(
  {
    extname: '.hbs',
    defaultLayout: 'app'
  }
);

app.engine('hbs', hbs.engine);
app.set('view engine', 'hbs');

app.use('/routes', routes);


app.listen(PORT, function() {
  db.sequelize.sync();
});