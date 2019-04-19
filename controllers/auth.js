exports.getLogin = (req, res, next) => {
    // const isLoggedIn = req
    //     .get('Cookie')
    //     .split(';')[1]
    //     .trim()
    //     .split('=') === 'true';
    res.render('auth/login', {
        path: '/login',
        pageTitle: 'Login',
        isAuthenticated: false
    });
};

exports.postLogin = (req, res, next) => {
    res.setHeader('Set-cookie', 'loggedIn=true; Max-age=10');
    res.redirect('/');
}

/**
 * res.setHeader('Set-cookie', 'loggedIn=true; Max-age=10');
 * //sets expiry to max of 10 seconds
 *
 * res.setHeader('Set-cookie', 'loggedIn=true; Secure');
 * // sets only for http
 *
 * res.setHeader('Set-cookie', 'loggedIn=true; HttpOnly');
 * // sets only for http requests
 */
