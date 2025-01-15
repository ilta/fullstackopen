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

// Find the maximum item from the array using the selected key
const findMaxByKey = (array, key) => {
  return array.reduce((prev, current) => {
    return prev[key] > current[key] ? prev : current
  }, {})
}

const favoriteBlog = (blogs) => {
  const favorite = findMaxByKey(blogs, 'likes')

  return {
    title: favorite.title,
    author: favorite.author,
    likes: favorite.likes,
  }
}

const mostBlogs = (blogs) => {
  // Count blogs by authors
  const countedAuthors = lodash
    .chain(blogs)
    .countBy('author')
    .map((numPosts, author) => {
      return {
        author,
        blogs: numPosts,
      }
    })
    .value()

  // Find the author with most blog posts
  return findMaxByKey(countedAuthors, 'blogs')
}

const mostLikes = (blogs) => {
  const reducer = (sum, item) => {
    return sum + item.likes
  }

  // Group by blogs by authors
  const groupedAuthors = lodash
    .chain(blogs)
    .groupBy('author')
    .map((likes, author) => {
      return {
        author,
        likes: likes.reduce(reducer, 0),
      }
    })
    .value()

  return findMaxByKey(groupedAuthors, 'likes')
}

module.exports = {
  dummy,
  totalLikes,
  findMaxByKey,
  favoriteBlog,
  mostBlogs,
  mostLikes,
}
