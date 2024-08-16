import express from "express";
import { Server as SocketServer } from "socket.io";
import http from "http";
import cors from "cors";
import os from "os";
import { spawn } from 'child_process';
import path from 'path';

const shell = os.platform() === 'win32' ? 'powershell.exe' : 'bash';

const app = express()
app.use(cors())


const server = http.createServer(app);


const io = new SocketServer({
  cors: {
    origin: "*",
  }
})

io.attach(server);


const cwdPath = path.join(process.cwd(), 'user');

const childProcess = spawn('bash', {
  cwd: cwdPath
});

childProcess.stdout.on('data', (data) => {
  console.log(data.toString());
  io.emit('terminal:data', data.toString());
});

childProcess.stderr.on('data', (data) => {
  console.log(data.toString());
  io.emit('terminal:data', data.toString());
});

childProcess.on('error', (error) => {
  console.error('Failed to start subprocess:', error);
});








io.on("connection", (socket) => {
  console.log("a user connected", socket.id);

  socket.on('terminal:write', (data) => {
    console.log('Terminal input:', data);
    childProcess.stdin.write(data + '\n');
  });
});

app.get("/", (req, res) => {
  res.send("Hello World!");
});

server.listen(9000, () =>
  console.log(`🐳 Docker server running on port http://localhost:9000`)
);