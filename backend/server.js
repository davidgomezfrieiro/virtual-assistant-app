const express = require('express');
const { Blob } = require('buffer');
const { spawn } = require('child_process');
const app = express();
const port = 3000;

app.use(express.json());

app.get('/', (req, res) => {
  let data = '';
  let dataToSend;
  const buff = Buffer.from(['myString']); // Node.js Buffer
  const blob = new Blob([buff]); // JavaScript Blob

  req.on('data', (chunk) => {
    data += chunk;
  });
  // spawn new child process to call the python script
  const python = spawn('python3', [__dirname + '/HelloWorld.py', blob]);
  // collect data from script
  python.stdout.on('data', (data) => {
    console.log('Pipe data from python script ...');
    dataToSend = data.toString();
  });
  // in close event we are sure that stream from child process is closed
  python.on('close', (code) => {
    console.log(`child process close all stdio with code ${code}`);
    // send data to browser
    res.status(200).send(dataToSend);
  });
});

app.listen(port, () => {
  console.log(`Server listening at http://localhost:${port}`);
});
