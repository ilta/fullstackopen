import express from 'express';
const app = express();
import calculateBmi from './bmiCalculator';

app.get('/hello', (_req, res) => {
  res.send('Hello Full Stack!');
});

app.get('/bmi', (req, res) => {
  const height = parseInt(req.query.height as string, 10);
  const weight = parseInt(req.query.weight as string, 10);

  if (!weight || !height)
    res.status(400).json({error: "malformatted parameters"});
  else {
    res.send({ weight, height, bmi: calculateBmi(height, weight) });
  }
});

const PORT = 3001;

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});