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

const rateExercises = (average: number, target: number): Rating => {
  if (average === 0)
    throw new Error("average of exercises was zero")

  const ratio = target !== 0 ? target / average : 0
  console.log(ratio)

  switch (true) {
    case ratio === 0:
      return {
        rating: 1,
        ratingDescription: "no goals were set"
      }
    case ratio >= 2:
      return {
        rating: 1,
        ratingDescription: "☹️"
      }
    case ratio < 2 && ratio >= 0.8:
      return {
        rating: 2,
        ratingDescription: "not too bad but could be better"
      }
    case ratio < 0.8:
      return {
        rating: 3,
        ratingDescription: "excellent job, keep pushing 👍"
      }
    default:
      throw new Error("something went wrong")
  }
}

const calculateExercises = (exercises: number[], target: number) => {
  const periodLength = exercises.length
  const trainingDays = exercises.filter((time) => time > 0).length

  const reducer = (accumulator: number, current: number) => accumulator + current
  const totalHours = exercises.reduce(reducer)
  const average = totalHours / exercises.length
  const success = average >= target

  const { rating, ratingDescription} = rateExercises(average, target)

  return {
    periodLength,
    trainingDays,
    success,
    rating,
    ratingDescription,
    target,
    average
  }
}

console.log(calculateExercises([3, 0, 2, 4.5, 0, 3, 1], 2))
console.log(calculateExercises([3, 0, 2, 4.5, 0, 3, 1], 0))
console.log(calculateExercises([3, 4, 2, 4.5, 4, 3, 1], 0x2))
console.log(calculateExercises([0], 2))