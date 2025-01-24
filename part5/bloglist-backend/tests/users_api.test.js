const { test, after, beforeEach, describe } = require('node:test')
const assert = require('node:assert')
const mongoose = require('mongoose')
const supertest = require('supertest')
const app = require('../app')
const api = supertest(app)
const bcrypt = require('bcrypt')

const User = require('../models/user')
const helper = require('../utils/test_helper')

beforeEach(async () => {
  await User.deleteMany({})

  for (let user of helper.initialUsers) {
    let { username, name, password } = user
    let passwordHash = await bcrypt.hash(password, 10)
    let userObject = new User({ username, name, passwordHash })
    await userObject.save()
  }
})

describe('when there are initially two users in db', () => {
  test('users are returned as json', async () => {
    await api
      .get('/api/users')
      .expect(200)
      .expect('Content-Type', /application\/json/)
  })

  test('creation fails with proper status code and message if username already taken', async () => {
    const usersAtStart = await helper.usersInDb()
    const newUser = helper.initialUsers[0]

    const result = await api
      .post('/api/users')
      .send(newUser)
      .expect(400)
      .expect('Content-Type', /application\/json/)

    const usersAtEnd = await helper.usersInDb()
    assert(result.body.error.includes('expected `username` to be unique'))

    assert.strictEqual(usersAtEnd.length, usersAtStart.length)
  })

  test('creation fails with proper status code and message if username is missing', async () => {
    const usersAtStart = await helper.usersInDb()
    const newUser = {
      name: 'Jack Skellington',
      password: 'calavera',
    }

    const result = await api
      .post('/api/users')
      .send(newUser)
      .expect(400)
      .expect('Content-Type', /application\/json/)

    const usersAtEnd = await helper.usersInDb()
    assert(result.body.error.includes('username: Path `username` is required'))

    assert.strictEqual(usersAtEnd.length, usersAtStart.length)
  })

  test('creation fails with proper status code and message if username is too short', async () => {
    const usersAtStart = await helper.usersInDb()
    const newUser = {
      username: 'ja',
      name: 'Jack Skellington',
      password: 'calavera',
    }

    const result = await api
      .post('/api/users')
      .send(newUser)
      .expect(400)
      .expect('Content-Type', /application\/json/)

    const usersAtEnd = await helper.usersInDb()
    assert.match(
      result.body.error,
      /username: Path `username` .* is shorter than the minimum allowed length/
    )

    assert.strictEqual(usersAtEnd.length, usersAtStart.length)
  })

  test('creation fails with proper status code and message if password is missing', async () => {
    const usersAtStart = await helper.usersInDb()
    const newUser = {
      username: 'jack',
      name: 'Jack Skellington',
    }

    const result = await api
      .post('/api/users')
      .send(newUser)
      .expect(400)
      .expect('Content-Type', /application\/json/)

    const usersAtEnd = await helper.usersInDb()

    console.log(result.body.error)
    assert.strictEqual(result.body.error, 'password is missing')

    assert.strictEqual(usersAtEnd.length, usersAtStart.length)
  })

  test('creation fails with proper status code and message if password is too short', async () => {
    const usersAtStart = await helper.usersInDb()
    const newUser = {
      username: 'jack',
      name: 'Jack Skellington',
      password: '2',
    }

    const result = await api
      .post('/api/users')
      .send(newUser)
      .expect(400)
      .expect('Content-Type', /application\/json/)

    const usersAtEnd = await helper.usersInDb()
    assert.strictEqual(
      result.body.error,
      'password is too short: must have at least 3 characters'
    )

    assert.strictEqual(usersAtEnd.length, usersAtStart.length)
  })
})

after(async () => {
  await mongoose.connection.close()
})
