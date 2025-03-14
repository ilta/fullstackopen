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

module.exports = typeDefs
