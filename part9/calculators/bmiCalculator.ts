const calculateBmi = (height: number, weight: number) => {
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

console.log(calculateBmi(180, 40))
console.log(calculateBmi(180, 55))
console.log(calculateBmi(180, 58))
console.log(calculateBmi(180, 74))
console.log(calculateBmi(180, 85))
console.log(calculateBmi(180, 100))
console.log(calculateBmi(180, 120))
console.log(calculateBmi(180, 200))