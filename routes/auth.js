const express = require('express');
const authController = require('../controllers/auth');
const router = express.Router();
const { check, body } = require("express-validator/check");

const User = require('../models/user');

router.get('/login', authController.getLogin);

router.get('/signup', authController.getSignup);

router.post('/login',
    [
        check('email').isEmail().withMessage('Please enter a valid email').normalizeEmail(),
        body('password', 'Passowrd has to be alphanumeric and of length between 5 and 15 characters')
            .isLength({min: 5, max: 15}).isAlphanumeric().trim()
    ],
authController.postLogin);

router.post('/signup',
    [
        check('email')
            .isEmail()
            .withMessage('Please enter a vaild email.')
            .custom((value , {req}) => {
                // if (value === "test@test.com") {
                //     throw new Error('This email is forbidden.');
                // }
                // return true;

                return User.findOne({email: value})
                    .then(user => {
                        if (user) {
                            return Promise.reject('The email already exists');
                        }
                    });
            }).normalizeEmail(),

        body('password',
            'Password must be alphanumeric of min length 5 and max length 15.'
        ).isAlphanumeric().isLength({min:5, max: 15}).trim(),
        body('confirmPassword').custom((value, {req}) => {
            if (value !== req.body.password){
                throw new Error("Passwords don't match");
            }

            return true;
        }).trim()
    ],
    authController.postSignup
);

router.post('/logout', authController.postLogout);

router.get('/reset', authController.getReset);

router.post('/reset', authController.postReset);

router.get('/reset/:token', authController.getNewPassword);

router.post('/new-password', authController.postNewPassword);

module.exports = router;