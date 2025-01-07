import { useState } from 'react';

const Button = ({ handleClick, text }) => (
  <button onClick={handleClick}>{text}</button>
);

const TopAnecdote = ({ points, anecdotes }) => {
  /*
  See: https://stackoverflow.com/questions/11301438/return-index-of-greatest-value-in-an-array
  Simple solution, but may not scale well (or work) with really large arrays.
  */
  const max = points.indexOf(Math.max(...points));

  return (
    <div>
      <h2>Anecdote with most votes</h2>
      <div>{anecdotes[max]}</div>
      <div>has {points[max]} votes</div>
    </div>
  );
};

const App = () => {
  const anecdotes = [
    'If it hurts, do it more often.',
    'Adding manpower to a late software project makes it later!',
    'The first 90 percent of the code accounts for the first 90 percent of the development time...The remaining 10 percent of the code accounts for the other 90 percent of the development time.',
    'Any fool can write code that a computer can understand. Good programmers write code that humans can understand.',
    'Premature optimization is the root of all evil.',
    'Debugging is twice as hard as writing the code in the first place. Therefore, if you write the code as cleverly as possible, you are, by definition, not smart enough to debug it.',
    'Programming without an extremely heavy use of console.log is same as if a doctor would refuse to use x-rays or blood tests when diagnosing patients.',
    'The only way to go fast, is to go well.',
  ];

  const [selected, setSelected] = useState(0);
  const [points, setPoints] = useState(Array(anecdotes.length).fill(0));

  const onNextClick = () => {
    setSelected(Math.floor(Math.random() * anecdotes.length));
  };

  const onVoteClick = () => {
    const newPoints = [...points];
    newPoints[selected] += 1;
    setPoints(newPoints);
  };

  return (
    <>
      <h2>Anecdote of the day</h2>
      <div>{anecdotes[selected]}</div>
      <div>
        <Button text="vote" handleClick={onVoteClick} />
        <Button text="next anecdote" handleClick={onNextClick} />
      </div>
      <TopAnecdote points={points} anecdotes={anecdotes} />
    </>
  );
};

export default App;
