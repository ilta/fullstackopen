const dummy = (blogs) => {
  return 1
}

const totalLikes = (blogs) => {
  const reducer = (sum, item) => {
    return sum + item.likes
  }

  return blogs.reduce(reducer, 0)
}

const favoriteBlog = (blogs) => {
  // See e.g. https://seanconnolly.dev/javascript-find-element-with-max-value
  const favorite = blogs.reduce((prev, current) => {
    return prev.likes > current.likes ? prev : current
  }, {})

  return {
    title: favorite.title,
    author: favorite.author,
    likes: favorite.likes,
  }
}

module.exports = {
  dummy,
  totalLikes,
  favoriteBlog,
}
