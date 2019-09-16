import http from 'http';
import express from 'express';
import * as dbContext from './dbContext';
import { processBillContent, processImage } from './processBill';

const EXPRESS_PORT='8080';
const app = express();
app.server = http.createServer(app);

Promise.all([
    dbContext.initCache(),
  ]).then(() => {
    const listener = app.listen(EXPRESS_PORT);
    console.log(`Started on port ${listener.address().port}`);
  }).catch((err) => {
    console.log('App Initialization failed. Can\'t connect to database', err);
    process.exit(1);
  });

app.get('/health', (req, res) => res.send('OK!! Ajith'));

app.get('/compute', async (req, res)=>{
    const { filename } = req.query;
    const imageText = await processImage(filename);
    const response = await processBillContent(imageText);
    res.send({
      ...response,
      imageText: imageText.toString()
    });
})
