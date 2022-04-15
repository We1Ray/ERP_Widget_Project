const users = []; //users  is an empty array, as when initialized there are none yet
//function to add User takes three parameters, id of a socket instance

const addUser = ({ id, room, userInfo }) => {
  try {
    info = userInfo;
    room = room.trim().toLowerCase();
    //we check if the new user is trying to signup for the same room and the same user name, which cant be allowed
    //we do this by going through the user array and checking every single user to see if there is any match
    const existingUser = users.find(
      (user) => user.room === room && user.info.name === userInfo.name
    );
    //if the user does already exist, return an error
    const user = { id, info: userInfo, room };

    users.push(user);

    return { user }; //return the user so we know which one was pushed
  } catch (error) {
    return error;
  }
};
//function to remove user, only takes in a single parameter(id of the user to remove)
const removeUser = (id) => {
  try {
    const index = users.findIndex((user) => user.id === id); //checks to see if there is a user with that id passed in
    if (index !== -1) {
      return users.splice(index, 1)[0];
    }
  } catch (error) {
    console.log(error);
  }
};
//if the user exists we return it
const getUser = (id) => {
  try {
    return users.find((user) => user.id === id);
  } catch (error) {
    console.log(error);
  }
};
//.filter creates a new array with all elements that pass the test implemented in the function
//we return an array with all the users in the room
const getUsersInRoom = (room) => {
  try {
    return users.filter((user) => user.room === room);
  } catch (error) {
    console.log(error);
  }
};

module.exports = { addUser, removeUser, getUser, getUsersInRoom };
