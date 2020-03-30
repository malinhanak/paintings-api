const { ApolloServer } = require('apollo-server');
const mongoose = require('mongoose');
const resolvers = require('./resolvers');
const typeDefs = require('./typeDefs');

mongoose.connect(
  `mongodb+srv://malinhanak:${process.env.MONGODB_SECRET}@art-api-155rd.mongodb.net/test?retryWrites=true&w=majority`,
  { useNewUrlParser: true },
);
const db = mongoose.connection;

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
  console.log("we're connected to db!");
  server
    .listen({
      port: process.env.PORT || 4000,
    })
    .then(({ url }) => {
      console.log(`listening at ${url}`);
    });
});
