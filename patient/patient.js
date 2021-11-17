"use strict";

const io = require("socket.io-client");
const faker = require("faker");

let host = "http://localhost:8080/clinic";

const socket = io.connect(host);



// =====================================================================
// Messages Queues
// =====================================================================

socket.emit("getAll", { type: "patient" });
socket.emit("getAll", { type: "thanks" });

socket.on("notification", (message) => {
  console.log(`New Message >>> You Ordar has been rcieved : ${message.payload}`);
  socket.emit("received", { id: message.id });
});

socket.on("thanks", (message) => {
    console.log(`New Message >>>  ${message.payload}`);
    socket.emit("received", { id: message.id });
  });
  


// =====================================================================
// Dash board
// =====================================================================

socket.on("newPatient", (payload) => {
  let patient = {
    id: faker.datatype.uuid(),
    patient: faker.name.findName(),
    address: faker.address.streetAddress(),
    messageBody: `I want this drug from ${payload.store}`,
    drug: faker.commerce.productName(),
    store: payload.store,
  };

  let message = {
    messageBody: `Patient ${patient.id} want drug from ${payload.store}`,
  };

  socket.emit("patient-detect", patient);
  socket.emit("pharmacyMsg", message);
});


socket.on("delivered", (payload) => {
    setTimeout(
      () =>{
          socket.emit('delivered-detect',payload);   
      },
      3000
    );
  });
