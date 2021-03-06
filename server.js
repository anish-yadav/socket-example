var express = require('express');
var app = express();
var PORT = process.env.PORT || 3000;
var http = require('http').Server(app);
var io = require('socket.io')(http);
var moment = require('moment');

app.use(express.static(__dirname+'/public'));

var clientInfo = {}; //  = {id: { name: ' ', room : ' '}}

function sendCurrentUser(socket) {
  var info = clientInfo[socket.id];
  var users = [];

  if (typeof info === 'undefined') {
    return;
  }
  Object.keys(clientInfo).forEach(function(socketId){
    var userInfo = clientInfo[socketId];
    if (info.room === userInfo.room) {
      users.push(userInfo.name);
    }
  });
  socket.emit('message',{
    name: 'System',
    text:'Current User : '+users.join(', '),
    timeStamp: moment().valueOf()
  });
}

io.on('connection', function (socket) {

  console.log('connected user via socket.io');

  socket.on('disconnect', function(){
    var userId = clientInfo[socket.id];
    if (typeof clientInfo[socket.id] !== 'undefined') {
      socket.leave(userId.room);
      io.to(userId.room).emit('message',{
        name: ' System',
        text: userId.name + ' left ',
        timeStamp: moment().valueOf()
      });
      delete clientInfo[socket.id];
    }
  });

   socket.on('joinRoom', function(req){
     clientInfo[socket.id] = req;
     socket.join(req.room);
     socket.broadcast.to(req.room).emit('message',{
       name:'System',
       text:req.name + ' joined !',
       timeStamp: moment().valueOf()
     })
   });

      socket.on('message', function (message) {
        //console.log('Message Received :'+message.text);

      if (message.text === '@current') {
        sendCurrentUser(socket);
      } else {
        message.timesTamp = moment().valueOf();
        io.to(clientInfo[socket.id].room).emit('message',message);
      }


      });

        socket.emit('message',{
          name:' System',
          text:'Welcome to the chat app',
          timeStamp:  moment().valueOf()
        });


});


http.listen(PORT, function(){
 console.log('Strating the server');
});
