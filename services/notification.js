var socket_id = "";

exports.Noti = function(io) {
  io.sockets.on("connection",function(socket){
      // Everytime a client logs in, display a connected message
      console.log("Server-Client Connected in Noti!");
      socket_id = socket.id;    

      console.log("Socket Id in Noti : " + socket_id); 

      io.to(`${socket.id}`).emit('newclientconnect', { description: 'Hey, welcome!'});
  });
};