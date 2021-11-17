"use strict";
const uuid = require("uuid").v4;
const port = process.env.PORT || 8080;
const io = require("socket.io")(port);

const clinic = io.of("/clinic");

let msgQueue = {
  pharmacy: {},
  patient: {},
  delivered: {},
};

clinic.on("connection", (socket) => {
  console.log("Welcome to clinic server");
  console.log("Connecion", socket.id);

  // To trigger connection
  socket.on("newPatient-detect", (payload) => {
    clinic.emit("newPatient", payload);
  });

  socket.on("patient-detect", (payload) => {
    console.log(`NEW PATIENT :`, { Time: new Date(), payload: payload });
    clinic.emit("getDrug", payload);
  });

  socket.on("drug-detect", (payload) => {
    console.log(`NEW DRUG :`, { Time: new Date(), payload: payload });
    clinic.emit("delivered", payload);
  });

  socket.on("delivered-detect", (payload) => {
      console.log('=================',payload);
   console.log(`Order Has Been Delivered :`, {Time: new Date(),payload: payload,});
   clinic.emit("post-delivered", payload);
  })

  // =====================================================================
  // Messages Queues
  // =====================================================================

  // Add message to pharmacy queue
  socket.on("pharmacyMsg", (payload) => {
    const id = uuid();
    msgQueue.pharmacy[id] = payload.messageBody;
    console.log("after adding New Order to Msg Q >>", msgQueue.pharmacy);
    clinic.emit("order", { id: id, payload: msgQueue.pharmacy[id] });
  });

  // Add message to patient queue
  socket.on("patientMsg", (payload) => {
    console.log("==================================================");
    const id = uuid();
    msgQueue.patient[id] = payload.messageBody;
    console.log("after adding New Order to Msg Q >>", msgQueue.patient);
    clinic.emit("notification", { id: id, payload: msgQueue.patient[id] });
  });


  // Add message to patient queue
  socket.on("deliveredMsg", (payload) => {
    console.log("==================================================");
    const id = uuid();
    msgQueue.delivered[id] = payload.messageBody;
    console.log("after adding New Order to Msg Q >>", msgQueue.delivered);
    clinic.emit("thanks", { id: id, payload: msgQueue.delivered[id] });
  });


  socket.on("received", (payload) => {
    delete msgQueue.pharmacy[payload.id];
    delete msgQueue.patient[payload.id];
    delete msgQueue.delivered[payload.id];
    console.log("after deleting from Msg Q >>", msgQueue);
  });

  socket.on("getAll", (payload) => {
    if (payload.type === "pharmacy") {
      Object.keys(msgQueue.pharmacy).forEach((id) => {
        socket.emit("order", {
          id: id,
          payload: msgQueue.pharmacy[id],
        });
      });
    }

    if (payload.type === "patient") {
      Object.keys(msgQueue.patient).forEach((id) => {
        socket.emit("notification", {
          id: id,
          payload: msgQueue.patient[id],
        });
      });
    }

    if (payload.type === "thanks") {
        Object.keys(msgQueue.delivered).forEach((id) => {
          socket.emit("thanks", {
            id: id,
            payload: msgQueue.delivered[id],
          });
        });
      }
  });
});
