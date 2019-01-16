// server.js

const express = require('express');
const SocketServer = require('ws').Server;
const ws = require('ws');
const uuid = require('uuid/v1');

// Set the port to 3001
const PORT = 3001;

// Create a new express server
const server = express()
   // Make the express server serve static assets (html, javascript, css) from the /public folder
  .use(express.static('public'))
  .listen(PORT, '0.0.0.0', 'localhost', () => console.log(`Listening on ${ PORT }`));

// Create the WebSockets server
const wss = new SocketServer({ server });

wss.broadcast = function(data) {
  wss.clients.forEach(sock => {
    if (sock.readyState === ws.OPEN) {
      sock.send(data);
    } else {
      sock.terminate();
    }
  });
}

// Set up a callback that will run when a client connects to the server
// When a client connects they are assigned a socket, represented by
// the ws parameter in the callback.

// wss.on('connection', (socket, req) => {
//   console.log(req.connection.remoteAddress);
//   socket.on('message', wss.broadcast);
// });

wss.on('connection', (ws, req) => {
  console.log('Client connected');

  //receive code
  ws.on('message', (msg) => {
    let newMessage = JSON.parse(msg);
    newMessage.id = uuid();
    console.log(newMessage);


    wss.clients.forEach(sock => {
      if (sock.readyState === ws.OPEN) {
        console.log(newMessage)
        sock.send(JSON.stringify(newMessage));
      } else {
        sock.terminate();
      }
    });


  }); //ws.on message function ends here.


  // Set up a callback for when a client closes the socket. This usually means they closed their browser.
  ws.on('close', () => console.log('Client disconnected'));
});