import { useState, useEffect } from 'react';
import { getAllNotes, createDiary } from './diaryService';
import { DiaryEntry, NewDiaryEntry, Visibility, Weather } from './types';

const App = () => {
  const [diaries, setDiaries] = useState<DiaryEntry[]>([]);
  const [date, setDate] = useState('');
  const [visibility, setVisibility] = useState<Visibility>(Visibility.Ok);
  const [weather, setWeather] = useState<Weather>(Weather.Sunny);
  const [comment, setComment] = useState('');

  // Constructing an array of visibility/weather options from enums for to be
  // used in the form's dropdown menu
  const visibilityOptions: Visibility[] = Object.values(
    Visibility
  ) as Visibility[];
  const weatherOptions: Weather[] = Object.values(Weather) as Weather[];

  useEffect(() => {
    getAllNotes().then((data) => {
      setDiaries(data);
    });
  }, []);

  const diaryCreation = (event: React.SyntheticEvent) => {
    event.preventDefault();

    const newDiary: NewDiaryEntry = {
      date,
      weather,
      visibility,
      comment,
    };

    createDiary(newDiary).then((data) => {
      setDiaries(diaries.concat(data));

      setDate('');
      setVisibility(Visibility.Ok);
      setWeather(Weather.Sunny);
      setComment('');
    });
  };

  return (
    <>
      <h2>Add new entry</h2>
      <form onSubmit={diaryCreation}>
        <div>
          date{' '}
          <input
            value={date}
            onChange={(event) => setDate(event.target.value)}
          />
        </div>
        <div>
          visibility{' '}
          <select
            value={visibility}
            onChange={(event) =>
              setVisibility(event.target.value as Visibility)
            }
          >
            {visibilityOptions.map((visibility) => (
              <option key={visibility} value={visibility}>
                {visibility}
              </option>
            ))}
          </select>
        </div>
        <div>
          weather{' '}
          <select
            value={weather}
            onChange={(event) => setWeather(event.target.value as Weather)}
          >
            {weatherOptions.map((weather) => (
              <option key={weather} value={weather}>
                {weather}
              </option>
            ))}
          </select>
        </div>
        <div>
          comment{' '}
          <input
            value={comment}
            onChange={(event) => setComment(event.target.value)}
          />
        </div>
        <button type="submit">add</button>
      </form>
      <h2>Diary entries</h2>
      <div>
        {diaries.map((d) => (
          <div key={d.date}>
            <h3>{d.date}</h3>
            <div>
              <strong>visibility</strong>: {d.visibility}
            </div>
            <div>
              <strong>weather</strong>: {d.weather}
            </div>
            <div>
              <strong>comment</strong>: {d.comment}
            </div>
          </div>
        ))}
      </div>
    </>
  );
};

export default App;
