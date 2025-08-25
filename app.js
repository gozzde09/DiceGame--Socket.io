const express = require("express");
const app = express();
const http = require("http");
const server = http.createServer(app);
const { Server } = require("socket.io");
const io = new Server(server);
const port = 3000;
const cors = require("cors");
app.use(cors());
app.use(express.json());
app.use(express.static("public"));
// Mongoose
const MessageModel = require("./models/messageModel");
const ResultModel = require("./models/resultModel");

const connectionMongoDB = require("./connectionMongoDB");
const { CLIENT_RENEG_LIMIT } = require("tls");
connectionMongoDB();

app.use(express.static("public"));

// Endpoint för att visa meddelanden från mongoDB
app.get("/messages", async (req, res) => {
  try {
    const allMessages = await MessageModel.find();
    return res.status(200).json(allMessages);
  } catch (error) {
    return res.status(500).json({
      error: error.message,
    });
  }
});
//results
app.get("/results", async (req, res) => {
  try {
    const allResults = await ResultModel.find();
    return res.status(200).json(allResults);
  } catch (error) {
    return res.status(500).json({
      error: error.message,
    });
  }
});

const colors = ["orange", "#17a2b8", "purple", "green", "darkpink", "brown"];
const userColors = {};
let colorIndex = 0;

io.on("connection", (socket) => {
  console.log(`A client with id ${socket.id} connected to the chat!`);

  const userColor = colors[colorIndex % colors.length];
  userColors[socket.id] = userColor;
  colorIndex++;

  // Skicka tärningskastet till alla anslutna klienter
  socket.on("diceRoll", (data) => {
    io.emit("newDiceRoll", { data, color: userColors[socket.id] });
    // console.log(data);
    const parts = data.match(
      /<i>Kast (\d+): (.+) fick (\d+). Totalt: (\d+)<\/i>/
    );
    if (!parts) {
      console.error("Invalid data format:", data);
      return;
    }
    const userName = parts[2];
    const kastNummer = parseInt(parts[1]);
    const kastPoang = parseInt(parts[3]);
    const totalPoang = parseInt(parts[4]);
    const dateTime = new Date();

    // Sparar till MongoDB med Mongoose
    const newResult = new ResultModel({
      userName: userName,
      kastNummer: kastNummer,
      kastPoang: kastPoang,
      totalPoang: totalPoang,
      date: dateTime,
    });
    newResult.save();
    socket.on("disconnect", () => {
      delete userColors[socket.id];
      User.deleteOne({ socketId: socket.id });
    });
  });

  // Skicka meddelandet till alla anslutna klienter
  socket.on("chatMessage", (msg) => {
    //console.log('Meddelanden: ' + msg.message)
    // io.emit('newChatMessage', msg.user + ' : ' + msg.message);
    io.emit("newChatMessage", { user: msg.user, message: msg.message });
    let today = new Date();
    let date =
      today.getFullYear() +
      "-" +
      (today.getMonth() + 1) +
      "-" +
      today.getDate();
    let time = today.getHours() + ":" + today.getMinutes();
    let dateTime = date + " " + time;
    let user = msg.user;
    let message = msg.message;

    // Sparar till MongoDB med Mongoose
    const newMessage = new MessageModel({
      message: message,
      user: user,
      date: dateTime,
    });
    newMessage.save();
  });

  socket.on("disconnect", () => {
    console.log(`Client ${socket.id} disconnected!`);
    User.deleteOne({ socketId: socket.id });
    delete userColors[socket.id];
  });
});

server.listen(port, () => {
  console.log(`Socket.IO server running at http://localhost:${port}/`);
});
