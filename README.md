User login and registration


This is a small sample user login and registration project. It has following usecases :

1. Login 
 - User should enter username and password to login
 - Only existing users with valid username and password can login
 - User will be redirected to welcome page in case of successful login
 - Usre will be redireted back to login page in case of failure, with error message (currently not working)
 
2. Registration 
 - A new user can register to existing system by supplying a valid name, username, password, email and other information
 - If the username already exists user will be prompted with same message (not working currently) and redirected back to the same registartion page
 - If user gets registered successfully user will be redirected to welcome page
 
3. Welcome page
 - User can only go to welcome page through loging or registration
 - If user tries to access welcome page which is not associated with any session, user will be redirected to login page
 
Framework User:
- Nodejs, express.js for basic website infrastructure
- Mongoose, for connection and operation with MongoDB
- Passport, for authentication purpose

Usage: 
- Download the source code
- Navigate to project folder, which should have package.json
- Run > npm install
- 'localhost:3000/' or 'localhost:3000/login' to go to login page
- 'localhost:3000/register' to go to registration page or click 'New User?' link on login page
- 'localhost:3000/welcome' to go to welcome page. Incase of invalid session user will be redirected to the login page

References:
- http://danialk.github.io/blog/2013/02/23/authentication-using-passportjs/
- http://passportjs.org/guide/authenticate/
- http://evanhahn.com/understanding-express-js/
- http://net.tutsplus.com/tutorials/javascript-ajax/introduction-to-express/
- http://stackoverflow.com/questions/8051631/creating-registration-and-login-form-in-node-js-and-mongodb
- http://dailyjs.com/2010/12/06/node-tutorial-5/

TODOs:
- Flash messages for erros are not working currently, need to fix that
- Validation for input format and compulsory input fields
- Password is being sent without any security (https), need to find some way to mock the https behavior