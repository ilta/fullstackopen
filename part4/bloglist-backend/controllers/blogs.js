const blogRouter = require('express').Router()
const Blog = require('../models/blog')

blogRouter.get('/', (_request, response) => {
  Blog.find({}).then((blogs) => {
    response.json(blogs)
  })
})

blogRouter.post('/', (request, response) => {
  const { title, author, url, likes } = request.body
  const blog = new Blog({ title, author, url, likes })

  blog.save().then((result) => {
    response.status(201).json(result)
  })
})

module.exports = blogRouter
