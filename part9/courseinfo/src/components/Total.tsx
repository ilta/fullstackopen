interface TotalProps {
  sum: number;  
};

const Total = (props: TotalProps) => {

  return (
    <p>
      Number of exercices {props.sum}
    </p>
  )
};

export default Total;