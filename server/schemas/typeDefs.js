const { gql } = require('apollo-server-express');

const typeDefs = gql `
  type User {
    _id: ID
    username: String!
    email: String!
    password: String!
    savedBooks: [Book]!
  }
  
  type Book {
    _id: ID
    authors: [{String}]
    description: String!
    bookId: String!
    image: String
    title: String!
  }

  type Auth {
    token: ID!
    user: User
  }
`;