import { useState } from 'react';

const Statistics = ({ good, neutral, bad }) => {
  const totalClicks = good + neutral + bad;
  const average = (good + -1 * bad) / totalClicks;
  const positiveRatio = (good / totalClicks) * 100;

  return (
    <div>
      <h1>statistics</h1>
      {totalClicks ? (
        <>
          <p>good: {good}</p>
          <p>neutral: {neutral}</p>
          <p>bad: {bad}</p>
          <p>all: {totalClicks}</p>
          <p>average: {average ? average : 0}</p>
          <p>positive: {positiveRatio ? positiveRatio : 0} %</p>
        </>
      ) : (
        'No feedback given'
      )}
    </div>
  );
};

const Button = ({ handleClick, text }) => (
  <button onClick={handleClick}>{text}</button>
);

const App = () => {
  // save clicks of each button to its own state
  const [good, setGood] = useState(0);
  const [neutral, setNeutral] = useState(0);
  const [bad, setBad] = useState(0);

  const handleGoodClick = () => setGood(good + 1);
  const handleBadClick = () => setBad(bad + 1);
  const handleNeutralClick = () => setNeutral(neutral + 1);

  return (
    <div>
      <h1>give feedback</h1>
      <Button handleClick={handleGoodClick} text="good" />
      <Button handleClick={handleNeutralClick} text="neutral" />
      <Button handleClick={handleBadClick} text="bad" />
      <Statistics good={good} neutral={neutral} bad={bad} />
    </div>
  );
};

export default App;
