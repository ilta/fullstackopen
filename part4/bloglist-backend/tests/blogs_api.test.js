const { test, after, beforeEach, describe } = require('node:test')
const assert = require('node:assert')
const mongoose = require('mongoose')
const supertest = require('supertest')
const app = require('../app')
const api = supertest(app)

const Blog = require('../models/blog')
const helper = require('../utils/test_helper')

beforeEach(async () => {
  await Blog.deleteMany({})

  for (let blog of helper.initialBlogs) {
    let blogObject = new Blog(blog)
    await blogObject.save()
  }
})

describe('blogs_api', () => {
  test('blogs are returned as json', async () => {
    await api
      .get('/api/blogs')
      .expect(200)
      .expect('Content-Type', /application\/json/)
  })

  test('there are three blog posts', async () => {
    const blogsAtEnd = await helper.blogsInDb()
    assert.strictEqual(blogsAtEnd.length, helper.initialBlogs.length)
  })

  test('field id exists', async () => {
    const blogsAtEnd = await helper.blogsInDb()
    assert.ok(typeof blogsAtEnd[0].id === 'string')
  })

  describe('when a new blog post is saved', () => {
    // Add one blog post (total is four)
    beforeEach(async () => {
      const blog = {
        title: 'First class tests',
        author: 'Robert C. Martin',
        url: 'http://blog.cleancoder.com/uncle-bob/2017/05/05/TestDefinitions.htmll',
      }
      await api.post('/api/blogs').send(blog)
    })

    test('the number of blog posts is increased', async () => {
      const blogsAtEnd = await helper.blogsInDb()
      assert.strictEqual(blogsAtEnd.length, helper.initialBlogs.length + 1)
    })

    test('the contents are valid', async () => {
      const blogsAtEnd = await helper.blogsInDb()
      const contents = blogsAtEnd.map((blog) => blog.title)
      assert(contents.includes('First class tests'))
    })
  })

  after(async () => {
    await mongoose.connection.close()
  })
})
