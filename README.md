Express js is all about middleware.
These are the steps between req and response.


How to use express.js
const app = express();

app.use((req, res, next) => {
    console.log('in middleware');
    next(); //takes to next app.use callback function
});


This is the app that needs to be passed into http.createServer(app);


app.get --> same as app.use
app.post, put, patch, delete can be used to filter the type of method

note that: use will not do an exact match but get, post will do



Express concepts: All about middleware
1. importing and creating a server
2. adding and managing different routes using app.use
3. difference between app.get and app.use
4. using the body parser
5. using the express Router, express.Router
6. Adding an error page for /skndks
7. All routes have same satrting can be split where there are registered,
   eg: app.use('/admin', adminRoutes);
8. Using path to add html pages to the route
9. Adding a utility path method path.dirname(process.mainModule.filename);
10. Serving static files using app.use(express.static(path.join(__dirname, 'public')));



Path.join
This has to be used to contruct the path instead of using / or \ cause This
detects the operation system and creates the path acordingly hence works on
windows, linux and mac.
__dirname gives the current directory.


Secyion 6: Adding Dynamic content
1. First approch: adding in constants, problem is that when you do this,
   and open the same url in two differnt browsers, the constant will be the same which should never happen
2. Templating engines:
        npm install --save ejs pug express-handlebars
3. app.set is used to set values globally.
4. Use app.set to add "view engine" and "views" to the express project.
5. now you can use res.render instead of res.sendFile . Just like React


Section 8: Dynamic routing (cool section)
1. We navidate to details of a product using <form action="/product/<%= product.id %>
   Then we capture this usin, router.get('/products/:productId') and display the details,
   access it using , req.params.productId
2. When you click on add to cart, i send back the id of product as an value, how?
   <input type="hidden" name="productId" value=<%= product.id %> > , access it using,
   req.body.productId
3. Passing query params, url that is after ?edit=true& so on. Access using "req.query.edit".
   Aint this awesome.

Section 9: SQL introduction
1. SQL: structured query language. They have tables that have one-one, one-many, many-many relations.
   They are defined through a schema. Queries are commands to perform data operations.
2. NoSQL tables are called collections which contain documents. No table has a schema,
   Just store data in JSON fromat, has duplicate data stored.

Section 12
1. We have finsihed using NoSQL -> mongodb which is really good.
2. Works based on asynchronous then and catch methods. We basically created a db in the clousd and then
   acessed it in our local using mongodb compass.
3. Code is pretty easy to use
   npm install --save mongodb

Section 13 Mongoose
1. Just an warpper to help us write the database read write easier.

Section 15: Authentication
1. We use a package called bcryptjs which is used to encrypt the password.
   It has a method called hash that takes two param, one is the item to be decrypted and other
   is the salt value. Bigger the salt value, longer it takes to generate the encrypted password.
   It is asynchronous hence returns a promise.
2. CSRF Attacks
   Stands for "Cross-Site-Request-Forgery"
   Lets say you opened a link from your email when your session is still active on your app, so
   lest say your app is the one that you use to send money.
   Now you are sending money to a guy called B but in background, this information is used to send money
   to C. Looks like user did it but invisible to him.
   So we must ensure that ppl working with our views are using its own session.
   Hence we use CSRF Token.
   npm install --save csurf

   This package provides a method on req, which is csrfToken, 'req.csrfToken()' .
   Adding csrfProtection will make your app fail on any post request due to the absence of it.
3. Connect-flash
   npm install --save connect-flash
   flash is used to pass variables with particular request only. See the code peacefully to understand.
   It aint that completed.

Section 16: Sending Mails
1. In Real world, no one builds their own mail server for their application as its super complex.
   Hence we use a mailserver that already existing. For example: send-grid
2. packages to install,
   npm install --save nodemailer nodemailer-sendgrid-transport
3. nodemailer is to help sending mails, and nodemailer-sendgrid-transport to connect to send-grid
4. you can use username and password here too
   https://nodemailer.com/about/
   using nodemailer, you can configure a mail server host and stuff inside createTransport
   here we are suing sendgrid package to connect to sendgrid. Awesome!
5. Nodemailer Official Docs: https://nodemailer.com/about/
   SendGrid Official Docs: https://sendgrid.com/docs/


Section 18: Validation
1. Express Validator:
   => npm install --save express-validator
        * check('email').isEmail() looks for name="email" value and checks if its an email
        * This returns an error if there is a failure which can be extracted in the controller
        * by validationResult from express-validator/check .
        *
        * Adding with message overrides the default msg from errors.array()[0].msg (see controller).
        * Custom function to write your own check. You must return if test succeded otherwise return false or throw error.
        *
        * body: same as check, we can instead of writing withMessage each time , we can simply pass this as
        * second argument as shown in /signup post.
        *
        * For asyn calls, in custom method as you can see, the expressvalidator waits for the user
        * completion of the promise and then evaluates the result.
