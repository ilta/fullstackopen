import { useState } from 'react';
import { createDiary } from '../diaryService';
import { DiaryEntry, NewDiaryEntry, Visibility, Weather } from '../types';
import axios from 'axios';

interface AddDiaryFormProps {
  diaries: DiaryEntry[];
  setDiaries: (entries: DiaryEntry[]) => void;
}

const AddDiaryForm = ({ diaries, setDiaries }: AddDiaryFormProps) => {
  const [date, setDate] = useState('');
  const [visibility, setVisibility] = useState<Visibility>(Visibility.Ok);
  const [weather, setWeather] = useState<Weather>(Weather.Sunny);
  const [comment, setComment] = useState('');
  const [errorMessage, setErrorMessage] = useState(null);

  const diaryCreation = (event: React.SyntheticEvent) => {
    event.preventDefault();

    const newDiary: NewDiaryEntry = {
      date,
      weather,
      visibility,
      comment,
    };

    createDiary(newDiary)
      .then((data) => {
        setDiaries(diaries.concat(data));

        setDate('');
        setVisibility(Visibility.Ok);
        setWeather(Weather.Sunny);
        setComment('');
      })
      .catch((error) => {
        if (axios.isAxiosError(error)) {
          setErrorMessage(error?.response?.data);
          console.error(
            `Response: ${error?.status} (${error?.response?.statusText}) – ${error?.response?.data}`
          );
          setTimeout(() => {
            setErrorMessage(null);
          }, 5000);
        } else {
          console.error(error);
        }
      });
  };

  return (
    <>
      <h2>Add new entry</h2>
      <div style={{ color: 'red' }}>{errorMessage}</div>
      <form onSubmit={diaryCreation}>
        <div>
          date{' '}
          <input
            type="date"
            value={date}
            onChange={(event) => setDate(event.target.value)}
          />
        </div>
        <div>
          visibility{' '}
          {/* Iterate through all visibility types ("great", "good", ...) */}
          {Object.values(Visibility).map((v) => (
            <span key={v}>
              <input
                type="radio"
                value={v}
                name="visibility"
                checked={visibility === v}
                onChange={() => setVisibility(v as Visibility)}
              />
              <label htmlFor={v}>{v}</label>
            </span>
          ))}
        </div>
        <div>
          weather{' '}
          {/* Iterate through all weather types ("sunny", "rainy", ...) */}
          {Object.values(Weather).map((w) => (
            <span key={w}>
              <input
                type="radio"
                value={w}
                name="weather"
                checked={weather === w}
                onChange={() => setWeather(w as Weather)}
              />
              <label htmlFor={w}>{w}</label>
            </span>
          ))}
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
    </>
  );
};

export default AddDiaryForm;
