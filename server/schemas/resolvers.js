const { Book, User } = require('../models');
const {AuthenticationError} = require('apollo-server-express');
const {signToken} = require('../utils/auth');

const resolvers = {
    Query: {
        // Get Single User
        me: async (parent, args, context) => {
            const foundUser = await User.findOne({
                _id: context.user._id
            });
            return foundUser;
        }
    },
    Mutation: {
        // Create User
        createUser: async (parent, args) =>{
            const user = await User.create(args);
            const token = signToken(user);
            return {token, user}
        },
    
        //TODO: Login
        login: async (parent, args) =>{
            const user = await User.findOne({
                email: args.email
            });

            if (!user){
                throw new AuthenticationError('Email or Password incorrect');
            }

            const correctPw = await user.isCorrectPassword(args.password);

            if (!correctPw){
                throw new AuthenticationError('Email or Password incorrect');
            }

            const token = signToken(user);
            return {token, user}
        },

        //TODO: Save Book
        saveBook: async (parent, args, context) => {
            if (context.user) {
                const updatedUser = await User.findOneAndUpdate(
                    { _id: context.user._id },
                    { $push: {savedBooks: args.newBook}},
                    { new: true },
                );
                return updatedUser;
            }
            throw new AuthenticationError('You must be logged in!');
        },
        //TODO: Delete Book
        deleteBook: async (parent, args, context) => {
            if (context.user) {
                const updatedUser = await User.findOneAndUpdate(
                    { _id: context.user._id },
                    { $pull: { savedBooks: args.bookId} },
                    { new: true }
                );
                return updatedUser;
            }
        }
    }
}

module.exports = resolvers;