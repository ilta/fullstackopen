import { gql } from '@apollo/client'

export const ALL_AUTHORS = gql`
  query listAllAuthors {
    allAuthors {
      name
      born
      bookCount
    }
  }
`

export const ALL_BOOKS = gql`
  query listAllBooks {
    allBooks {
      title
      author
      published
    }
  }
`
