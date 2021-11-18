"use strict";

const io = require("socket.io-client");

let host = "http://localhost:8080/clinic";

const socket = io.connect(host);


setInterval(() => {
  let newOrder = {
    store: "Pharmacy One",
  };

  socket.emit("newPatient-detect", newOrder);
}, 6000);
