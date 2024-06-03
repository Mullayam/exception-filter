
  

Express.js Exception Filter/Handler

  

  

![Express.js Exception Filter/Handler](https://assets-docs.b-cdn.net/assets/madebyEnjoys.png)

  

  

Overview

--------

  

  

The Express.js Exception Handler is a middleware package designed to streamline error management and enhance the reliability of your Express.js applications. It simplifies the process of handling errors, customizing error messages and status codes, and maintaining clean and consistent error-handling practices.

  

  

Features

--------

  

  

- Robust Error Handling: Efficiently manage various error types, from validation errors to unexpected server issues.

  

  

- Customization: Easily customize error messages and HTTP status codes to provide meaningful responses to clients.

  

- Integration: Seamlessly integrate error-handling middleware into your Express.js application stack.

- Best Practices: Follow industry best practices for error handling to improve the professionalism and reliability of your application.

  

Installation

------------

  

  

You can install the Express.js Exception Filter/Handler package via npm: 

```bash
npm  i  @enjoys/exception
```
# Usage

What is New ?
Exceptions =>
- createHandlers() // will return  ExceptionHandler, UnhandledRoutes,CustomExceptionHandler
- ServerErrorException
- NotFoundException
- UnAuthorizedException
- BadGatewayException
- DuplicateEntryException
- ForbiddenException
- PayloadTooLargeException
- TooManyRequestException
- MethodNotAllowedException
- UnacceptableException
- NotImplementedException
```javascript
app.get("/my/route",()=> new ServerErrorException();
 // constructor ServerErrorException({stack:<string or object>) , rest are same...
```
 
----- 
1. Import the package:

ES5 Syntax

```javascript
const { HttpException} = require('@enjoys/exception');
```

ES6 Syntax

```javascript
import {HttpException} from'@enjoys/exception';
```
 To Handle Undefined Route throughout your App, use this:
 ```javascript 
 import {createHandlers} from'@enjoys/exception';  // ES6 Syntax
 // const { createHandlers} = require('@enjoys/exception');   // ES5 Syntax
const { ExceptionHandler, UnhandledRoutes,CustomExceptionHandler } =  createHandlers();
//... your app code
app.use(UnhandledRoutes); 
// call this at the last of all routes and before the (global/app) exception handler
```

 
To Handle Exception throughout your App, use this:
1. Add the middleware to your Express.js application:

```javascript
// call this function after routes has been called otherwise won't works
app.use((err,req,res,next)=>{
if(err) return  ExceptionHandler(err,req,res,next) // handler error and send response
next() // call when no err found
})
// OR 
app.use(ExceptionHandler);
// OR 
app.use(CustomExceptionHandler);
```

1. Customize error handling and responses as needed in your routes and controllers.

```javascript

routes.all("*",Exception.HttpException.ExceptionHandler,...)

```

## Throw an Exception

```js
new HttpException({
 name:"auto suggestions",// name is required.
message:"<your-message>",
stack:"your stack must be string or a object"
})
//for auto suggestion press, ctrl+space
// More Examples
new DuplicateEntryException({
 name:"auto suggestions", // for all defined exception name and message are optional.
message:"<your-message>",
stack:"your stack must be string or a object"
})
```
Contributing
------------

  

We welcome contributions from the community. If you have ideas for improvements or encounter any issues, please open an [issue](https://github.com/Mullayam/exception-filter/issues) or submit a pull request.

License
-------

  

This project is licensed under the MIT License

If you have any questions or need assistance, feel free to contact us at <hello@enjoys.in>.

Feel free to adapt this template to your specific project, including adding actual links, installation steps, and contact information.