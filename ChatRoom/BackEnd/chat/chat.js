const DataBaseInfo = require("../DataBaseInfo.json");
const fs = require("fs");
const path = require("path");

const { addUser, removeUser, getUser, getUsersInRoom } = require("./users");

const chatSever = (io) => {
  //usually its server.on('request(event name)', requestListener( a function))
  io.on("connection", (socket) => {
    socket.on("join", ({ name, room }, callback) => {
      const { error, user } = addUser({ id: socket.id, name, room }); //add user function can only return 2 things a user with error property or user property
      if (error) return callback(error); //error handeling
      //no errors
      //emit an event from the backend to the front end with a payload in {} part
      socket.emit("message", {
        user: "admin",
        text: `${user.name}, welcome to the the room ${user.room}`,
      }); // welcomes user to chat
      //broadcast sends a message to everyone besides that specific user
      socket.broadcast.to(user.room).emit("message", {
        user: "admin",
        text: `${user.name}, has joined!`,
      }); //lets everyone know except user that they joined

      socket.join(user.room);
      //emit to the room that the user belongs too, hence why we pass in user.room to get the users in that room
      io.to(user.room).emit("roomData", {
        room: user.room,
        users: getUsersInRoom(user.room),
      });
      callback();
    });

    //gets an event from the front end, frontend emits the msg, backends receives it
    socket.on("sendMessage", (message, callback) => {
      const user = getUser(socket.id); //we havve access to socket from above
      //when the user leaves we send a new message to roomData
      //we also send users since we need to know the new state of the users in the room
      io.to(user.room).emit("message", { user: user.name, text: message });
      callback();
    });

    //does not take any parameters since we are just unmounting here
    socket.on("disconnect", () => {
      const user = removeUser(socket.id); //remove user when they disconnect
      //admin sends a message to users in the room that _ user has left
      if (user) {
        io.to(user.room).emit("message", {
          user: "Admin",
          text: `${user.name} has left.`,
        });
        io.to(user.room).emit("roomData", {
          room: user.room,
          users: getUsersInRoom(user.room),
        });
      }
    });
  });
};

// const getUser = async (factory, access_token) => {
//   let DBConfig = factory ? DataBaseInfo[factory] : {};
//   let parameter = [access_token ? access_token : null];
//   let sql = fs
//     .readFileSync(path.resolve(__dirname, "../sql/chat/get_room_list.sql"))
//     .toString();
//   return { a: "123" };
// };

module.exports = { chatSever };
