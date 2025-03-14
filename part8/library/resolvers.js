const { PubSub } = require('graphql-subscriptions')
const pubsub = new PubSub()
const Book = require('./models/book')
const Author = require('./models/author')
const mongoose = require('mongoose')
const User = require('./models/user')
const config = require('./utils/config')
const { GraphQLError } = require('graphql')
const jwt = require('jsonwebtoken')

const resolvers = {
  Query: {
    bookCount: async () => Book.collection.countDocuments(),
    authorCount: async () => Author.collection.countDocuments(),
    allBooks: async (root, args) => {
      // Find by author AND genre
      if (args.author && args.genre) {
        const author = await Author.findOne({ name: args.author })
        if (!author) return []

        return Book.find({
          genres: { $in: args.genre },
          author: author.id,
        }).populate('author')
      }

      // Find by genre
      if (args.genre) {
        return Book.find({ genres: { $in: args.genre } }).populate('author')
      }

      // Find by author
      if (args.author) {
        const author = await Author.findOne({ name: args.author })
        if (!author) return []

        return Book.find({ author: author.id }).populate('author')
      } else {
        return Book.find({}).populate('author')
      }
    },
    allAuthors: async () => Author.find({}),
    me: async (root, args, context) => context.currentUser,
  },

  Author: {
    bookCount: (root) => root.books.length,
  },

  Mutation: {
    addBook: async (root, args, context) => {
      if (!context.currentUser)
        throw new GraphQLError('Not authenticated', {
          extensions: {
            code: 'BAD_USER_INPUT',
          },
        })

      if (!args.author)
        throw new GraphQLError('Saving book failed: missing author', {
          extensions: {
            code: 'BAD_USER_INPUT',
            invalidArgs: args.author,
          },
        })

      const session = await mongoose.startSession()
      session.startTransaction()

      let book, author
      try {
        author = await Author.findOne({ name: args.author })
        if (!author) {
          // Note: the first parameter of Model.create() must be an array when
          // session option is used
          ;[author] = await Author.create([{ name: args.author, books: [] }], {
            session,
          })
        }

        ;[book] = await Book.create([{ ...args, author: author._id }], {
          session,
        })

        const updatedBooks = author.books.concat(book._id)
        await Author.updateOne(
          { name: args.author },
          { books: updatedBooks },
          { session }
        )

        await session.commitTransaction()
      } catch (error) {
        await session.abortTransaction()
        throw new GraphQLError('Adding a book failed', {
          extensions: {
            code: 'BAD_USER_INPUT',
            error,
          },
        })
      } finally {
        session.endSession()
      }

      const returnedBook = await Book.findById(book._id).populate('author')

      pubsub.publish('BOOK_ADDED', {
        bookAdded: returnedBook,
      })

      return returnedBook
    },
    editAuthor: async (root, args, context) => {
      if (!context.currentUser)
        throw new GraphQLError('Not authenticated', {
          extensions: {
            code: 'BAD_USER_INPUT',
          },
        })

      if (!args.name)
        throw new GraphQLError('Saving author failed: erroneous name', {
          extensions: {
            code: 'BAD_USER_INPUT',
            invalidArgs: args.name,
          },
        })

      const author = await Author.findOne({ name: args.name })
      if (!author)
        throw new GraphQLError('Saving author failed: author not found', {
          extensions: {
            code: 'BAD_USER_INPUT',
            invalidArgs: args.name,
          },
        })

      author.born = args.setBornTo
      try {
        await author.save()
      } catch (error) {
        throw new GraphQLError('Saving author failed', {
          extensions: {
            code: 'BAD_USER_INPUT',
            invalidArgs: args.setBornTo,
            error,
          },
        })
      }
      return author
    },
    createUser: (root, args) => {
      const user = new User({
        username: args.username,
        favoriteGenre: args.favoriteGenre,
      })

      return user.save().catch((error) => {
        throw new GraphQLError('Creating user failed', {
          extensions: {
            code: 'BAD_USER_INPUT',
            error,
          },
        })
      })
    },
    login: async (root, args) => {
      const user = await User.findOne({ username: args.username })

      // Note: hardcoded password
      if (!user || args.password !== 'secret') {
        throw new GraphQLError('Wrong credentials', {
          extensions: {
            code: 'BAD_USER_INPUT',
          },
        })
      }

      const userForToken = {
        username: user.username,
        id: user._id,
      }

      return { value: jwt.sign(userForToken, config.SECRET) }
    },
  },
  Subscription: {
    bookAdded: {
      subscribe: () => pubsub.asyncIterableIterator(['BOOK_ADDED']),
    },
  },
}

module.exports = resolvers
