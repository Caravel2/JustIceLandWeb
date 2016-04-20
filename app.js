var  express = require('express');

var app = express();

var host = '127.0.0.1';
var port = 5100;

app.set('port',process.env.PROT || port);
app.set('views', __dirname + '/views');
app.set('view engine', 'ejs');
app.use(express.static( __dirname + '/public'));


app.use('/test',function(req, res){
  console.log("test");
  res.render("test");
}); 

app.use('/game',function(req, res){
  console.log("game");
  res.render("game");
}); 



app.listen(port, host);
console.log("Express server listening on port %d",port);