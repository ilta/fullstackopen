const blogRouter = require('express').Router()
const Blog = require('../models/blog')
const middleware = require('../utils/middleware')

blogRouter.get('/', async (_request, response, next) => {
  const blogs = await Blog.find({}).populate('user', { name: 1, username: 1 })
  return response.json(blogs)
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

    const newBlog = new Blog({
      title,
      author,
      url,
      likes: likes || 0,
      user: user._id,
    })

    const savedBlog = await newBlog.save()
    user.blogs = user.blogs.concat(savedBlog._id)
    await user.save()

    response.status(201).json(savedBlog)
  }
)

blogRouter.delete(
  '/:id',
  middleware.userExtractor,
  async (request, response, next) => {
    const user = request.user

    const blog = await Blog.findById(request.params.id)
    if (!blog) {
      return response.status(404).json({ error: 'blog not found' })
    }

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
  }
)

blogRouter.put(
  '/:id',
  middleware.userExtractor,
  async (request, response, next) => {
    const { title, author, url, likes } = request.body

    const newBlog = {
      title,
      author,
      url,
      likes: likes || 0,
    }
    const opts = { new: true, runValidators: true }

    const updatedBlog = await Blog.findByIdAndUpdate(
      request.params.id,
      newBlog,
      opts
    )

    if (!updatedBlog) {
      return response.status(404).json({ error: 'blog not found' })
    }

    return response.json(updatedBlog)
  }
)

module.exports = blogRouter
