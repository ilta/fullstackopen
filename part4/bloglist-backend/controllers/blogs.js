const blogRouter = require('express').Router()
const Blog = require('../models/blog')
const User = require('../models/user')

blogRouter.get('/', async (_request, response, next) => {
  try {
    const blogs = await Blog.find({}).populate('user', { name: 1, username: 1 })
    return response.json(blogs)
  } catch (error) {
    next(error)
  }
})

blogRouter.post('/', async (request, response, next) => {
  const { title, author, url, likes } = request.body

  if (!title) {
    return response.status(400).json({ error: 'title is missing' })
  }

  if (!url) {
    return response.status(400).json({ error: 'url is missing' })
  }

  // Use the first user as the author of all for now
  const users = await User.find({})
  const user = users[0]
  console.log(user)

  const blog = new Blog({
    title,
    author,
    url,
    likes: likes || 0,
    user: user._id,
  })
  try {
    const savedBlog = await blog.save()
    console.log(savedBlog)
    user.blogs = user.blogs.concat(savedBlog._id)
    await user.save()

    response.status(201).json(savedBlog)
  } catch (error) {
    next(error)
  }
})

blogRouter.delete('/:id', async (request, response, next) => {
  try {
    await Blog.findByIdAndDelete(request.params.id)
    return response.status(204).end()
  } catch (error) {
    next(error)
  }
})

blogRouter.put('/:id', async (request, response, next) => {
  try {
    const { title, author, url, likes } = request.body
    const blog = {
      title,
      author,
      url,
      likes: likes || 0,
    }
    const opts = { new: true, runValidators: true }

    const updatedBlog = await Blog.findByIdAndUpdate(
      request.params.id,
      blog,
      opts
    )
    return response.json(updatedBlog)
  } catch (error) {
    next(error)
  }
})

module.exports = blogRouter
