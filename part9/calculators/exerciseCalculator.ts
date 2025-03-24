interface Result {
  periodLength: number,
  trainingDays: number,
  success: true | false,
  rating: number,
  ratingDescription: string,
  target: number,
  average: number
}

interface Rating {
  rating: number,
  ratingDescription: string
}

export interface exerciseInput {
  daily_exercises: number[]
  target: number
}

const rateExercises = (average: number, target: number): Rating => {
  if (average <= 0)
    throw new Error("average of exercises must be greater than zero");

  const ratio = target > 0 ? target / average : 0;

  switch (true) {
    case ratio === 0:
      return {
        rating: 1,
        ratingDescription: "no goals were set"
      };
    case ratio >= 2:
      return {
        rating: 1,
        ratingDescription: "☹️"
      };
    case ratio < 2 && ratio >= 0.8:
      return {
        rating: 2,
        ratingDescription: "not too bad but could be better"
      };
    case ratio < 0.8:
      return {
        rating: 3,
        ratingDescription: "excellent job, keep pushing 👍"
      };
    default:
      throw new Error("something went wrong");
  }
};

const parseExerciseArguments =(args: string[]): exerciseInput => {
  if (args.length < 4) 
    throw new Error("not enough arguments");
  
  const [,, target, ...rest] = args;
  const daily_exercises = rest.map((hours) => {
    if (!isNaN(Number(hours))) return Number(hours);
    else throw new Error("all provided values are not numbers");
    });
  
  if (!isNaN(Number(target))) return {
    daily_exercises,
    target: Number(target)
  };
  else throw new Error("target is not a number");
};

const calculateExercises = (exercises: number[], target: number): Result => {
  const periodLength = exercises.length;
  const trainingDays = exercises.filter((time) => time > 0).length;

  const reducer = (accumulator: number, current: number) => accumulator + current;
  const totalHours = exercises.reduce(reducer);
  const average = totalHours / exercises.length;
  const success = average >= target;

  const { rating, ratingDescription} = rateExercises(average, target);

  return {
    periodLength,
    trainingDays,
    success,
    rating,
    ratingDescription,
    target,
    average
  };
};

if (require.main === module) {  
  try {
    const {target, daily_exercises} = parseExerciseArguments(process.argv);
    console.log(calculateExercises(daily_exercises, target));
  } catch (error) {
    let errorMessage = "Error: ";
    if (error instanceof Error)
      errorMessage += error.message;
    console.error(errorMessage);
    console.log("Usage: calculateExercises <target> <day #1 hours>...[day #n hours]");
    console.log("Example: calculateExercises 2 1 0 2 4.5 0 3 1 0 4");
  }
}

export default calculateExercises;