2. Sanitizing
   How you want to access the valid data enetered by the user.
   Eg: normalizing email into all small letters, removing whitespace . etc (normalize and trim respectively)

Section 19: Errors
1. Types of errors
   a) Technical error: eg: Mongo server down (show error page to user).
   b) Expected errors: database connection or file upload failed (inform user).
   c) Bugs/Logical errors: eg: user object accessed when it doesn't exist (fix during dev).

2. Errors can be thrown or not thrown.
   When thrown we can catch them by try catch block in synchronous code and by then catch block in asynchronous
   The ones that are not thrown must be validated on the values we recieve, throw error based on that or
   directly handle error.

3. Error middleware
   This is a special middleware.
   When you call "return next(error);" , the middleware starting with error as param gets automatically called.
   This is a feature of express js, if you are wondering which method that is then,
       app.use((err, req, res, next) => {
        res.redirect('/500');
       });

4. Errors
   2xx => successful
   3xx => redirect
   4xx => client side error
   5xx => server-side error

   Sending an appropriate code tells the browser what went wrong. Setting status code does not mean that
   the app has crashed or incomplete.

5. Catching the error:
   To catch error within erro code by the middleware,
        call next(err);
   To catch in sync code,just throwing a new error will do,
        throw new Error();


SECTION 20: FILE UPLOAD AND DOWNLOAD
1. Bodyparser urlencoded basically converts all the form data into text. The request content type in this
   case will be application/x-www-form-urlencoded (default) and we can see in network tab that image will be empty
   as uploaded image cannot be converted to text.
2. Bodyparser does not provide any method to manage multipart/form-data type so we need to install a package
   called MULTER
   => npm install --save MULTER
3. app.use(multer({dest: 'images'}).single('image'));
   This is a simple way to use multer to get the single image from form submit and store in images directory.
4. Files must be downloaded and served as a stream instead of entire data for performance and to avoid memory
   leaks.
5. Statically define the place where you can store the file,
    app.use('/images', express.static(path.join(__dirname, 'images')));
   Basically when you call /images/bla-bla , it looks in the images directory.
6. Multer gives you the file property on req that has path associated with it in the controller after
   extracting the image.
    req.file.path;

SECTION 21: Pagination
1. We need not explitly write an api to mange this, mongodb itslef provides with skip and limit method to skip some items and
   the limit the api call.

SECTION 22: Async requests
1. In this module, we add a js file on client side(browser) to delete the product without reloading the page.
2. We use the http verb DELETE (which is like post or get) to handle this request and we send json data
   in req and res. See /js/admin.js
3. Some dom manipulation tricks:
   a) select based on the name parameter
        var x = document.querySelector('[name=prodId]');
   b) Deleting an element
        x.parentNode.removeChild(x);
   c) Selecting closest ancestor
       x.closest('article');

SECTION 23:
  1. Instructor used stripe to make the payment but i could not do so since the accept payment is not
     available anymore on stripe.
  2. Pretty staright forward so dont worry.
  3. Just added a checkout page that redirects to create invoice.

SECTION 24: REST API
1. Representational state transfer (REST): Transfer data instead of user interfaces.
2. Response Data formats:
        a. html: difficult to parse
        b. Plain text: difficult to parse
        c. XML: Extensible markup lang, HTML is special type of XML (machine readable but relatively verbose)
        d. JSON: Javascript Object Notation (machine readable and concise)
3. Rest API endpoint:
   A combination of the HTTP method and the path.
   Ex: POST /posts/:postId
4. HTTP methods
   a) GET: get resource from server
   b) POST: post resource to a server (create pr append to existing)
   c) PUT: put resource to server (create or overwirte)
   d) PATCH: update parts of existing resource
   e) DELETE: delete resource
   f) OPTIONS: determine whether follow up request is allowed.
5. REST principles:
   a) Unifrom interface: endpoints, request and response must be defined properly, ie what the request needs and what response we get.
   b) Stateless Interactions: No connection history between client and server (like session), each req is handled separately.
   c) cachable: servers may set cache headers to llow client to cache responses
   d) client-server: client is not concerned with sever and its persistant data storage
   e) Layered System: Server may forward requests to other APIs
   f) Code on demand: executable code can be transferred from server to client (very rare in real world).
6. CORS issue
   Cross origin resource sharing
   When we try to send a request form one domain to another, the domain will not accept the response.
   This is a security measure do wee need to set headers in the middleware
        res.setHeader('Access-Control-Allow-Origin', '*');//allow all
        res.setHeader('Access-Control-Allow-Methods', 'GET, POST , PUT, PATCH, DELETE');
        res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');
    If you dont allow headers then you can send s request with content-type header. Sweet.
