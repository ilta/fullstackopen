const reducer = (state = '', action) => {
  switch (action.type) {
    case 'FILTER':
      return action.payload
    default:
      return state
  }
}

export const changeFilter = (payload) => {
  return {
    type: 'FILTER',
    payload,
  }
}

export default reducer
