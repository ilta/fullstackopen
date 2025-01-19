const bcrypt = require('bcrypt')
const usersRouter = require('express').Router()
const User = require('../models/user')
const Blog = require('../models/blog')

usersRouter.post('/', async (request, response, next) => {
  const { username, name, password } = request.body

  if (!password) {
    return response.status(400).json({ error: 'password is missing' })
  }

  if (password.length < 3) {
    return response
      .status(400)
      .json({ error: 'password is too short: must have at least 3 characters' })
  }
  const saltRounds = 10
  try {
    const passwordHash = await bcrypt.hash(password, saltRounds)

    const user = new User({
      username,
      name,
      passwordHash,
    })

    const savedUser = await user.save()

    response.status(201).json(savedUser)
  } catch (error) {
    next(error)
  }
})

usersRouter.get('/', async (_request, response, next) => {
  try {
    const users = await User.find({}).populate('blogs', {
      title: 1,
      author: 1,
      url: 1,
      likes: 1,
    })

    response.json(users)
  } catch (error) {
    next(error)
  }
})

module.exports = usersRouter
