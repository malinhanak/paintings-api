const { ApolloServer, gql } = require('apollo-server');

const typeDefs = gql`
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

  type Painting {
    id: ID!
    title: String!
    medium: Medium!
    created: String
    price: Int
    sold: Boolean!
    description: String
  }

  type Query {
    paintings: [Painting]
    painting(id: ID): Painting
  }
`;

const paintings = [
  {
    id: 'womaninblue',
    title: 'Woman in blue',
    medium: 'WATERCOLOR',
    created: '2019',
    price: 300,
    sold: false,
    description:
      'Blue, purle and pink tones of a womans face in profile with flowing hair.',
  },
  {
    id: 'purplemayhem',
    title: 'Purple Mayhem',
    medium: 'WATERCOLOR',
    created: '2019',
    price: 900,
    sold: false,
    description:
      'Abstract watercolor painting in purple/pinkish color theme with darker and lighter details',
  },
];

const resolvers = {
  Query: {
    paintings: () => {
      return paintings;
    },
    painting: (obj, { id }, context, info) => {
      return paintings.find((painting) => painting.id === id) || null;
    },
  },
};

const server = new ApolloServer({
  typeDefs,
  resolvers,
  introspection: true,
  playground: true,
});

server
  .listen({
    port: process.env.PORT || 4000,
  })
  .then(({ url }) => {
    console.log(`listening at ${url}`);
  });
