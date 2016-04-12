var  express = require('express');

var app = express();

var host = '127.0.0.1';
var port = 5100;

app.set('port',process.env.PROT || port);
app.set('views', __dirname + '/views');
app.use(express.static( __dirname + '/views'));
app.use(express.static( __dirname + '/public'));


app.use('/',function(req, res){
  res.send("index.html");
}); 

app.listen(port, host);
console.log("Express server listening on port %d",port);