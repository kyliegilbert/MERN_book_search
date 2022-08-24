const { gql } = require('apollo-server-express');

const typeDefs = gql`

  type Users {
    _id:ID
    username: String!
    email: String!
    password: String!
    savedBooks: [Book]
  }

  type User {
    _id: ID
    username: String
    email: String
    password: String
    savedBooks: [Book]
  }

  type Auth {
    token: ID!
    user: User
  }

  type Book {
    authors: [String]
    description: String!
    bookId: String!
    image: String
    link: String
    title: String!
  }

  input bookInput {
    authors: [String]
    description: String
    title: String
    bookId: String
    image: String
    link: String
  }

  type Query {
    users: [User]
    me: User
  }

  type Mutation {
    createUser(username: String!, email: String!, password: String!): Auth
    login(email: String!, password: String!): Auth
    saveBook(input: bookInput): User
    deleteBook(bookId: String!): User
  }
`;

module.exports = typeDefs;