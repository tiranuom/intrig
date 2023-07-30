import express from 'express';
import {json} from 'body-parser'
import {CodeModificationRequest, modifyIndexContent} from "./chatGptIntegration";

const host = process.env.HOST ?? 'localhost';
const port = process.env.PORT ? Number(process.env.PORT) : 3000;

const app = express();
app.use(json());

app.get('/', async (req, res) => {
  res.send('Hello World!');
});

app.post('/modifyCode', async (req, res) => {
  try {
    const request: CodeModificationRequest = req.body;
    console.log("Request to modify code: ", request)
    // Validation of request can be added here

    const response = await modifyIndexContent(request);
    res.status(200).send(response);
  } catch (err) {
    console.error(err);
    res.status(500).send({ error: err.toString() });
  }
})

app.listen(port, host, () => {
    console.log(`[ ready ] http://${host}:${port}`);
});
