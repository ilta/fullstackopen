import { useState } from 'react';

const StatisticLine = ({ text, value }) => {
  return (
    <div>
      {text} {value}
    </div>
  );
};

const Statistics = ({ good, neutral, bad }) => {
  const totalClicks = good + neutral + bad;
  const average = (good + -1 * bad) / totalClicks;
  const positiveRatio = (good / totalClicks) * 100;

  return (
    <div>
      <h1>statistics</h1>
      {totalClicks ? (
        <>
          <StatisticLine text="good" value={good} />
          <StatisticLine text="neutral" value={neutral} />
          <StatisticLine text="bad" value={bad} />
          <StatisticLine text="all" value={totalClicks} />
          <StatisticLine text="average" value={average ? average : 0} />
          <StatisticLine
            text="positive"
            value={positiveRatio ? `${positiveRatio} %` : '0 %'}
          />
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
