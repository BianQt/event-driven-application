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
    messageBody: `We have your order - ${drug.name}`,
  };

  socket.emit("drug-detect", drug);
  socket.emit("patientMsg", message);
});


socket.on("post-delivered",(payload)=>{
  let message = {
    messageBody: `Thank you for purchase`,
  };

  socket.emit("deliveredMsg", message);
})