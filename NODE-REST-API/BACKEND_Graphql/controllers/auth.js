const User = require('../models/user');
const { validationResult } = require('express-validator/check');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');

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

exports.login = (req, res, next) => {
    const email = req.body.email;
    const password = req.body.password;
    let loadedUser;

    User.findOne({email: email})
        .then(user => {
            if (!user) {
                const error = new Error('Email no found.');
                error.statusCode = 422;
                throw error;
            }

            loadedUser = user;
            return bcrypt.compare(password, user.password);
        })
        .then(isEqual=> {
            if (!isEqual) {
                const error = new Error('Incorrect Password!');
                error.statusCode = 422;
                throw error;
            }

            const token = jwt.sign(
                {
                    email: loadedUser.email,
                    userId: loadedUser._id.toString()
                },
                'someSecretUsedForEncryption',
                { expiresIn: '1h' }
            );

            res.status(200).json({token: token, userId: loadedUser._id.toString()});
        })
        .catch(err => {
            if (!err.statusCode) {
                err.statusCode = 500;
            }
            next(err);
        });
};

exports.getUserStatus = (req, res, next) => {
    User.findById(req.userId)
        .then(user => {
            if (!user) {
                const error = new Error('User not found!');
                error.statusCode = 404;
                throw error;
            }

            res.status(200).json({status: user.status})
        }).catch(err => {
            if (!err.statusCode) {
                err.statusCode = 500;
            }
            next(err);
    });
};

exports.updateUserStatus = (req, res, next) => {
    const newStatus = req.body.status;
    User.findById(req.userId)
        .then(user => {
            if (!user) {
                const error = new Error('User not found!');
                error.statusCode = 404;
                throw error;
            }
            user.status = newStatus;
            return user.save();
        }).then(result => {
            res.status(200).json({message: 'User Status updated.'})
        }).catch(err => {
            if (!err.statusCode) {
                err.statusCode = 500;
            }
            next(err);
    });
};
