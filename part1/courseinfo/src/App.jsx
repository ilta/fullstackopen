const App = () => {
  const course = 'Half Stack application development';
  const parts = [
    {
      name: 'Fundamentals of React',
      exercises: 10,
    },
    {
      name: 'Using props to pass data',
      exercises: 7,
    },
    {
      name: 'State of a component',
      exercises: 14,
    },
  ];

  const Header = (props) => {
    return (
      <div>
        <h1>{props.course}</h1>
      </div>
    );
  };

  const Content = (props) => {
    const Part = (props) => {
      return (
        <div>
          <p>
            {props.part1} {props.exercises1}
            {props.part2} {props.exercises2}
            {props.part3} {props.exercises3}
          </p>
        </div>
      );
    };

    return (
      <div>
        <Part
          part1={props.parts[0].name}
          exercises1={props.parts[0].exercises}
        />
        <Part
          part1={props.parts[1].name}
          exercises1={props.parts[1].exercises}
        />
        <Part
          part1={props.parts[2].name}
          exercises1={props.parts[2].exercises}
        />
      </div>
    );
  };

  const Total = (props) => {
    return (
      <p>
        Number of exercises{' '}
        {props.parts[0].exercises +
          props.parts[1].exercises +
          props.parts[2].exercises}
      </p>
    );
  };

  return (
    <div>
      <Header course={course} />
      <Content parts={parts} />
      <Total parts={parts} />
    </div>
  );
};

export default App;
