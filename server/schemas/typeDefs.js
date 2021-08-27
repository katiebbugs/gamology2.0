// import the gql tagged template function
const { gql } = require("apollo-server-express");

const typeDefs = gql`
  type Query {
    me: User
  }
  type Mutation {
    login(email: String!, password: String!): Auth
    addUser(username: String!, password: String!, email: String!): Auth
    saveGame(body: saveGameInput): User
    removeGame(gameId: String!): User
  }
  type User {
    _id: ID
    username: String
    email: String
    password: String
    gameCount: Int
    savedGames: [Game]
  }
  input saveGameInput {
    title: String
    genres: [String]
    description: String
    image: String
    link: String
    gameId: String
  }
  type Game {
    title: String
    _id: ID
    genres: [String]
    description: String
    image: String
    link: String
    gameId: String
  }
  type Auth {
    token: ID!
    user: User
  }
`;

module.exports = typeDefs;