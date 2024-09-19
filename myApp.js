let express = require('express');
let app = express();
var bodyParser = require("body-parser");
require('dotenv').config()
console.log("Hello World")


app.use(function middleware(req, res, next) {
    // Do something
    // Call the next function in line:
    var string = req.method + " " + req.path + " - " + req.ip;
    console.log(string)
    next();
})
/*Middleware functions are functions that take 3 arguments: the request object, 
the response object, and the next function in the application’s request-response cycle. 
These functions execute some code that can have side effects on the app, and usually add 
information to the request or response objects. They can also end the cycle by sending a 
response when some condition is met. If they don’t send the response when they are done, 
they start the execution of the next function in the stack. This triggers calling 
the 3rd argument, next(). 

Let’s suppose you mounted this function on a route. When a request matches the route, 
it displays the string “I’m a middleware…”, then it executes the next function in the stack. 
In this exercise, you are going to build root-level middleware. As you have seen in challenge 4,
to mount a middleware function at root level, you can use the app.use(<mware-function>) method.
In this case, the function will be executed for all the requests, but you can also set more
specific conditions. For example, if you want a function to be executed only for POST requests,
you could use app.post(<mware-function>). Analogous methods exist for all the HTTP verbs 
(GET, DELETE, PUT, …).

Express evaluates functions in the order they appear in the code. This is true for middleware too. 
If you want it to work for all the routes, it should be mounted before them.
*/

app.get("/now",(req, res, next) => {
      req.time = new Date().toString();
      next();
    },
    (req, res) => {
      res.send({
        time: req.time
      });
    }
  );

/*Middleware can be mounted at a specific route using app.METHOD(path, middlewareFunction). 
Middleware can also be chained within a route definition. 

This approach is useful to split the server operations into smaller units. 
That leads to a better app structure, and the possibility to reuse code in different places. 
This approach can also be used to perform some validation on the data. 
At each point of the middleware stack you can block the execution of the current chain 
and pass control to functions specifically designed to handle errors. 
Or you can pass control to the next matching route, to handle special cases. 
We will see how in the advanced Express section.*/

app.get("/:word/echo", (req, res) => {
    const { word } = req.params;
    res.json({
      echo: word
    });
  });

/*When building an API, we have to allow users to communicate to us what they want to get
 from our service. For example, if the client is requesting information about a user stored
in the database, they need a way to let us know which user they're interested in. 
One possible way to achieve this result is by using route parameters. 
Route parameters are named segments of the URL, delimited by slashes (/). 
Each segment captures the value of the part of the URL which matches its position. 
The captured values can be found in the req.params object. */

app.get("/name", function(req, res) {
  var { first: firstName, last: lastName } = req.query;
  // Use template literals to form a formatted string
  res.json({
    name: `${firstName} ${lastName}`
  });
});
/*Another common way to get input from the client is by encoding the data after the route
path, using a query string. The query string is delimited by a question mark (?), 
and includes field=value couples. Each couple is separated by an ampersand (&). 
Express can parse the data from the query string, and populate the object req.query. 
Some characters, like the percent (%), cannot be in URLs and have to be encoded in a 
different format before you can send them. If you use the API from JavaScript, 
you can use specific methods to encode/decode these characters.*/

app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

/*Besides GET, there is another common HTTP verb, it is POST. POST is the default method 
used to send client data with HTML forms. In REST convention, POST is used to send data 
to create new items in the database (a new user, or a new blog post). You don’t have a 
database in this project, but you are going to learn how to handle POST requests anyway.

In these kind of requests, the data doesn’t appear in the URL, it is hidden in the 
request body. The body is a part of the HTTP request, also called the payload. 
Even though the data is not visible in the URL, this does not mean that it is private. 
To see why, look at the raw content of an HTTP POST request:

POST /path/subpath HTTP/1.0
From: john@example.com
User-Agent: someBrowser/1.0
Content-Type: application/x-www-form-urlencoded
Content-Length: 20

name=John+Doe&age=25
As you can see, the body is encoded like the query string. This is the default format 
used by HTML forms. With Ajax, you can also use JSON to handle data having a more 
complex structure. There is also another type of encoding: multipart/form-data. 
This one is used to upload binary files. In this exercise, you will use a URL encoded
body. To parse the data coming from POST requests, you must use the body-parser package. 
This package allows you to use a series of middleware, which can decode data in 
different formats*/

