# Our Pick up service is available Monday to Saturdays. You can do it yourself or on our website by signing up and scheduling all your deliveries. You can utilize our address book feature on our website to auto populate your shipper and or receiver details. We offer both same day and next day delivery services. However, all orders received after the cut off timeline will be moved to the next day.

## With MAXBusiness, your dispatch needs are covered in bulk. Get your packages delivered to multiple locations with dedicated Champions. Now you can send goods or documents fast and easy.


## Bugs Fixed
* cannot get /reset/token : This was fixed by changing the body of the email address sent to the users to  include 
 ```nodejs
"http://" + req.headers.host + "/users/resetpassword/" + token
``` 
instead of

```nodejs
"http://" + req.headers.host + "/resetpassword/" + token
```
* TypeError - user.setPassword is not a function:  Userschema.plugin(passportLocalMongoose);