7. Last but not least: Two requests sent for one post? WTH?
   Yes the first request sent from browser is of type OPTIONS which basically the post request to be sent
   has the actual post method allowed. If it is not allowed then it throws an error. If it is allowed then
   it sends another req with method post and gets the response. If you wondering, the Access-Control-Allow-Methods
   is responsible for this!
   This is a mechanism built into browser for some reason i still dont know.
8. REFERENCE Code
    https://github.com/kira510/JS_EXMAPLES/tree/master/express-rest-api

SECTION 25: working with rest apis
1. codes and its uses:
   422: client made an error
   201: when we created something in database
   200: updating a database maybe

2. Authentication
   This is an app where we use rest api to connect with the backend so we cannot use session approach.
   Instead we use a token based authentication approach, JWT approach.
   JWT = JSON web token (JSON + signature)
        a. the client sends the auth request
        b. on success, the server sends back a JWT
        c. the token is used by the client in every request it makes here after
        d. server validates the signature based on the secret generated by it

3. JWT
   package=> npm install --save jsonwebtoken

   This mpackage can be used to generate a token which can be sent from the response to the client.
   In client we use localStorage to store the token,
        MUST READ: https://developer.mozilla.org/en-US/docs/Web/API/Window/localStorage
        ASLO READ: Using the Web Storage API, Local storage with Window.localStorage, Window.sessionStorage

    Now each request send from client must include this token and we must validate on the server side.
    How can we send the token to backend,
        a. query param : an acceptable approach
        b. in body: wrong cause get requests don't have a body
        c. in headers: best approach as it keeps the url beautiful

    ex: headers: {
            Authorization: 'Barer' + jwt_token
        }
    Barer is a convention used with jwt token to say it is of jwt but we may or may not use it.

SECTION 26: Async await with JS
1.  Use async await to load posts. Async-await helps our JS to load async code as sync code.
    Note that this must be surrounded by try catch

SECTION 27: websockets and socket.io
1.  In node js app,
        => npm install --save socket.io
    socket io is a websocket, which is a protocol or library used to build wed services.
    It is built on the http of the npm, hence requires node server to passed as an arg.

    In client side,
        => npm install --save socket.io-client

    In server side, when we create a request, i basically want to inform all the logged in users,
    through the socket connection.
    We can use either broadcast or emit, broadcast sends to all other users except the one from which
    post was created meanwhile emit sends to everyone.

    We are using emit instead of sending response to update the client side from which the request was made.

    Points to remember:
    They are built on HTTP, established by HTTP handshake so you need running http server. So socket also starts a server that uses this http server.
2.  Learn more:
        https://socket.io/docs/

SECTION 28: GraphQL: finally the wait is over!
1.  Good things always come in the end!
2.  GraphQL is an alternate to using Rest api has it provides certain advantages.
    Consider a scenario where you have a bunch of data and require a defferent elements from the
    data each time.
    The Rest api method will make you to probably write a lot of end points or a single end point with
    a lot of query parameters.
    Thats when our GraphQl comes to play.
3.  In GraphQl we always send a POST request from the client which contains a query expression that defines
    that should be returned.
    We can also use subscriptions in graphql for real time data updates via sockets.
4.  Operation types:
    Query = retrieve data
    Mutation = Manipulate data
    Subscription = Setup a real time connection via websockets.

    On the server side we have definitions for each of these operation types which are like routes and
    resolvers contain the server side logic for each of these definitions like controller.
5.  How it works?
        a. its a normal node (+ Express) server
        b. One single endpoint
        c. Uses POST to retrieve data as request body defines the data to required
        d. Server-side resolver analyses req body, fetches, preapres and returns data.
6.  => npm install --save graphql express-graphql
       graphql: used to defining the schema of the graphql service
       express-graphql: simple server that parses the incoming requests
7.  Validation
    We initially used express validator but now we are using another package called validator.
    => npm install --save validator
8.  Things to learn:
       a. Writing schema with rotquery and rootmutation
       b. Adding validation in resolver function
       c. Authentication (middleware executed before resolver)
       d. Sending requests
       e. try stuff on localhost:8080/graphql for testing

    Please note we can send only JSON object with graphql and we cannot send other types like images.
    For this, we use a rest api to store the iage and return the image url and then use graphql to store this data.
9.  What is graphql
    It is a stateless, client-independent API. Higher flexibility than REST API as they offer
    custom query lnguage that is exposed to client.
    Quries => GET
    Mutation => POST, PUT, PATCH, DELETE

    All graphql requests are directed to one endpoint(POST /graphql)
