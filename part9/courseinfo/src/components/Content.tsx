import { CoursePart } from "../types"

interface PartProps {
  part: CoursePart
};

interface ContentProps {
  courses: CoursePart[]
};

const Part = ({ part }: PartProps) => {
  switch (part.kind) {
    case "basic":
      return (
        <p>
          <strong>{part.name} {part.exerciseCount}</strong>
          <div><em>{part.description}</em></div>
        </p>
      );
    case "group":
      return (
        <p>
          <strong>{part.name} {part.exerciseCount}</strong>
          <div>project exercises {part.groupProjectCount}</div>
        </p>
      );
    case "background":
      return (
        <p>
          <strong>{part.name} {part.exerciseCount}</strong>
          <div><em>{part.description}</em></div>
          <div>submit to {part.backgroundMaterial}</div>
        </p>
      );
    case "special":
      return (
        <p>
          <strong>{part.name} {part.exerciseCount}</strong>
          <div><em>{part.description}</em></div>
          <div>required skills: {part.requirements.join(", ")}</div>
        </p>
      );
    default:
      break;
  }
}

const Content = ({ courses }: ContentProps) => {
  return (
    <>
      {courses.map((course) => <Part key={course.name} part={course} />)}
    </>
  );
}

export default Content;