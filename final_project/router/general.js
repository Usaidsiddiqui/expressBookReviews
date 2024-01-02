const express = require('express');
let books = require("./booksdb.js");
let isValid = require("./auth_users.js").isValid;
let users = require("./auth_users.js").users;
const public_users = express.Router();
const axios = require('axios');

async function getBooks() {
  try {
    const response = await axios.get('/');
    return response.data;
  } catch (error) {
    throw error;
  }
}


const doesExist = (username)=>{
  let userswithsamename = users.filter((user)=>{
    return user.username === username
  });
  if(userswithsamename.length > 0){
    return true;
  } else {
    return false;
  }
}

public_users.post("/register", (req,res) => {
  const username = req.body.username;
  const password = req.body.password;
  console.log(username)
  if (username && password) {
    
    if (!doesExist(username)) { 
      usersdb.push({"username":username,"password":password});
      return res.status(200).json({message: "User successfully registred. Now you can login"});
    } else {
      return res.status(404).json({message: "User already exists!"});    
    }
  } 
  return res.status(404).json({message: "Unable to register user."});
});


// Get the book list available in the shop
public_users.get('/',function (req, res) {
  (async () => {
    try {
      const books = await getBooks();
      console.log('List of Books:', books);
    } catch (error) {
      console.error('Error fetching books:', error);
    }
  })();
  

  
  //Write your code here
  return res.status(300).json({message: "Yet to be implemented"});
});

// Get book details based on ISBN
public_users.get('/isbn/:isbn',async function (req, res) {
  try {
    const isbn = req.params.isbn;
    const response = await axios.get(`your_api_endpoint/books/${isbn}`);
    
    // Assuming the response.data contains the book details
    const bookDetails = response.data;
    
    res.json(bookDetails);
  } catch (error) {
    console.error('Error fetching book details:', error);
    res.status(500).json({ message: 'Internal Server Error' });
  }
 });
  
// Get book details based on author
public_users.get('/author/:author',async function (req, res) {
  try {
    const author = req.params.author;
    const response = await axios.get(`your_api_endpoint/books?author=${author}`);
    
    // Assuming the response.data contains an array of books for the given author
    const booksByAuthor = response.data;

    if (booksByAuthor.length > 0) {
      res.json({ message: 'Books found', books: booksByAuthor });
    } else {
      res.status(404).json({ message: 'No books found for author: ' + author });
    }
  } catch (error) {
    console.error('Error fetching books by author:', error);
    res.status(500).json({ message: 'Internal Server Error' });
  }
});

// Get all books based on title
public_users.get('/title/:title',async function (req, res) {
  try {
    const title = req.params.title;
    const response = await axios.get(`your_api_endpoint/books?title=${title}`);
    
    // Assuming the response.data contains an array of books for the given title
    const booksByTitle = response.data;

    if (booksByTitle.length > 0) {
      res.json({ message: 'Books found', books: booksByTitle });
    } else {
      res.status(404).json({ message: 'No books found for title: ' + title });
    }
  } catch (error) {
    console.error('Error fetching books by title:', error);
    res.status(500).json({ message: 'Internal Server Error' });
  }
  //Write your code here

});

//  Get book review
public_users.get('/review/:isbn',function (req, res) {
  isbn=req.params.isbn;
  res.send(books[isbn].reviews);
});

module.exports.general = public_users;
