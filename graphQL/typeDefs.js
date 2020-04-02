const { gql } = require('apollo-server');

const typeDefs = gql`
  scalar Date

  enum Medium {
    WATERCOLOR
    WATERCOLOR_MARKER
    PENCIL
    CHARCOAL
    GRAPHITE
    MARKERS
    MIXED_MEDIUM
    OIL
    PASTEL
    PIXEL
    INK
  }

  type User {
    id: ID!
    username: String
    password: String
  }

  type LoginResponse {
    token: String
    user: User
  }

  type Painting {
    id: ID!
    title: String
    medium: Medium
    created: Date
    price: Int
    sold: Boolean
    description: String
  }

  type Query {
    currentUser: User
    paintings: [Painting]
    painting(id: ID): Painting
  }

  input PaintingInput {
    id: ID
    title: String
    medium: Medium
    created: Date
    price: Int
    sold: Boolean
    description: String
  }

  type Subscription {
    paintingAdded: Painting
  }

  type Mutation {
    register(username: String!, password: String!): User!
    login(username: String!, password: String!): LoginResponse!
    addPainting(painting: PaintingInput): [Painting]
    deleteOnePainting(id: ID!): Painting
    updateOnePainting(id: ID!, painting: PaintingInput): Painting
  }
`;

module.exports = typeDefs;
