let guestCount = 0;

const initializeSocket = (io) => {
  io.on("connection", (socket) => {

    guestCount++;

    const username = `Guest${guestCount}`;

    console.log(`${username} connected`);

    socket.emit("user-connected", {
      username,
      socketId: socket.id,
    });

    
    socket.on("cursor-move", (data) => {

      socket.broadcast.emit("cursor-move", {
        username,
        x: data.x,
        y: data.y,
      });

    });

    socket.on("disconnect", () => {
      console.log(`${username} disconnected`);
    });

  });
};

module.exports = initializeSocket;