const { ApolloServer } = require('@apollo/server')
const { GraphQLError } = require('graphql')
const { startStandaloneServer } = require('@apollo/server/standalone')
const mongoose = require('mongoose')
mongoose.set('strictQuery', false)
const Book = require('./models/book')
const Author = require('./models/author')
const config = require('./utils/config')

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
    id: ID!
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
  },

  Author: {
    bookCount: (root) => root.books.length,
  },

  Mutation: {
    addBook: async (root, args) => {
      if (!args.author)
        throw new GraphQLError('Saving book failed: missing author', {
          extensions: {
            code: 'BAD_USER_INPUT',
            invalidArgs: args.author,
          },
        })

      let author = await Author.findOne({ name: args.author })
      if (!author) {
        author = new Author({ name: args.author, books: [] })
      }

      let book
      try {
        book = new Book({ ...args, author: author._id })
        await book.save()
      } catch (error) {
        throw new GraphQLError('Saving book failed', {
          extensions: {
            code: 'BAD_USER_INPUT',
            error,
          },
        })
      }

      author.books = author.books.concat(book._id)
      try {
        await author.save()
      } catch (error) {
        throw new GraphQLError('Saving author failed', {
          extensions: {
            code: 'BAD_USER_INPUT',
            error,
          },
        })
      }

      return await Book.findOne({ title: book.title }).populate('author')
    },
    editAuthor: async (root, args) => {
      if (!args.name || !args.setBornTo) return null

      const author = await Author.findOne({ name: args.name })
      if (!author) return null

      author.born = args.setBornTo
      try {
        await author.save()
      } catch (error) {
        throw new GraphQLError('Saving author failed', {
          extensions: {
            code: 'BAD_USER_INPUT',
            error,
          },
        })
      }
      return author
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

startStandaloneServer(server, {
  listen: { port: config.PORT },
}).then(({ url }) => {
  console.log(`Server ready at ${url}`)
})
