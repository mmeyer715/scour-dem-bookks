import { gql } from '@apollo/client';

// login
export const LOGIN_USER = gql`
    mutation login($email: String!, $password: String!) {
        login(email: $email, password: $password) {
            token
            user {
                _id
                username
            }
        }
    }
`;
// addUser
export const ADD_USER = sql `
    mutation addUser($username: String!, $email: String!, $password: String!) {
        addUser(username: $username, email: $email, password: $password) {
            token
            user {
                _id
                username
            }
        }
    }
`;
// saveBook
export const SAVE_BOOK = gql`
    mutation saveBook($bookData: SavedBookInput!){
        saveBook(bookData: $bookData){
            _id
            username
            email
            saveBooks{
                bookId
                authors
                image
                description
                title
                link
            }
        }
    }
`

// removeBook
export const REMOVE_BOOK = gql`
    mutation removeBook($bookId: ID!){
        removeBook(bookId: $bookId){
            _id
            username
            email
            saveBooks{
                bookId
                authors
                image
                description
                title
                link
            }
        }
    }
`