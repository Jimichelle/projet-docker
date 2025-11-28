import express from 'express';
import dotenv from 'dotenv';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 3008;

app.get('/', (req, res) => {
  res.status(200).send('hello');
});


app.get('/task', (req, res) => {
  console.log(req.query);
})

app.post('/task', (req, res) => {
  console.log(req.body);
})

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
