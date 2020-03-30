const { GraphQLScalarType } = require('graphql');
const { PubSub } = require('apollo-server');
const { Kind } = require('graphql/language');
const mongoose = require('mongoose');

const paintingSchema = new mongoose.Schema({
  title: String,
  medium: String,
  created: Date,
  price: Number,
  sold: Boolean,
  description: String,
});

const Painting = mongoose.model('Painting', paintingSchema);
const pubsub = new PubSub();
const PAINTING_ADDED = 'PAINTING_ADDED';

const resolvers = {
  Subscription: {
    paintingAdded: {
      subscribe: () => pubsub.asyncIterator([PAINTING_ADDED]),
    },
  },
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
          pubsub.publish(PAINTING_ADDED, {
            paintingAdded: await Painting.create({
              ...painting,
            }),
          });
          return await Painting.find();
        } else {
          throw new Error('NonExistingUser');
        }
      } catch (error) {
        if (error.message === 'NonExistingUser') {
          throw new Error('You are not an authorized user');
        }
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

module.exports = resolvers;
