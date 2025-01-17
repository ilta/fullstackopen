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
    // Note: the likes property is intentionally omitted
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

    test('likes defaults to 0 if a post is missing the property', async () => {
      const blogsAtEnd = await helper.blogsInDb()
      assert.strictEqual(blogsAtEnd[blogsAtEnd.length - 1].likes, 0)
    })
  })

  describe('saving a new post is rejected', () => {
    test('with status 400 when the title property is missing', async () => {
      await api
        .post('/api/blogs')
        .send({ author: 'Rob', url: 'http://example.com/1' })
        .expect(400, { error: 'title is missing' })
        .expect('Content-Type', /application\/json/)
    })
    test('with status 400 when the url property is missing', async () => {
      await api
        .post('/api/blogs')
        .send({ author: 'Rob', title: 'First class tests' })
        .expect(400, { error: 'url is missing' })
        .expect('Content-Type', /application\/json/)
    })
    test('with status 400 when url validation failed because the url is too short', async () => {
      const { body } = await api
        .post('/api/blogs')
        // Url is too short
        .send({ author: 'Rob', title: 'First class tests', url: 'http://e' })
        .expect(400)
        .expect('Content-Type', /application\/json/)
      assert.match(body.error, /Blog validation failed: url/)
    })

    after(async () => {
      // Check that no new blog posts were actually added
      const blogsAtEnd = await helper.blogsInDb()
      assert.strictEqual(blogsAtEnd.length, helper.initialBlogs.length)
    })
  })

  after(async () => {
    await mongoose.connection.close()
  })
})
