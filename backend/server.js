const express = require('express');
const { spawn } = require('child_process');
const app = express();
const port = 3000;

app.use(express.json());

app.get('/', (req, res) => {
  var dataToSend;
  // spawn new child process to call the python script
  const python = spawn('python3', [__dirname + '/HelloWorld.py']);
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
  //res.status(200).send('Hello World');
});

app.listen(port, () => {
  console.log('Server listening at http://localhost:3000');
});
