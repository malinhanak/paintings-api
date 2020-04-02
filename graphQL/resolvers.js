const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const { GraphQLScalarType } = require("graphql");
const { PubSub } = require("apollo-server");
const { Kind } = require("graphql/language");
const { Painting, User } = require("./models");
const { getUser } = require("../helpers/getUser");
const { validateUser } = require("../helpers/validateUser");

const pubsub = new PubSub();
const PAINTING_ADDED = "PAINTING_ADDED";

const resolvers = {
  Subscription: {
    paintingAdded: {
      subscribe: () => pubsub.asyncIterator([PAINTING_ADDED])
    }
  },
  Query: {
    currentUser: async (obj, args, { auth }) => {
      await getUser(auth);
      const currentUser = await User.findOne({ _id: user.id });
      return currentUser;
    },
    paintings: async (obj, args, context) => {
      return await Painting.find();
    },
    painting: async (obj, { id }, context, info) => {
      return (await Painting.findById(id)) || null;
    }
  },

  Mutation: {
    register: async (obj, { username, password }, context, info) => {
      const hashedPassword = await bcrypt.hash(password, 10);
      const user = await User.create({
        username,
        password: hashedPassword
      });
      return user;
    },
    login: async (obj, { username, password }, context, info) => {
      const user = await User.findOne({ username });
      await validateUser(user, password);

      const token = await jwt.sign({ id: user.id, username: user.username }, process.env.TOKEN_SUPER_SECRET, {
        expiresIn: "30d"
      });
      return { token, user };
    },
    addPainting: async (obj, { painting }, { auth }) => {
      try {
        await getUser(auth);
        pubsub.publish(PAINTING_ADDED, {
          paintingAdded: await Painting.create({
            ...painting
          })
        });
        return await Painting.find();
      } catch (error) {
        return error;
      }
    },
    deleteOnePainting: async (obj, { id }, { auth }) => {
      try {
        await getUser(auth);
        return await Painting.deleteOne({ _id: id });
      } catch (error) {
        return error;
      }
    },
    updateOnePainting: async (obj, { id, painting }, { auth }) => {
      try {
        await Painting.updateOne({ _id: id }, { ...painting });
        return await Painting.findById(id);
      } catch (error) {
        throw new Error(error.message);
      }
    }
  },

  Date: new GraphQLScalarType({
    name: "Date",
    description: "Its a date",
    parseValue(value) {
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
    }
  })
};

module.exports = resolvers;
