const User = require('../models/user');
const { validationResult } = require('express-validator/check');
const bcrypt = require('bcrypt');

exports.signUp = (req, res, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        const err = new Error('Validation failed!')
        err.data = errors.array();
        err.statusCode = 422;

        throw err;
    }

    const email = req.body.email;
    const name = req.body.name;
    const password = req.body.password;

    bcrypt.hash(password, 12)
        .then(hashPassword => {
            const user = new User({
                email: email,
                name: name,
                password: hashPassword
            });

            return user.save();
        }).then(result => {
            res.status(201).json({
                message: 'new user was added',
                userId: result._id
            });
        }).catch(err => {
            if (!err.statusCode) {
                err.statusCode = 500;
              }
              next(err);
        });
};