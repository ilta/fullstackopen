const { ApolloServer } = require('@apollo/server')
const { expressMiddleware } = require('@apollo/server/express4')
const {
  ApolloServerPluginDrainHttpServer,
} = require('@apollo/server/plugin/drainHttpServer')
const { makeExecutableSchema } = require('@graphql-tools/schema')
const express = require('express')
const cors = require('cors')
const http = require('http')
const { WebSocketServer } = require('ws')
const { useServer } = require('graphql-ws/use/ws')
const { PubSub } = require('graphql-subscriptions')
const pubsub = new PubSub()
const { GraphQLError } = require('graphql')
const mongoose = require('mongoose')
mongoose.set('strictQuery', false)
const Book = require('./models/book')
const Author = require('./models/author')
const User = require('./models/user')
const config = require('./utils/config')
const jwt = require('jsonwebtoken')

const typeDefs = `
  type Book {
    title: String!
    published: Int
    author: Author!
    genres: [String!]!
    id: ID!
  }

  type Author {
    name: String!,
    born: Int,
    bookCount: Int!
    books: [ID!]!
    id: ID!
  }

  type User {
    username: String!
    favoriteGenre: String!
    id: ID!
  }

  type Token {
    value: String!
  }

  type Query {
    bookCount: Int!
  }

  type Query {
    authorCount: Int!
  }

  type Query {
    allBooks (author: String, genre: String): [Book!]!
  }

  type Query {
    allAuthors: [Author!]!
  }

  type Query {
    me: User
  }

  type Mutation {
    addBook(
      title: String!
      published: Int
      author: String!
      genres: [String!]!
    ): Book!
  }

  type Mutation {
    editAuthor(
      name: String!
      setBornTo: Int!): Author!
  }

  type Mutation {
    createUser (
      username: String!
      favoriteGenre: String!
    ): User
  }

  type Mutation {
    login(
      username: String!
      password: String!
    ): Token
  }

  type Subscription {
    bookAdded: Book!
  }
`

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
console.log('Connecting to', config.MONGODB_URI)

mongoose
  .connect(config.MONGODB_URI)
  .then(() => {
    console.log('connected to MongoDB')
  })
  .catch((error) => {
    console.log('error connection to MongoDB:', error.message)
  })

const server = new ApolloServer({
  typeDefs,
  resolvers,
})

const start = async () => {
  const app = express()
  const httpServer = http.createServer(app)

  const wsServer = new WebSocketServer({
    server: httpServer,
    path: '/',
  })

  const schema = makeExecutableSchema({ typeDefs, resolvers })
  const serverCleanup = useServer({ schema }, wsServer)

  const server = new ApolloServer({
    schema: makeExecutableSchema({ typeDefs, resolvers }),
    plugins: [
      ApolloServerPluginDrainHttpServer({ httpServer }),
      {
        async serverWillStart() {
          return {
            async drainServer() {
              await serverCleanup.dispose()
            },
          }
        },
      },
    ],
  })

  await server.start()

  app.use(
    '/',
    cors(),
    express.json(),
    expressMiddleware(server, {
      context: async ({ req, res }) => {
        const auth = req ? req.headers.authorization : null
        if (auth && auth.startsWith('Bearer ')) {
          const decodedToken = jwt.verify(auth.substring(7), config.SECRET)
          const currentUser = await User.findById(decodedToken.id)

          return { currentUser }
        }
      },
    })
  )

  const PORT = config.PORT

  httpServer.listen(PORT, () =>
    console.log(`Server is now running on http://localhost:${PORT}`)
  )
}

start()
