var name = getQuerVariable('name') || 'Anonymous';
var  room = getQuerVariable('room');
var socket = io();

//console.log(name + ' Joined '+room);
$('#room').text(room);

socket.on('connect', function(){
//  console.log('Connnected to the socket server');
  socket.emit('joinRoom', {
    name: name,
    room: room
  });
});

socket.on('message', function(message){
  var timeStampMoment = moment.utc(message.timeStamp);
  //var $message = jQuery('.message');

  //console.log("New message is "+message.text);
  $('.message').append('<p><strong>'+message.name+' '+timeStampMoment.local().format('hh:mm a')+'</strong></p>');
  $('.message').append('<p>'+message.text+'</p>');
});


var $form = $('#message-form');

$form.on('submit', function (event){
  event.preventDefault();
  var message = $form.find('input[name=message]');
  socket.emit('message', {
    name: name,
    text: message.val()
  });
  message.val('');
});
