"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
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
const fs_1 = __importDefault(require("fs"));
const chokidar_1 = __importDefault(require("chokidar"));
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
chokidar_1.default.watch('./user').on('all', (event, path) => {
    io.emit('file:refresh', path);
});
const cwdPath = path_1.default.join(process.cwd(), 'user');
const childProcess = (0, child_process_1.spawn)('bash', {
    cwd: cwdPath
});
childProcess.stdout.on('data', (data) => {
    io.emit('terminal:data', data.toString());
});
// childProcess.stderr.on('data', (data) => {
//   io.emit('terminal:data', data.toString());
// });
childProcess.on('error', (error) => {
    console.error('Failed to start subprocess:', error);
});
io.on("connection", (socket) => {
    console.log("a user connected", socket.id);
    socket.emit('file:refresh');
    socket.on("file:change", (_a) => __awaiter(void 0, [_a], void 0, function* ({ path, content }) {
        console.log("file:change", path, content);
        yield fs_1.default.promises.writeFile(`./user${path}`, content);
    }));
    socket.on('terminal:write', (data) => {
        console.log('Terminal input:', data);
        childProcess.stdin.write(data + '\n');
    });
});
app.get("/", (req, res) => {
    res.send("Hello World!");
});
app.get('/files', (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const fileTree = yield generateFileTree('./user');
    console.log(JSON.stringify(fileTree, null, 2));
    return res.json({ fileTree });
}));
app.get('/files/content', (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const path = req.query.path;
    console.log(`Path: ${path}`);
    if (!path) {
        return res.status(400).json({ error: 'Path is required' });
    }
    try {
        const fileContent = yield fs_1.default.promises.readFile(`./user/${path}`, 'utf-8');
        return res.json({ content: fileContent });
    }
    catch (error) {
        console.error("Failed to fetch file content:", error);
    }
}));
server.listen(9000, () => console.log(`🐳 Docker server running on port http://localhost:9000`));
function generateFileTree(directory) {
    return __awaiter(this, void 0, void 0, function* () {
        const tree = {};
        function buildTree(currentDir, currentTree) {
            return __awaiter(this, void 0, void 0, function* () {
                const files = yield fs_1.default.readdirSync(currentDir);
                console.log(`currentDir: ${currentDir}`);
                console.log(`currentTree: ${JSON.stringify(currentTree)}`);
                console.log(`files: ${JSON.stringify(files)}`);
                for (const file of files) {
                    const filePath = path_1.default.join(currentDir, file);
                    console.log(`filePath: ${filePath}`);
                    if (fs_1.default.statSync(filePath).isDirectory()) {
                        currentTree[file] = {};
                        console.log(`currentTree: ${JSON.stringify(currentTree)}`);
                        console.log(`current[file]: ${JSON.stringify(currentTree[file])}`);
                        yield buildTree(filePath, currentTree[file]);
                    }
                    else {
                        currentTree[file] = null;
                    }
                }
            });
        }
        yield buildTree(directory, tree);
        console.log(JSON.stringify(tree, null, 2));
        return tree;
    });
}
generateFileTree('./user');
