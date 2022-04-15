const DataBaseInfo = require("../DataBaseInfo.json");
const fs = require("fs");
const path = require("path");
const lib = require("../library");
const logger = require("../../../BackEnd_PostgreSQL/logger");
const { Pool } = require("pg");

const { addUser, removeUser, getUser, getUsersInRoom } = require("./users");

const chatSever = (io) => {
  //usually its server.on('request(event name)', requestListener( a function))
  io.on("connection", (socket) => {
    socket.on("join", ({ room, userInfo }, callback) => {
      const { error, user } = addUser({
        id: socket.id,
        room,
        userInfo,
      }); //add user function can only return 2 things a user with error property or user property
      if (!user || error) {
        return callback(error); //error handeling
      } else {
        // const pool = new Pool(DataBaseInfo["DS"]);
        // let sql = fs
        //   .readFileSync(
        //     path.resolve(__dirname, "../sql/chat/get_room_list.sql")
        //   )
        //   .toString();
        // pool.query(
        //   lib.queryConvert(sql, {
        //     token: user.info.account_uid,
        //   }),
        //   (err, res) => {
        //     socket.emit("message", {
        //       user: "admin",
        //       text: `${user.info.name}, welcome to the the room ${user.room}`,
        //     });
        //   }
        // );
        // pool.end();

        // socket.broadcast.to(user.room).emit("message", {
        //   user: "admin",
        //   text: `${user.name}, has joined!`,
        // });
        socket.join(user.room);

        io.to(user.room).emit("roomData", {
          room: user.room,
          users: getUsersInRoom(user.room),
        });
        callback();
      }
    });

    //gets an event from the front end, frontend emits the msg, backends receives it
    socket.on("sendMessage", ({ room, message, userInfo }, callback) => {
      const user = getUser(socket.id); //we havve access to socket from above
      if (!user) {
        const { error, user } = addUser({
          id: socket.id,
          room,
          userInfo,
        });
        if (error) {
          return callback(error); //error handeling
        } else {
          socket.join(user.room);
          io.to(room).emit("message", {
            userInfo: userInfo,
            text: message,
          });

          callback();
        }
      } else {
        //when the user leaves we send a new message to roomData
        //we also send users since we need to know the new state of the users in the room;
        io.to(user.room).emit("message", {
          userInfo: user.info,
          text: message,
        });

        callback();
      }
    });

    //does not take any parameters since we are just unmounting here
    socket.on("disconnect", () => {
      const user = removeUser(socket.id); //remove user when they disconnect
      //admin sends a message to users in the room that _ user has left
      if (user) {
        // io.to(user.room).emit("message", {
        //   user: "Admin",
        //   text: `${user.info.name} has left.`,
        // });
        io.to(user.room).emit("roomData", {
          room: user.room,
          users: getUsersInRoom(user.room),
        });
      }
    });

    socket.on("error", (err) => {
      logger.error(err);
      console.log("error" + err);
    });
  });
};

module.exports = { chatSever };
