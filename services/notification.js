exports.Noti = function(io) {
  io.sockets.on("connection", async function(socket){
    const users = require("../controllers/user.js");
    const db = require("../models");
    const NotiUser = db.notiusers;
    const { v4: uuidv4 } = require('uuid');

    // Everytime a client logs in, display a connected message
    console.log("Server-Client Connected in Noti!");
    console.log("Socket Id in Noti : " + socket.id); 
    console.log("User Id from Header : " + socket.handshake.headers['x-userid']); 

    const userId = socket.handshake.headers['x-userid'];

    socket.join(userId);

    /* var deleted  = await NotiUser.destroy({ 
      where : {user_id : userId}
    }); */

    /* console.log(`User Id is '${userId}'`);
    const user = await users.findRoleByUser(userId);

    if(user != null){
      var notiUser = {};
      notiUser.user_id = userId;
      notiUser.role_id = user.role_id;
      notiUser.id = uuidv4();
      notiUser.socket_id = socket.id;

      NotiUser.create(notiUser);
    } */

    socket.on("disconnect", async function(){
      // Everytime a client logs out, display a disconnected message
      console.log("Server-Client Disconnected in Noti!");
      console.log("Socket Id in Noti Disconnecting : " + socket.id);
      
      socket.leave(userId);

      /* var deleted  = await NotiUser.destroy({ 
        where : {socket_id : socket.id}
      }); */
    });

    /* socket.on('userId',async function (data) {
      
    })   */   

    //io.to(`${socket.id}`).emit('newclientconnect', { description: 'Hey, welcome!'});
  });  
};