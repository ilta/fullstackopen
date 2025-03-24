import express from 'express';
const app = express();
app.use(express.json());
import calculateBmi from './bmiCalculator';
import calculateExercises, { exerciseInput } from './exerciseCalculator';

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

app.post('/exercises', (req, res) => {
  try {
    const body: exerciseInput = req.body as exerciseInput;
    const { daily_exercises, target } = body;
  
    if (!daily_exercises || !target)
      res.status(400).json({ error: "parameter missing"});
    else if (isNaN(target) || !Array.isArray(daily_exercises))
      res.status(400).json({ error: "malformatted parameters"});
    else
      daily_exercises.map((ex) => {
        if (typeof ex !== 'number')
          res.status(400).json({ error: "malformatted parameters"});
      });

    // Success
    res.json(calculateExercises(daily_exercises, target));
  } catch (error) {
    res.status(400).json({error: (error as Error).message});
  }
});

const PORT = 3001;

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});