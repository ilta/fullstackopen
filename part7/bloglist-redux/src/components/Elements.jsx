import PropTypes from 'prop-types'

/* Custom styled elements

   The elements used here apply the attribute className from props if such if
   such is provided. If there are two conflicting values, the priority is given
   to the calling element, e.g. CommentForm overrides the default text input width.
*/

export const Button = ({ children, className, ...rest }) => {
  Button.propTypes = {
    children: PropTypes.string.isRequired,
    className: PropTypes.string,
  }

  const customStyle =
    'bg-blue-500 font-bold text-gray-100 rounded-4xl hover:bg-amber-700 px-2'
  const style = className ? `${className} ${customStyle}` : customStyle

  return (
    <button className={style} {...rest}>
      {children}
    </button>
  )
}

export const Input = ({ className, ...rest }) => {
  Input.propTypes = {
    className: PropTypes.string,
  }

  const customStyle = 'bg-blue-200 w-48 rounded-md'
  const style = className ? `${className} ${customStyle}` : customStyle

  return <input className={style} {...rest} />
}

export const H2 = ({ className, children, ...rest }) => {
  H2.propTypes = {
    className: PropTypes.string,
    children: PropTypes.any,
  }

  const customStyle = 'text-2xl p-2'
  const style = className ? `${className} ${customStyle}` : customStyle

  return (
    <h1 className={style} {...rest}>
      {children}
    </h1>
  )
}

export const H3 = ({ className, children, ...rest }) => {
  H3.propTypes = {
    className: PropTypes.string,
    children: PropTypes.any,
  }

  const customStyle = 'text-xl'
  const style = className ? `${className} ${customStyle}` : customStyle

  return (
    <h1 className={style} {...rest}>
      {children}
    </h1>
  )
}
