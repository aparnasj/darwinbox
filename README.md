# Google Oauth Assignment

Google Oauth Login Assignment

## Getting Started

These instructions will get you a copy of the project up and running on your local machine for development and testing purposes. See the below notes on how to deploy the project on a live system.

### Prerequisites

This project needs nodeJs v6 or above, mongodb running on port 27017 and below npm modules to get it running.

```
"bluebird": "^3.5.3",
    "body-parser": "^1.18.3",
    "cors": "^2.8.5",
    "express": "^4.16.4",
    "express-session": "^1.15.6",
    "googleapis": "^37.2.0",
    "jsonwebtoken": "^8.4.0",
    "lodash": "^4.17.11",
    "mongoose": "^5.4.10",
    "morgan": "^1.9.1",
    "package.json": "^2.0.1",
    "uuid": "^3.3.2"

```

### Installing

Go to root folder of project(package.json) and run npm install to install the dependencies


```
$ npm install
```

```
Create a database with name 'googleOauth'
```

### Run project

To create initial whitelisted email database. Run the following script.

You can modify the list of email addresses in src/db/scripts/initdb.js file.

```
node src/db/scripts/initdb.js
```

To run project enter the following command

```
$ cd src
$ node app.js
```

Now the server will be running on port 6001

To open home page: http://localhost:6001/static/index.html

Login with google + account. Once login, user info will be stored into the db. If the email address is whitelisted dashboard page with invite form is shown.

To get list of all users use the following cURL

For now get the auth token from developer tools in browser

```
curl -X GET \
  http://localhost:6001/api/getAllUsers \
  -H 'Authorization: eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VyIjoiNWM3NzQyNTdlYTI1YjE2Y2RiZDlhZmU1IiwiZW1haWxJZCI6ImFwcHUuMjQxMEBnbWFpbC5jb20iLCJpYXQiOjE1NTEzNjM5ODV9.8yyLi80DlW0vUsfzQ4C1J5yFajgSL4EWY0HFx528ZhY' \
  -H 'Content-Type: application/json' \
  -H 'Postman-Token: 5e8df9ed-1714-4522-8016-c224f3110e94' \
  -H 'cache-control: no-cache'

```

## Authors

* **Aparna Sharma** - [My Github](https://github.com/aparnasj)
