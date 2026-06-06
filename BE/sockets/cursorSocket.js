const stars = [
  "Sirius", "Canopus", "Arcturus", "Vega", "Capella", "Rigel", "Procyon", 
  "Achernar", "Betelgeuse", "Hadar", "Altair", "Acrux", "Aldebaran", "Spica", 
  "Antares", "Pollux", "Fomalhaut", "Deneb", "Mimosa", "Regulus", "Polaris"
];

let guestCount = 0;

const initializeSocket = (io) => {
  io.on("connection", (socket) => {
    guestCount++;
    const randomStar = stars[Math.floor(Math.random() * stars.length)];
    const username = `${randomStar}-${guestCount}`;

    console.log(`${username} connected`);

    socket.emit("user-connected", {
      username,
      socketId: socket.id,
    });
    
    socket.on("cursor-move", (data) => {
      socket.broadcast.emit("cursor-move", {
        username,
        socketId: socket.id,
        x: data.x,
        y: data.y,
      });
    });

    socket.on("disconnect", () => {
      console.log(`${username} disconnected`);
      socket.broadcast.emit("cursor-disconnect", { socketId: socket.id });
    });
  });
};

module.exports = initializeSocket;