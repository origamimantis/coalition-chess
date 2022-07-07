const io = require("socket.io-client");
const socket = io("http://coalition-chess.herokuapp.com")
//const socket = io("localhost:2354")
export default socket
