"use strict";
const faker = require("faker");
const io = require("socket.io-client");

let host = "http://localhost:8080/clinic";

const socket = io.connect(host);

// =====================================================================
// Messages Queues
// =====================================================================

socket.emit("getAll", { type: "pharmacy" });

socket.on("order", (message) => {
  console.log(">>>>>>>>>>>>>>>>>>>>>>>>>>>>");
  console.log(`New Message >>> You have new order : ${message.payload}`);
  socket.emit("received", { id: message.id });
});

// =====================================================================
// Dash board
// =====================================================================

socket.on("getDrug", (payload) => {
  let drug = {
    id: faker.datatype.uuid(),
    name: payload.drug,
    to_address: payload.address,
    status: `vailable`,
    store: payload.store,
  };

  let message = {
    messageBody: `${drug.name}`,
  };

  setTimeout(() => {
    socket.emit("drug-detect", drug);
  }, 2000);
  setTimeout(() => {
    socket.emit("patientMsg", message);
  }, 1000);
});

socket.on("post-delivered", (payload) => {
  let message = {
    messageBody: `Thank you for purchase. If you have any feedback please contact us`,
  };

  socket.emit("deliveredMsg", message);
});
