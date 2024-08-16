"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const socket_io_1 = require("socket.io");
const http_1 = __importDefault(require("http"));
const cors_1 = __importDefault(require("cors"));
const os_1 = __importDefault(require("os"));
const child_process_1 = require("child_process");
const path_1 = __importDefault(require("path"));
const shell = os_1.default.platform() === 'win32' ? 'powershell.exe' : 'bash';
const app = (0, express_1.default)();
app.use((0, cors_1.default)());
const server = http_1.default.createServer(app);
const io = new socket_io_1.Server({
    cors: {
        origin: "*",
    }
});
io.attach(server);
const cwdPath = path_1.default.join(process.cwd(), 'user');
const childProcess = (0, child_process_1.spawn)('bash', {
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
server.listen(9000, () => console.log(`🐳 Docker server running on port http://localhost:9000`));
