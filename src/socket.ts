import { io } from "socket.io-client";
const local ="http://localhost:3000"
const online ="https://tictactoebackend-1.onrender.com"
const railwayUrl="https://tictactoebackend-production-7055.up.railway.app/"
export const socket= io(railwayUrl,{
    transports: ["websocket"],
  upgrade: false,
  autoConnect: false,
})