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

describe('when the database has some initial blog posts', () => {
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

  test('fetching an invalid URL fails with status 404', async () => {
    await api.get('/api/blog').expect(404)
  })

  describe('and a new blog post is saved', () => {
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

      // Check that no new blog posts were actually added
      const blogsAtEnd = await helper.blogsInDb()
      assert.strictEqual(blogsAtEnd.length, helper.initialBlogs.length)
    })
    test('with status 400 when the url property is missing', async () => {
      await api
        .post('/api/blogs')
        .send({ author: 'Rob', title: 'First class tests' })
        .expect(400, { error: 'url is missing' })
        .expect('Content-Type', /application\/json/)

      // Check that no new blog posts were actually added
      const blogsAtEnd = await helper.blogsInDb()
      assert.strictEqual(blogsAtEnd.length, helper.initialBlogs.length)
    })
    test('with status 400 when url validation failed because the url is too short', async () => {
      const { body } = await api
        .post('/api/blogs')
        // Url is too short
        .send({ author: 'Rob', title: 'First class tests', url: 'http://e' })
        .expect(400)
        .expect('Content-Type', /application\/json/)
      assert.match(body.error, /Blog validation failed: url/)

      // Check that no new blog posts were actually added
      const blogsAtEnd = await helper.blogsInDb()
      assert.strictEqual(blogsAtEnd.length, helper.initialBlogs.length)
    })
  })

  describe('the deletion of a blog post', () => {
    test('succeeds with status 204 if id is valid', async () => {
      const blogsAtStart = await helper.blogsInDb()
      const blogToDelete = blogsAtStart[0]

      await api.delete(`/api/blogs/${blogToDelete.id}`).expect(204)
      const blogsAtEnd = await helper.blogsInDb()
      assert.strictEqual(blogsAtEnd.length, helper.initialBlogs.length - 1)
    })

    test('fails with status 400 if id is not valid', async () => {
      await api.delete('/api/blogs/5').expect(400, { error: 'malformatted id' })
      const blogsAtEnd = await helper.blogsInDb()
      assert.strictEqual(blogsAtEnd.length, helper.initialBlogs.length)
    })
  })

  describe('updating the like property of a post', () => {
    test('with valid data succeeds with status 200', async () => {
      const blogsAtStart = await helper.blogsInDb()
      const blogToUpdate = blogsAtStart[0]
      const blog = {
        id: '5a422a851b54a676234d17f7',
        title: 'React patterns',
        author: 'Michael Chan',
        url: 'https://reactpatterns.com/',
        likes: 8,
      }
      await api
        .put(`/api/blogs/${blogToUpdate.id}`)
        .send(blog)
        // Checking the status code and that the response matches sent data
        .expect(200, blog)
    })

    test('without likes succeeds with status 200 and likes is set to 0', async () => {
      const blogsAtStart = await helper.blogsInDb()
      const blogToUpdate = blogsAtStart[0]
      const blog = {
        id: '5a422a851b54a676234d17f7',
        title: 'React patterns',
        author: 'Michael Chan',
        url: 'https://reactpatterns.com/',
      }
      const expectedBlog = { ...blog, likes: 0 }
      await api
        .put(`/api/blogs/${blogToUpdate.id}`)
        .send(blog)
        // Checking the status code and that the response matches sent data
        .expect(200, expectedBlog)
    })

    test('without a title succeeds with status 200', async () => {
      const blogsAtStart = await helper.blogsInDb()
      const blogToUpdate = blogsAtStart[0]
      const blog = {
        id: '5a422a851b54a676234d17f7',
        author: 'Michael Chan',
        url: 'https://reactpatterns.com/',
        likes: 8,
      }
      const expectedBlog = { ...blog, title: blogToUpdate.title }
      await api
        .put(`/api/blogs/${blogToUpdate.id}`)
        .send(blog)
        // Checking the status code and that the response matches sent data
        .expect(200, expectedBlog)
    })

    test('with invalid url fails with status 400', async () => {
      const blogsAtStart = await helper.blogsInDb()
      const blogToUpdate = blogsAtStart[0]
      const blog = {
        id: '5a422a851b54a676234d17f7',
        title: 'React patterns',
        author: 'Michael Chan',
        url: 'http://', // too short
        likes: 8,
      }
      const { body } = await api
        .put(`/api/blogs/${blogToUpdate.id}`)
        .send(blog)
        // Checking the status code and that the response matches sent data
        .expect(400)

      assert.match(body.error, /Validation failed: url/)
    })
  })

  after(async () => {
    await mongoose.connection.close()
  })
})
