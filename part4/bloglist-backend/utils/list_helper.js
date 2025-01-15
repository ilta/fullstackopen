const lodash = require('lodash')

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

const mostBlogs = (blogs) => {
  // Count blogs by authors
  const groupedAuthors = lodash
    .chain(blogs)
    .countBy('author')
    .map((numPosts, name) => {
      return {
        author: name,
        blogs: numPosts,
      }
    })
    .value()

  // Find the author with most blog posts
  return groupedAuthors.reduce((prev, current) => {
    return prev.blogs > current.blogs ? prev : current
  })
}

module.exports = {
  dummy,
  totalLikes,
  favoriteBlog,
  mostBlogs,
}