app.post("/name", function(req, res) {
  // Handle the data in the request
  var string = req.body.first + " " + req.body.last;
  res.json({ name: string });
});

/*Mount a POST handler at the path /name. It’s the same path as before. 
We have prepared a form in the html frontpage. It will submit the same data of 
exercise 10 (Query string). If the body-parser is configured correctly, you should 
find the parameters in the object req.body. Have a look at the usual library example:

route: POST '/library'
urlencoded_body: userId=546&bookId=6754
req.body: {userId: '546', bookId: '6754'}
Respond with the same JSON object as before: {name: 'firstname lastname'}. 
Test if your endpoint works using the html form we provided in the app frontpage.

Tip: There are several other http methods other than GET and POST. And by convention 
there is a correspondence between the http verb, and the operation you are going to 
execute on the server. The conventional mapping is:

POST (sometimes PUT) - Create a new resource using the information sent with the request,

GET - Read an existing resource without modifying it,

PUT or PATCH (sometimes POST) - Update a resource using the data sent,

DELETE - Delete a resource.

There are also a couple of other methods which are used to negotiate a connection 
with the server. Except from GET, all the other methods listed above can have a 
payload (i.e. the data into the request body). The body-parser middleware works 
with these methods as well.*/

//handler get
app.get("/",(req,res)=>{
    //res.send('Hello Express') // simple text respond
    absolutePath = __dirname + '/views/index.html'
    res.sendFile(absolutePath);/*Behind the scenes, this method will set the appropriate 
    headers to instruct your browser on how to handle the file you 
    want to send, according to its type, Then it will read and send the file */
})

app.use("/public",express.static(__dirname + "/public"))
/* In Express, you can put in place this functionality using the middleware 
express.static(path), where the path parameter is the absolute path of the 
folder containing the assets. 
middleware are functions that intercept route handlers, adding some kind of 
information. A middleware needs to be mounted using the method 
app.use(path, middlewareFunction). The first path argument is optional. 
If you don’t pass it, the middleware will be executed for all requests.

Now your app should be able to serve a CSS stylesheet. 
Note that the /public/style.css file is referenced in the /views/index.html 
in the project boilerplate.*/

/*app.get("/json", (req, res) => {
    res.json({
      message: "Hello json"
    });
  });*/

/* While an HTML server serves HTML, an API serves data. A REST (REpresentational State Transfer)
API allows data exchange in a simple way, without the need for clients to know any detail 
about the server. The client only needs to know where the resource is (the URL), 
and the action it wants to perform on it (the verb). The GET verb is used when you are 
fetching some information, without modifying anything. These days, the preferred data format 
for moving information around the web is JSON. Simply put, JSON is a convenient way to 
represent a JavaScript object as a string, so it can be easily transmitted.

Let's create a simple API by creating a route that responds with JSON at the path /json. 
You can do it as usual, with the app.get() method. Inside the route handler, 
use the method res.json(), passing in an object as an argument. 
This method closes the request-response loop, returning the data. 
Behind the scenes, it converts a valid JavaScript object into a string, 
then sets the appropriate headers to tell your browser that you are serving JSON, 
and sends the data back. A valid object has the usual structure {key: data}. 
data can be a number, a string, a nested object or an array. 
data can also be a variable or the result of a function call, in which case it will be 
evaluated before being converted into a string.*/

app.get("/json", (req, res) => {
    if (process.env.MESSAGE_STYLE === "uppercase") {
        res.json({
            message: "HELLO JSON"
          });
    } else {
        res.json({
            message: "Hello json"
          });
    }
    
  });

  /*The .env file is a hidden file that is used to pass environment variables to your application.
This file is secret, no one but you can access it, and it can be used to store data that you 
want to keep private or hidden. For example, you can store API keys from external services or 
your database URI. You can also use it to store configuration options. By setting configuration 
options, you can change the behavior of your application, without the need to rewrite some code.

The environment variables are accessible from the app as process.env.VAR_NAME. 
The process.env object is a global Node object, and variables are passed as strings. 
By convention, the variable names are all uppercase, with words separated by an underscore. 
The .env is a shell file, so you don’t need to wrap names or values in quotes. 
It is also important to note that there cannot be space around the equals sign when you
are assigning values to your variables, e.g. VAR_NAME=value. Usually, you will put each 
variable definition on a separate line.*/































 module.exports = app;



































 module.exports = app;
