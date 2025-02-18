import { useState } from 'react'
import { useDispatch } from 'react-redux'
import { addComment } from '../reducers/blogReducer'
import PropTypes from 'prop-types'

const CommentForm = ({ id }) => {
  CommentForm.propTypes = {
    id: PropTypes.string.isRequired,
  }

  const [comment, setComment] = useState('')
  const dispatch = useDispatch()

  const handleSubmitComment = (event) => {
    event.preventDefault()

    dispatch(addComment({ id, comment }))

    setComment('')
  }

  return (
    <div>
      <form onSubmit={handleSubmitComment}>
        <div>
          <input
            data-testid="comment"
            type="text"
            value={comment}
            name="comment"
            onChange={({ target }) => setComment(target.value)}
            placeholder="new comment"
          />
          <button type="submit">add comment</button>
        </div>
      </form>
    </div>
  )
}

export default CommentForm
