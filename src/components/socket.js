import { io } from "socket.io-client";

// const socket = io("ws://137.184.130.244:4000", {
//   transports: ["websocket"],
// });

// const socket = io("ws://137.184.130.244:4500", { transports: ["websocket"] });

//local
const socket = io("ws://137.184.130.244:1993", { transports: ["websocket"] });

export default socket;
