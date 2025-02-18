const blogRouter = require('express').Router()
const Blog = require('../models/blog')
const Comment = require('../models/comment')
const middleware = require('../utils/middleware')

blogRouter.get('/', async (_request, response, next) => {
  const blogs = await Blog.find({})
    .populate('user', { name: 1, username: 1 })
    .populate('comments', { content: 1 })
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
      comments: [],
    })

    await newBlog.save()
    // Populate with 'user' so that the frontend doesn't have to manipulate the
    // field, e.g. to allow immediate blog deletion without reloading the app.
    const savedBlog = await Blog.findById(newBlog._id).populate('user', {
      name: 1,
      username: 1,
    })

    user.blogs = user.blogs.concat(savedBlog._id)
    await user.save()

    response.status(201).json(savedBlog)
  }
)

blogRouter.post(
  '/:id/comments',
  middleware.userExtractor,
  async (request, response, next) => {
    const blog = await Blog.findById(request.params.id)

    if (!blog) {
      return response.status(404).json({ error: 'blog not found' })
    }

    const { content } = request.body

    if (!content) {
      return response.status(400).json({ error: 'comment is missing' })
    }

    // Save the comment
    const newComment = new Comment({ content })
    const savedComment = await newComment.save()

    // Save the comment id in the blog comment array
    blog.comments = blog.comments.concat(savedComment._id)
    const savedBlog = await blog.save()

    // Customized simplified comment response that enables modifying the list
    // of comments in the frontend without reloading a bunch of data from the
    // server.
    const commentResponse = {
      blogId: savedBlog._id,
      commentId: savedComment._id,
      content,
    }

    response.status(201).json(commentResponse)
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

    // Delete blog comments
    const idsToDelete = blog.comments
    await Comment.deleteMany({ _id: { $in: idsToDelete } })

    // Delete blog
    await Blog.findByIdAndDelete(request.params.id)

    // Remove blog ids from user
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
      .populate('user', { name: 1, username: 1 })
      .populate('comments', { content: 1 })

    if (!updatedBlog) {
      return response.status(404).json({ error: 'blog not found' })
    }

    return response.json(updatedBlog)
  }
)

module.exports = blogRouter
