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

describe('when there are initially two users in db, logging in', () => {
  test('users are returned as json', async () => {
    await api
      .get('/api/users')
      .expect(200)
      .expect('Content-Type', /application\/json/)
  })

  test('succeeds with proper username and password', async () => {
    const user = helper.initialUsers[0]

    const result = await api
      .post('/api/login')
      .send(user)
      .expect(200)
      .expect('Content-Type', /application\/json/)

    assert.strictEqual(result.body.username, 'tim')
  })

  test('fails with proper status code and message when password is not provided', async () => {
    const user = {
      username: 'tim',
    }

    const result = await api
      .post('/api/login')
      .send(user)
      .expect(401)
      .expect('Content-Type', /application\/json/)

    assert.strictEqual(result.body.error, 'invalid username or password')
  })

  test('fails with proper status code and message when password is wrong', async () => {
    const user = {
      username: 'tim',
      password: 'password',
    }

    const result = await api
      .post('/api/login')
      .send(user)
      .expect(401)
      .expect('Content-Type', /application\/json/)

    assert.strictEqual(result.body.error, 'invalid username or password')
  })

  test('fails with proper status code and message when username is not provided', async () => {
    const user = {
      password: 'this password is too weak',
    }

    const result = await api
      .post('/api/login')
      .send(user)
      .expect(401)
      .expect('Content-Type', /application\/json/)

    assert.strictEqual(result.body.error, 'invalid username or password')
  })

  test('fails with proper status code and message when user does not exist', async () => {
    const user = {
      username: 'pam',
      password: 'adpkMN9afl8aufam07b',
    }

    const result = await api
      .post('/api/login')
      .send(user)
      .expect(401)
      .expect('Content-Type', /application\/json/)

    assert.strictEqual(result.body.error, 'invalid username or password')
  })
})

after(async () => {
  await mongoose.connection.close()
})
