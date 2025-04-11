import { useState, useEffect } from 'react';
import { getAllNotes } from './diaryService';
import { DiaryEntry } from './types';
import AddDiaryForm from './components/AddDiaryForm';
import Diaries from './components/Diaries';

const App = () => {
  const [diaries, setDiaries] = useState<DiaryEntry[]>([]);

  useEffect(() => {
    getAllNotes().then((data) => {
      setDiaries(data);
    });
  }, []);

  return (
    <>
      <AddDiaryForm diaries={diaries} setDiaries={setDiaries} />
      <h2>Diary entries</h2>
      <Diaries diaries={diaries} />
    </>
  );
};

export default App;
