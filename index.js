const { ApolloServer } = require("apollo-server");
const mongoose = require("mongoose");
const resolvers = require("./graphQL/resolvers");
const typeDefs = require("./graphQL/typeDefs");
const jwt = require("jsonwebtoken");

mongoose.connect(
  `mongodb+srv://malinhanak:${process.env.MONGODB_SECRET}@art-api-155rd.mongodb.net/test?retryWrites=true&w=majority`,
  { useNewUrlParser: true }
);
const db = mongoose.connection;

const getUserFromToken = (token) => {
  const authObj = {
    user: null,
    error: null
  };
  if (token) {
    return jwt.verify(token, process.env.TOKEN_SUPER_SECRET, (err, decode) => {
      if (err) {
        authObj.error = { name: err.name, message: err.message };
      } else {
        authObj.user = decode ? decode : null;
      }
      return authObj;
    });
  }
  // try {
  //   if (token) {
  //     return jwt.verify(token, process.env.TOKEN_SUPER_SECRET);
  //   }
  //   return null;
  // } catch (err) {
  //   console.log('err', err);
  //   // if (err.name === 'JsonWebTokenError') throw new Error(err.message);
  //   // if (err.name === 'TokenExpiredError')
  //   //   throw new Error('Your token has expired');
  //   return err;
  // }
};

const server = new ApolloServer({
  typeDefs,
  resolvers,
  introspection: true,
  playground: true,
  context: ({ req }) => {
    const tokenWithBearer = req.headers.authorization || "";
    const token = tokenWithBearer.split(" ")[1];
    const auth = getUserFromToken(token);

    return {
      auth
    };
  }
});

db.on("error", console.error.bind(console, "connection error:"));
db.once("open", function() {
  console.log("we're connected to db!");
  server
    .listen({
      port: process.env.PORT || 4000
    })
    .then(({ url }) => {
      console.log(`listening at ${url}`);
    });
});
