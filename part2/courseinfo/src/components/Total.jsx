const Total = ({ parts }) => {
  const totals = parts.map((num) => num.exercises); // array of num of exercises
  const sumExercises = totals.reduce(
    (accumulator, currentValue) => accumulator + currentValue
  );

  return (
    <p>
      <b>total of {sumExercises} exercises</b>
    </p>
  );
};

export default Total;
