const express = require('express');
const bodyParser = require('body-parser');
const path = require('path');

const app = express();

app.set('view engine', 'pug'); //sets the template engine to pug
app.set('views', 'views'); // looks for template view files in view folder

const adminRoutes = require('./routes/admin');
const shopRoutes = require('./routes/shop');

app.use(bodyParser.urlencoded({ extended: false }));
app.use(express.static(path.join(__dirname, 'public'))); //all static files request is directed to public folder

app.use(shopRoutes)
app.use('/admin', adminRoutes.routes);

app.use((req,res,next) => {
    res.status(404).render('404');
});

app.listen(3000);

/**
 * res.send('<h1>Hi from express</h1>'); automatically sets Content-Type: text/html
 */