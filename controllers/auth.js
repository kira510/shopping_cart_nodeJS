const crypto = require('crypto');
const User = require('../models/user');
const nodeMailer = require('nodemailer');
const sendGridTransport = require('nodemailer-sendgrid-transport');
const bcrypt = require('bcryptjs');
const { validationResult } = require('express-validator/check');

// you can use username and password here too
// https://nodemailer.com/about/
// using nodemailer, you can configure a mail server host and stuff inside createTransport
// here we are suing sendgrid package to connect to sendgrid. Awesome!
// const transporter = nodeMailer.createTransport(sendGridTransport({
//   auth: {
//     api_key: 'add your api key here'
//   }
// }));

// use gmail service: https://codeburst.io/sending-an-email-using-nodemailer-gmail-7cfa0712a799
const transporter = nodeMailer.createTransport({
  service: 'gmail',
  auth: {
        user: '****',
        pass: '****'
  }
});

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
    errorMessage: message,
    oldInput: {
      email: '',
      password: ''
    },
    validationErrors: []
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
    errorMessage: message,
    oldInput: {
      email: '',
      password: '',
      confirmPassword: ''
    },
    validationErrors: []
  });
};

exports.postLogin = (req, res, next) => {
  const email = req.body.email;
  const password = req.body.password;

  const error = validationResult(req);

  if (!error.isEmpty()) {
    return res.status(422).render('auth/login', {
      path: '/login',
      pageTitle: 'Login',
      errorMessage: error.array()[0].msg,
      oldInput: {
        email: email,
        password: password
      },
      validationErrors: error.array()
    });
  }

  User.findOne({email: email})
    .then(user => {
      if (!user) {
        return res.status(422).render('auth/login', {
          path: '/login',
          pageTitle: 'Login',
          errorMessage: 'Invalid email or password',
          oldInput: {
            email: email,
            password: password
          },
          validationErrors: []
        });
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

          return res.status(422).render('auth/login', {
            path: '/login',
            pageTitle: 'Login',
            errorMessage: 'Invalid email or password',
            oldInput: {
              email: email,
              password: password
            },
            validationErrors: []
          });
        })
    })
    .catch(err => {
      const error = new Error(err);
      error.httpStatusCode = 500;
      return next(error);
    });
};

exports.postSignup = (req, res, next) => {
  const email = req.body.email;
  const password = req.body.password;
  const confirmPassword = req.body.confirmPassword;

  const errors = validationResult(req);

  if (!errors.isEmpty()) {
    console.log(errors.array());
    return res.status(422).render('auth/signup', {
      path: '/signup',
      pageTitle: 'Signup',
      errorMessage: errors.array()[0].msg,
      oldInput: {
        email: email,
        password: password,
        confirmPassword: confirmPassword
      },
      validationErrors: errors.array()
    });
  }

  bcrypt.hash(password, 12).then(hashPassword => {
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
    const error = new Error(err);
    error.httpStatusCode = 500;
    return next(error);
  });
};

exports.postLogout = (req, res, next) => {
  req.session.destroy(err => {
    console.log(err);
    res.redirect('/');
  });
};

exports.getReset = (req, res, next) => {
  let message = req.flash('error');

  if (message.length > 0) {
    message = message[0];
  } else {
    message = null;
  }

  res.render('auth/reset', {
    path: '/reset',
    pageTitle: 'Reset Password',
    errorMessage: message
  });
};

exports.postReset = (req, res, next) => {
  crypto.randomBytes(32, (err, buffer) => {
    if (err) {
      console.log(err);
      res.redirect('/reset');
    }

    const token = buffer.toString('hex');

    User.findOne({email: req.body.email})
      .then(user => {
        if (!user) {
          req.flash('error', 'email not found');
          return res.redirect('/reset');
        }

        user.resetToken = token;
        user.resetTokenExpiration = Date.now() + 3600000;
        return user.save();
      })
      .then(result => {
        res.redirect('/');
        console.log(req.body.email);
        console.log('sending email');
        return transporter.sendMail({
          to: req.body.email,
          from: 'shop@nodeshoppingcart.com',
          subject: 'Reset Password',
          html: `
            <p>Reset Password!</p>
            <p>Click this <a href="http://localhost:3000/reset/${token}">link</a> to reset your password</p>
          `
        });
      })
      .catch(err => {
        const error = new Error(err);
        error.httpStatusCode = 500;
        return next(error);
      });
  });
};

exports.getNewPassword = (req, res, next) => {
  const token = req.params.token;

  User.findOne({resetToken: token, resetTokenExpiration: {$gt: Date.now()}})
    .then(user => {
      let message = req.flash('error');

      if (message.length > 0) {
        message = message[0];
      } else {
        message = null;
      };

      res.render('auth/new-password', {
        path: '/new-password',
        pageTitle: 'New Password',
        errorMessage: message,
        userId: user._id,
        resetToken: token
      });
    }).catch(err => {
      const error = new Error(err);
      error.httpStatusCode = 500;
      return next(error);
    });
};

exports.postNewPassword = (req, res, next) => {
  const token = req.body.token;
  const userId = req.body.userId;
  const password = req.body.password;
  console.log(userId, password)
  let resetUser;

  User.findOne({_id: userId, resetToken: token, resetTokenExpiration: {$gt: Date.now()}})
    .then(user => {
      resetUser = user;

      return bcrypt.hash(password, 12);
    })
    .then(hashPassword => {
      resetUser.password = hashPassword;
      resetUser.resetToken = undefined;
      resetUser.resetTokenExpiration = undefined;
      return resetUser.save();
    })
    .then(result => {
      res.redirect('/login');
    })
    .catch(err => {
      const error = new Error(err);
      error.httpStatusCode = 500;
      return next(error);
    });
}
