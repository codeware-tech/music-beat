#!/usr/bin/env node

require('./config');
const Hapi = require('@hapi/hapi');
const SocketIO = require('socket.io');
const StaticFilePlugin = require('@hapi/inert');
const Path = require('path');
const Routes = require('./routes');
const Engine = require('./engine');
const fs = require('fs');
const os = require('os');

function getIpAddress() {
  const networkInterfaces = os.networkInterfaces();
  let ipAddress = '';

  // Iterate over each network interface
  Object.keys(networkInterfaces).forEach((interfaceName) => {
    const interfaces = networkInterfaces[interfaceName];

    // Iterate over each interface
    interfaces.forEach((interfaceInfo) => {
      // Check for IPv4 address and ignore loopback and internal addresses
      if (interfaceInfo.family === 'IPv4' && !interfaceInfo.internal) {
        ipAddress = interfaceInfo.address;
      }
    });
  });

  return ipAddress;
}

void async function startApp() {
  const myIpAddress = getIpAddress();

  try {
    const server = Hapi.server({
      port: process.env.PORT || 8888,
      host: process.env.HOST || '10.9.56.254',
      compression: false,
      routes: { files: { relativeTo: Path.join(__dirname, 'public') } },
    });

    await server.register(StaticFilePlugin);
    await server.register(Routes);

    // Start the Engine
    Engine.start();

    // Serve static files from the 'public' directory
    server.route({
      method: 'GET',
      path: '/public/{param*}',
      handler: {
        directory: {
          path: 'public',
        },
      },
    });

    // Set up Socket.IO
    const io = SocketIO(server.listener);

    io.on('connection', (socket) => {
      socket.on('disconnect', () => {
      });

      socket.on('chat message', (msg) => {
        io.emit('chat message', msg);
      });

      // Listen for username registration
      socket.on('register username', (username) => {
        // Store the username in the socket's data
        socket.username = username;

        // Emit an event to inform everyone about the new user
        io.emit('user joined', `${username} joined the chat`);
      });

      socket.on('disconnect', () => {
        // If the user has a username, emit an event about the user who left
        if (socket.username) {
          io.emit('user left', `${socket.username} left the chat`);
        }
      });

      socket.on('chat message', (msg) => {
        // If the user has a username, emit an event with the username and message
        if (socket.username) {
          io.emit('chat message', {
            username: socket.username,
            message: msg,
          });
        } else {
          // If the user doesn't have a username, emit a "hi" message
          socket.emit('chat message', {
            username: 'Server',
            message: 'Hi! Please register a username to start chatting.',
          });
        }
      });
    });

    // Set up a route to handle the HTTP POST request
    server.route({
      method: 'POST',
      path: '/submit',
      handler: async (request, h) => {
        try {
          const { greetingText } = request.payload;

          // Perform server-side validation if needed

          // Strip off non-alphanumeric characters
          const sanitizedText = greetingText.replace(/[^a-zA-Z0-9 .?!]/g, '').replace(/[,;]/g, '...');

          // Save data to greetings.csv
          const csvData = `${sanitizedText}\n`;

          await fs.appendFile('public/greetings.csv', csvData);

          return h.response({ success: true, message: 'Greeting saved successfully.' });
        } catch (err) {
          console.error(err);
          return h.response({ success: false, message: 'Failed to save greeting.' }).code(500);
        }
      },
    });

    await server.start();
  } catch (err) {
    console.error(err);
    process.exit(1);
  }
}();
