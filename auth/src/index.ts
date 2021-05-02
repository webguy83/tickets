import express from 'express';
import { json } from 'body-parser';

const app = express();
app.use(json());

app.get('/api/users/currentuser', (req, res) => {
  res.send('You got me hahahahah')
})

app.listen(3000, () => {
  console.log('Listening on the port 3000 yayyy~ FUCKERRRRRR');
});
