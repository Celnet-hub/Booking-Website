# Business Summary: Our Pick up service is available Monday to Saturdays. You can do it yourself or on our website by signing up and scheduling all your deliveries

## [Link](https://shielded-savannah-93545.herokuapp.com/) to Website (website is still a work in progress)

## Bugs Fixed

* cannot get /reset/token : This was fixed by changing the body of the email address sent to the users to  include

 ```nodejs
"http://" + req.headers.host + "/users/resetpassword/" + token
```

instead of

```nodejs
"http://" + req.headers.host + "/resetpassword/" + token
```

* TypeError - user.setPassword is not a function:  Userschema.plugin(passportLocalMongoose):

* MongoError: E11000 duplicate key error collection: Cluster0.users index: username_1 dup key: { username: null } : was resolved by dropping some indexes in the database. (read more on it)

* Refused to apply style from 'http://localhost:4000/pages/src/Styles/style.css' because its MIME type ('text/html') is not a supported stylesheet MIME type, and strict MIME checking is enabled: was resolved by modifying the path for href.
    instead of:

```http
    <link rel="stylesheet" href="pages\src\Styles\style.css">
```

I used:

```http
<link rel="stylesheet" href="\src\Styles\style.css">
```
