import { CoursePart } from "../types"

interface ContentProps {
  courses: CoursePart[]
}

const Content = (props: ContentProps) => {
  return (
    <>
      {props.courses.map(({name, exerciseCount}) => <p key={name}>{name} {exerciseCount}</p>)}
    </>
  )
}

export default Content;