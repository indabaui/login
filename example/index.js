var express = require('express')

var env = {
  lydianEndpoint: process.env.INDABA_TEST_ENDPOINT,
  clientId: process.env.INDABA_TEST_CLIENT,
  clientSecret: process.env.INDABA_TEST_SECRET,
};
var authenticate = require('indaba-auth')(env)

var app = express();
app.use(express.static(__dirname));
app.use(express.static(__dirname + '/../build'));
app.use(express.static(__dirname + '/../public'));
app.use(express.bodyParser());
app.use('/login', authenticate.middleware);

var port = 4000;
app.listen(4000);
console.log("visit port 4000");
