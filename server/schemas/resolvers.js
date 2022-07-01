const { Book, User } = require('../models');
const { AuthenticationError } = require('apollo-server-express');
const { signToken } = require('../utils/auth');

const resolvers = {
    Query: {
        // Get Single User
        me: async (parent, args, context) => {
            if (context.user) {
                const foundUser = await User.findOne({ _id: context.user._id }).select('-__v -password');

                return foundUser;
            }
            throw new AuthenticationError('Must be logged in!');
        },
    },
    Mutation: {
        // Create User
        addUser: async (parent, args) => {
            const user = await User.create(args);
            const token = signToken(user);

            return { token, user }
        },

        //TODO: Login
        login: async (parent, args) => {
            const user = await User.findOne({
                email: args.email
            });

            if (!user) {
                throw new AuthenticationError('Email or Password incorrect');
            }

            const correctPw = await user.isCorrectPassword(args.password);

            if (!correctPw) {
                throw new AuthenticationError('Email or Password incorrect');
            }

            const token = signToken(user);
            return { token, user }
        },

        // Save Book/ accepts a book author's array, description, title, bookId, image, and link as parameters
        // returns a user type, look into creating whats know as an input type to handle all of these parameters
        savedBooks: async (parent, { bookData }, context) => {
            if (context.user) {
                const updatedUser = await User.findOneAndUpdate(
                    { _id: context.user._id },
                    { $push: { savedBooks: bookData } },
                    { new: true }
                );
                return updatedUser;
            }
            throw new AuthenticationError('You must be logged in!');
        },
        // Delete Book
        removeBook: async (parent, { bookId }, context) => {
            if (context.user) {
                const updatedUser = await User.findOneAndUpdate(
                    { _id: context.user._id },
                    { $pull: { savedBooks: { bookId: bookId } } },
                    { new: true }
                );
                return updatedUser;
            }
            throw new AuthenticationError('You must be logged in!');
        }
    }
}

module.exports = resolvers;