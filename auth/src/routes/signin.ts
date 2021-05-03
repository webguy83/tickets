import express from 'express';

const router = express.Router();

router.post('/api/users/signin', (req, res) => {
  res.send('Noob signup dd');
});

export { router as signInRouter };
