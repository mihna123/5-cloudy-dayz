# 5-cloudy-dayz

### Description

Repository for the Levi9 5 days in cloud challenge

### Environment

#### Operating system

Development os for the app is a GNU/Linux OS so it would be most simple  
to run it on a similar Unix type of system. But the Windows OS should  
work as well. It is recomended to have admin privileges.

#### Software needed

+ [nodejs](https://nodejs.org/en) and [npm](https://www.npmjs.com/) (recomended version > 10.0)
+ [postgreSQL](https://www.postgresql.org/) (recomended version > 8.0)


### To run the app

1. Create a database using postgreSQL ([documentation for that](https://www.postgresql.org/docs/16/tutorial-createdb.html))

2. Make sure to replace all environment values in the ".env" file (You can use the actual anvironment variables but i find this easier when developing) since these values are used to access the database. The most important ones are  
> PGUSER (Name of the user that can access the database - default is postgres)
> PGPASSWORD (Password for that user)
> PGDATABASE (Name of the database)

3. Run the index.js file with the command:  
`$ node index.js`

4. The server is ready to listen to requests now

### Tech stack

+ Nodejs
+ Express
+ PostgreSQL



