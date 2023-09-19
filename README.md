# 5-cloudy-dayz

### Go To
+ [Description](#description)  
+ [Environment](#environment)  
+ [Installation](#installation)   
+ [Tech stack](#tech-stack)  

### Description

Repository for the Levi9 [5 days in cloud](https://5danauoblacima.com/) challenge

### Environment

#### Operating system

Development OS for the app is a GNU/Linux Trisquel OS so it would be most simple to run it on a similar Unix type of system like Mac or Ubuntu. If you have a Windows machine I recomended using the shell that comes with [git installation](https://git-scm.com/download/win) for Windows. It is recomended to have admin privileges. All code examples assume that you are using a compatible shell but you can do everything listed in GUI apps ( _for using postgreSQL on Windows you have **pgAdmin** that comes with default installation, for git there is [GitHub Desktop](https://desktop.github.com/)_ ) 

#### Software needed

+ [git](https://git-scm.com/)
+ [nodejs](https://nodejs.org/en) and [npm](https://www.npmjs.com/) (recomended version > 10.0)
+ [postgreSQL](https://www.postgresql.org/) (recomended version > 8.0)


### Installation
1. Clone the repository to your machine:  
`$ git clone https://github.com/mihna123/5-cloudy-dayz.git`  

2. Go to the repository folder ( _replace with the actual url_ )   
`$ cd route/to/repo/5-cloudy-dayz`

3. Install npm dependencies   
`$ npm install`

4. Create a database using postgreSQL ([documentation for that](https://www.postgresql.org/docs/16/tutorial-createdb.html))
    + Download PostgreSQL ( _find apropriate installer for your sistem [here](https://www.postgresql.org/download/)_ ) 
    + Setup your user name and password ( _this is optional since we can use the default **postgres** user_ )
    + Create a batabase  
    `$ createdb <name-of-the-database>`

5. Replace all environment values in the ".env" file since these values are used to access the database. The most important ones are  
&nbsp;&nbsp;&nbsp;`PGUSER (name of the user that can access the database - default is postgres)`   
&nbsp;&nbsp;&nbsp;`PGPASSWORD (password for that user)`  
&nbsp;&nbsp;&nbsp;`PGDATABASE (name of the database you created in step 4)`   

6. Run the npm start script:  
`$ npm start`

7. The server is ready to listen to requests now

### Tech stack

+ **Nodejs** - _used for the whole backend because of its simplicity_
+ **Express** - _used for the REST api, very fast and good for development_
+ **PostgreSQL** - _used for storing data, open source solution and very reliable_



