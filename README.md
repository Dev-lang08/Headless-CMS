-> download the code
-> install the dependencies
-> change the database user and password to the one you are using
-> run the back end using node server.js command inside backend folder
-> run the react application using npm start inside the frontend folder
-> use the application

-> use below line if you get this error{

  code: 'ER_NOT_SUPPORTED_AUTH_MODE',
  
  errno: 1251,
  
  sqlMessage: 'Client does not support authentication protocol requested by server; consider upgrading MySQL client',
  
  sqlState: '08004',
  
  fatal: true
  
}

ALTER USER 'root'@'localhost' IDENTIFIED WITH mysql_native_password BY 'your_mysql_password';
