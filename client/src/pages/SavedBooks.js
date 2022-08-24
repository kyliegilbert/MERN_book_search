import React from 'react';
import { Jumbotron, Container, CardColumns, Card, Button } from 'react-bootstrap';

import { useQuery, useMutation } from '@apollo/client';
import { DELETE_BOOK } from '../utils/mutations'
import { QUERY_ME } from '../utils/queries'

// import { getMe, deleteBook } from '../utils/API';
import Auth from '../utils/auth';
import { removeBookId } from '../utils/localStorage';
// import { removeBookId } from '../utils/localStorage';

const SavedBooks = () => {

  const { loading, data } = useQuery(QUERY_ME);

  const [deleteBook, { error }] = useMutation(DELETE_BOOK);

  const userData = data?.me || {};
  
  console.log(userData)
  console.log(userData.username)

  if(!userData.username) {
    return (
      <h4>
        Please log in to see this page.
      </h4>
    )
  }


  // create function that accepts the book's mongo _id value as param and deletes the book from the database
  const handleDeleteBook = async (bookId) => {

    console.log('book id ' + bookId)
    
    const token = Auth.loggedIn() ? Auth.getToken() : null;
    console.log(token)
    
    if (!token) {
      return false;
    }

    try {
      const { data } = await deleteBook({
        variables: { bookId },
        
      });

      removeBookId(bookId)
    } catch (err) {
      console.error(err);
    }
  };

  // if data isn't here yet, say so
  if (loading) {
    return <h2>LOADING...</h2>;
  }

  return (
    <>
      <Jumbotron fluid className='text-light bg-dark'>
        <Container>
          <h1>Viewing saved books!</h1>
        </Container>
      </Jumbotron>
      <Container>
        <h2>
          {userData.savedBooks.length
            ? `Viewing ${userData.savedBooks.length} saved ${userData.savedBooks.length === 1 ? 'book' : 'books'}:`
            : 'You have no saved books!'}
        </h2>
        <CardColumns>
          {userData.savedBooks.map((book) => {
            return (
              <Card key={book.bookId} border='dark'>
                {book.image ? <Card.Img src={book.image} alt={`The cover for ${book.title}`} variant='top' /> : null}
                <Card.Body>
                  <Card.Title>{book.title}</Card.Title>
                  <p className='small'>Authors: {book.authors}</p>
                  <Card.Text>{book.description}</Card.Text>
                  <Button className='btn-block btn-danger' onClick={() => handleDeleteBook(book.bookId)}>
                    Delete this Book!
                  </Button>
                </Card.Body>
              </Card>
            );
          })}
        </CardColumns>
      </Container>
    </>
  );
};

export default SavedBooks;
