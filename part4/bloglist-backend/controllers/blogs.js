const blogRouter = require('express').Router()
const Blog = require('../models/blog')

blogRouter.get('/', async (_request, response) => {
  const blogs = await Blog.find({})
  response.json(blogs)
})

blogRouter.post('/', async (request, response) => {
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

  const savedBlog = await blog.save()
  response.status(201).json(savedBlog)
})

module.exports = blogRouter
