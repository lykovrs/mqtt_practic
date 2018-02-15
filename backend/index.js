const app = require("express")();
const http = require("http").Server(app);
const io = require("socket.io")(http);
const port = process.env.PORT || 3001;

const mqtt = require("mqtt");
const EventEmitter = require("events");

const client = mqtt.connect("mqtt://test.mosquitto.org");

class SendFromFronEmitter extends EventEmitter {}

const messageSendEmitter = new SendFromFronEmitter();

messageSendEmitter.on("frontEvent", message => {
  console.log("message from front ===>", message);
  client.publish("presence", message);
});

messageSendEmitter.on("IotEvent", message => {
  console.log("message from IOT ++++>", message.toString());
});

// соединение iot
client.on("connect", function() {
  client.subscribe("presence");
});

client.on("message", function(topic, message) {
  messageSendEmitter.emit("IotEvent", message);
  console.log("iot changes detected -->", topic, message.toString());
});

// соединение ws
io.on("connection", function(socket) {
  socket.on("chat message", function(msg) {
    messageSendEmitter.emit("frontEvent", msg);
    io.emit("chat message", msg);
  });
});

http.listen(port, function() {
  console.log("listening on *:" + port);
});

app.get("/", function(req, res) {
  res.sendFile(__dirname + "/index.html");
});
