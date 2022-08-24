const { AuthenticationError } = require('apollo-server-express');
const { User, Book } = require('../models');
const { signToken } = require('../utils/auth');

const resolvers = {
  Query: {
    users: async() => {
      return User.find();
    },
    
    me: async (parent, args, context) => {
      if (context.user) {
        const userData = await User.findOne({ _id: context.user._id });
        console.log(context.user)
        console.log(userData)
        return userData;
      }
      throw new AuthenticationError('You need to be logged in!');
    },
  },


  Mutation: {
    createUser: async (parent, { username, email, password }) => {
      const user = await User.create({ username, email, password });
      const token = signToken(user);
      console.log('user created')
      return { token, user };
    },
    
    login: async (parent, { email, password }) => {
      const user = await User.findOne({ email });

      if (!user) {
        throw new AuthenticationError('No user found with this email address');
      }

      const correctPw = await user.isCorrectPassword(password);

      if (!correctPw) {
        throw new AuthenticationError('Incorrect credentials');
      }

      const token = signToken(user);
      console.log('logged in')
      return { token, user };
    },
    
    deleteBook: async (parent, { bookId }, context) => {
      console.log('id ' + bookId)
      if (context.user) {
        const updatedBooks = User.findByIdAndUpdate(
          { _id: context.user._id },
          { $pull: { savedBooks: { bookId }}},
          { new: true } 
        )
        console.log('book deleted')
        return updatedBooks
      }
      throw new AuthenticationError('Can not delete')
    },

    saveBook: async (parent, { input }, context) => {
      if (context.user) {
        console.log('context.user' + context.user)
        console.log('bookToSave ' + input)
        const updateBooks = await User.findOneAndUpdate(
          { _id: context.user._id },
          { $addToSet: { savedBooks: input }},
          { new: true }
        ).populate('savedBooks');
        console.log("book saved")
        console.log(updateBooks)
        return updateBooks;
      }
      throw new AuthenticationError('Please log in!');
    } 
   },
};

module.exports = resolvers;