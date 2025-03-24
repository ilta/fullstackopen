type bmiResult = "Underweight (Severe thinnes)" | "Underweight (Moderate thinness)" | "Underweight (Mild thinness)" | "Normal range" | "Overweight (Pre obese)" | "Obese (Class I)" | "Obese (Class II)" | "Obese (Class III)"

interface bmiInput {
  height: number,
  weight: number
}

const parseArguments = (args: string[]):bmiInput => {
  if (args.length < 4) throw new Error("not enough arguments")
  if (args.length > 4) throw new Error("too many arguments")

  const [,, height, weight] = args
  if (!isNaN(Number(height)) && !isNaN(Number(weight)))
    return {
      height: Number(height),
      weight: Number(weight)
    }
  else throw new Error("Please provide two numbers")
}

const calculateBmi = (height: number, weight: number): bmiResult => {
  const bmi = weight / Math.pow(height / 100, 2)

  switch (true) {
    case bmi < 16:
      return "Underweight (Severe thinnes)"
    case bmi < 17:
      return "Underweight (Moderate thinness)"
    case bmi < 18.5:
      return "Underweight (Mild thinness)"
    case bmi < 25:
      return "Normal range"
    case bmi < 30:
      return "Overweight (Pre obese)"
    case bmi < 35:
      return "Obese (Class I)"
    case bmi < 40:
      return "Obese (Class II)"
    case bmi >= 40:
      return "Obese (Class III)"
    default:
      throw new Error("unknown error")
  }
}

if (require.main === module) {
  try {
    const { height, weight } = parseArguments(process.argv)
    console.log(calculateBmi(height, weight))
  } catch (error) {
    let errorMessage = "Error: "
    if (error instanceof Error)
      errorMessage += error.message
    console.error(errorMessage)
  }
}

export default calculateBmi