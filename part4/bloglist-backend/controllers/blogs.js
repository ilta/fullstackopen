const blogRouter = require('express').Router()
const Blog = require('../models/blog')

blogRouter.get('/', async (_request, response, next) => {
  try {
    const blogs = await Blog.find({})
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

  const blog = new Blog({
    title,
    author,
    url,
    likes: likes || 0,
  })
  try {
    const savedBlog = await blog.save()
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

module.exports = blogRouter
