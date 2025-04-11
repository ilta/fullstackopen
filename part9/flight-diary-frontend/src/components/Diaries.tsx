import { DiaryEntry } from '../types';

interface DiariesProps {
  diaries: DiaryEntry[];
}

const Diaries = ({ diaries }: DiariesProps) => {
  return (
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
  );
};

export default Diaries;
