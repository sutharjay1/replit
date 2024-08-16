import express from "express";
import { Server as SocketServer } from "socket.io";
import http from "http";
import cors from "cors";
import os from "os";
import { spawn } from 'child_process';
import path from 'path';
import fs from 'fs';
import chokidar from 'chokidar';

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


chokidar.watch('./user').on('all', (event: string, path: string) => {
  io.emit('file:refresh', path)
});

const cwdPath = path.join(process.cwd(), 'user');

const childProcess = spawn('bash', {
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

  socket.emit('file:refresh')

  socket.on("file:change", async ({ path, content }) => {
    console.log("file:change", path, content);



    await fs.promises.writeFile(`./user${path}`, content)

  })

  socket.on('terminal:write', (data) => {
    console.log('Terminal input:', data);
    childProcess.stdin.write(data + '\n');
  });
});

app.get("/", (req, res) => {
  res.send("Hello World!");
});

app.get('/files', async (req, res) => {
  const fileTree = await generateFileTree('./user')

  console.log(JSON.stringify(fileTree, null, 2))
  return res.json({ fileTree })
})

app.get('/files/content', async (req, res) => {
  const path = req.query.path;

  console.log(`Path: ${path}`)

  if (!path) {
    return res.status(400).json({ error: 'Path is required' });
  }



  try {
    const fileContent = await fs.promises.readFile(`./user/${path}`, 'utf-8');
    return res.json({ content: fileContent })
  } catch (error) {
    console.error("Failed to fetch file content:", error);
  }

})

server.listen(9000, () =>
  console.log(`🐳 Docker server running on port http://localhost:9000`)
);



async function generateFileTree(directory: string) {
  const tree = {}

  async function buildTree(currentDir: string, currentTree: any) {
    const files = await fs.readdirSync(currentDir)
    console.log(`currentDir: ${currentDir}`)
    console.log(`currentTree: ${JSON.stringify(currentTree)}`)
    console.log(`files: ${JSON.stringify(files)}`)

    for (const file of files) {
      const filePath = path.join(currentDir, file)

      console.log(`filePath: ${filePath}`)

      if (fs.statSync(filePath).isDirectory()) {
        currentTree[file] = {}
        console.log(`currentTree: ${JSON.stringify(currentTree)}`)
        console.log(`current[file]: ${JSON.stringify(currentTree[file])}`)
        await buildTree(filePath, currentTree[file])
      } else {
        currentTree[file] = null
      }
    }

  }
  await buildTree(directory, tree)
  console.log(JSON.stringify(tree, null, 2))
  return tree
}

generateFileTree('./user')