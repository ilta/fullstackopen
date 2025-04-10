import { useState, useEffect } from 'react';
import { getAllNotes } from './diaryService';
import { DiaryEntry } from './types';

const App = () => {
  const [diaries, setDiaries] = useState<DiaryEntry[]>([]);

  useEffect(() => {
    getAllNotes().then((data) => {
      setDiaries(data);
    });
  }, []);

  return (
    <>
      <h1>Diary entries</h1>
      <div>
        {diaries.map((d) => (
          <>
            <h2 key={d.date}>{d.date}</h2>
            <div>
              <strong>visibility</strong>: {d.visibility}
            </div>
            <div>
              <strong>weather</strong>: {d.weather}
            </div>
            <div>
              <strong>comment</strong>: {d.comment}
            </div>
          </>
        ))}
      </div>
    </>
  );
};

export default App;
