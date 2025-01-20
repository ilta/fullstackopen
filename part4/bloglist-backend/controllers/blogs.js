const jwt = require('jsonwebtoken')
const blogRouter = require('express').Router()
const Blog = require('../models/blog')
const User = require('../models/user')
const middleware = require('../utils/middleware')

blogRouter.get('/', async (_request, response, next) => {
  try {
    const blogs = await Blog.find({}).populate('user', { name: 1, username: 1 })
    return response.json(blogs)
  } catch (error) {
    next(error)
  }
})

blogRouter.post(
  '/',
  middleware.userExtractor,
  async (request, response, next) => {
    const { title, author, url, likes } = request.body
    const user = request.user

    if (!title) {
      return response.status(400).json({ error: 'title is missing' })
    }

    if (!url) {
      return response.status(400).json({ error: 'url is missing' })
    }

    try {
      const blog = new Blog({
        title,
        author,
        url,
        likes: likes || 0,
        user: user._id,
      })

      const savedBlog = await blog.save()
      user.blogs = user.blogs.concat(savedBlog._id)
      await user.save()

      response.status(201).json(savedBlog)
    } catch (error) {
      next(error)
    }
  }
)

blogRouter.delete(
  '/:id',
  middleware.userExtractor,
  async (request, response, next) => {
    try {
      const user = request.user

      const blog = await Blog.findById(request.params.id)

      if (blog.user.toString() !== user._id.toString()) {
        return response
          .status(403)
          .json({ error: 'no permission to delete this post' })
          .end()
      }

      await Blog.findByIdAndDelete(request.params.id)
      user.blogs = user.blogs.filter((b) => b.toString() !== request.params.id)
      await user.save()
      return response.status(204).end()
    } catch (error) {
      next(error)
    }
  }
)

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
