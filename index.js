const { ApolloServer, gql } = require('apollo-server');
const { GraphQLScalarType } = require('graphql');
const { Kind } = require('graphql/language');
const mongoose = require('mongoose');

mongoose.connect(
  'mongodb+srv://malinhanak:malinsartdb@art-api-155rd.mongodb.net/test?retryWrites=true&w=majority',
  { useNewUrlParser: true },
);
const db = mongoose.connection;

const paintingSchema = new mongoose.Schema({
  title: String,
  medium: String,
  created: Date,
  price: Number,
  sold: Boolean,
  description: String,
});

const Painting = mongoose.model('Painting', paintingSchema);

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

  type Mutation {
    addPainting(painting: PaintingInput): [Painting]
  }
`;

const paintings = [
  {
    id: 'womaninblue',
    title: 'Woman in blue',
    medium: 'WATERCOLOR',
    created: new Date('2019'),
    price: 300,
    sold: false,
    description:
      'Blue, purle and pink tones of a womans face in profile with flowing hair.',
  },
  {
    id: 'purplemayhem',
    title: 'Purple Mayhem',
    medium: 'WATERCOLOR',
    created: new Date('2019'),
    price: 900,
    sold: false,
    description:
      'Abstract watercolor painting in purple/pinkish color theme with darker and lighter details',
  },
];

const resolvers = {
  Query: {
    paintings: async () => {
      return await Painting.find();
    },
    painting: async (obj, { id }, context, info) => {
      return (await Painting.findById(id)) || null;
    },
  },

  Mutation: {
    addPainting: async (obj, { painting }, { userId }) => {
      try {
        if (userId) {
          await Painting.create({
            ...painting,
          });
          return await Painting.find();
        }
        return paintings;
      } catch (error) {
        console.log('error', error);
      }
    },
  },

  Date: new GraphQLScalarType({
    name: 'Date',
    description: 'Its a date',
    parseValue(value) {
      // value form client
      return new Date(value);
    },
    serialize(value) {
      return value.getTime();
    },
    parseLiteral(ast) {
      if (ast.kind === Kind.INT) {
        return newDate(ast.value);
      }
      return null;
    },
  }),
};

const server = new ApolloServer({
  typeDefs,
  resolvers,
  introspection: true,
  playground: true,
  context: ({ req }) => {
    const fakeUser = {
      userId: 'iamafakeuser',
    };
    // Possible to throw error if user doesn't exists
    return {
      ...fakeUser,
    };
  },
});

db.on('error', console.error.bind(console, 'connection error:'));
db.once('open', function() {
  // we're connected!
  console.log("we're connected to db!");
  server
    .listen({
      port: process.env.PORT || 4000,
    })
    .then(({ url }) => {
      console.log(`listening at ${url}`);
    });
});
