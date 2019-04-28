const User = require('../models/user');
const nodeMailer = require('nodemailer');
const sendGridTransport = require('nodemailer-sendgrid-transport');
const bcrypt = require('bcryptjs');

// you can use username and password here too
// https://nodemailer.com/about/
// using nodemailer, you can configure a mail server host and stuff inside createTransport
// here we are suing sendgrid package to connect to sendgrid. Awesome!
const transporter = nodeMailer.createTransport(sendGridTransport({
  auth: {
    api_key: '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'
  }
}));

exports.getLogin = (req, res, next) => {
  // req.flash('error'); returns an empty array [].
  let message = req.flash('error');
  if (message.length > 0) {
    message = message[0];
  } else {
    message = null;
  }
  res.render('auth/login', {
    path: '/login',
    pageTitle: 'Login',
    errorMessage: message
  });
};

exports.getSignup = (req, res, next) => {
  let message = req.flash('error');
  if (message.length > 0) {
    message = message[0];
  } else {
    message = null;
  }
  res.render('auth/signup', {
    path: '/signup',
    pageTitle: 'Signup',
    errorMessage: message
  });
};

exports.postLogin = (req, res, next) => {
  const email = req.body.email;
  const password = req.body.password;

  User.findOne({email: email})
    .then(user => {
      if (!user) {
        req.flash('error', 'Invalid email or password');
        return res.redirect('/login');
      }

      bcrypt.compare(password, user.password)
        .then(doMatch => {
          if (doMatch) {
            req.session.isLoggedIn = true;
            req.session.user = user;
            return req.session.save(err => {
              console.log(err);
              res.redirect('/');
            });
          }

          req.flash('error', 'Invalid email or password');
          res.redirect('/login');
        })
    })
    .catch(err => console.log(err));
};

exports.postSignup = (req, res, next) => {
  const email = req.body.email;
  const password = req.body.password;
  const confirmPassword = req.body.confirmPassword;

  User.findOne({email: email})
    .then(userDoc => {
      if (userDoc) {
        req.flash('error', 'Email already exists.');
        return res.redirect('/signup')
      }

      return bcrypt.hash(password, 12).then(hashPassword => {
        const user = new User({
          email: email,
          password: hashPassword,
          cart: {items: []}
        });

        return user.save();
      })
      .then(result => {
        res.redirect('/login');
        return transporter.sendMail({
          to: email,
          from: 'shop@nodeshoppingcart.com',
          subject: 'Signup Succeded!',
          html: '<h1>You are successfully signed up!</h1>'
        });
      }).catch(err => {
        console.log(err);
      });
    })
    .catch(err => { console.log(err); });
};

exports.postLogout = (req, res, next) => {
  req.session.destroy(err => {
    console.log(err);
    res.redirect('/');
  });
};
