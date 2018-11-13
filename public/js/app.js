var socket = io();


socket.on('connect', function(){
  console.log('Connnected to the socket server');
});

socket.on('message', function(message){
  var timeStampMoment = moment.utc(message.timeStamp);

  console.log("New message is "+message.text);
  jQuery('.message').append('<p><strong>'+timeStampMoment.local().format('hh:mm a')+'</strong> : '+message.text+'</p>');
});


var $form = jQuery('#message-form');

$form.on('submit', function (event){
  event.preventDefault();
  var message = $form.find('input[name=message]');
  socket.emit('message', {
    text: message.val()
  });
  message.val('');
});
