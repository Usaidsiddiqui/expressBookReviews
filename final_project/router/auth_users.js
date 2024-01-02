const express = require('express');
const jwt = require('jsonwebtoken');
let books = require("./booksdb.js");
const regd_users = express.Router();


let usersdb = [{"username":"ali","password":"123"}]


const isValid = (username)=>{ //returns boolean
//write code to check is the username is valid
}
const fs = require('fs');
const filePath = "router/booksdb.js";
const authenticatedUser = (username,password)=>{
  let validusers = usersdb.filter((user)=>{
    return (user.username === username && user.password === password)
  });
  if(validusers.length > 0){
    return true;
  } else {
    return false;
  }
}
regd_users.post("/login", (req,res) => {
  const username = req.body.username;
  const password = req.body.password;

  if (!username || !password) {
      return res.status(404).json({message: "Error logging in"});
  }

  if (authenticatedUser(username,password)) {
    let accessToken = jwt.sign({
      data: password
    }, 'access', { expiresIn: 60 * 60 });

    req.session.authorization = {
      accessToken,username
  }
  return res.status(200).send("User successfully logged in");
  } else {
    return res.status(208).json({message: "Invalid Login. Check username and password"});
  }
});



//only registered users can login

// Add a book review
regd_users.put("/auth/review/:isbn", (req, res) => {
  const isbn = req.params.isbn;
  const username = req.session.authorization.username; // Assuming you store the username in the session
  const review = req.query.review;
  console.log(req.session.authorization)
  if (!username) {
    return res.status(401).json({ message: 'Unauthorized. Please log in.' });
  }

  if (!review) {
    return res.status(400).json({ message: 'Review cannot be empty.' });
  }

  // Check if the book with the given ISBN exists
  if (!books[isbn]) {
    return res.status(404).json({ message: 'Book not found for ISBN: ' + isbn });
  }

  // Check if the user has already posted a review for this ISBN
  if (books[isbn].reviews[username]) {
    // If the user has already posted a review, modify the existing one
    books[isbn].reviews[username] = review;
    console.log(books)
    return res.json({ message: 'Review modified successfully.' });
  } else {
    // If the user hasn't posted a review, add a new one
    books[isbn].reviews[username] = review;
    updatedData = JSON.stringify(books, null, 2);
    fs.writeFile(filePath, updatedData, { encoding: 'utf8' }, (writeErr) => {
      if (writeErr) {
        console.error('Error writing to the file:', writeErr);
      }});
    
    
    console.log(books)
    return res.json({ message: 'Review added successfully.' });
  }
});
regd_users.delete("/auth/review/:isbn", (req, res) => {
  console.log("usaid  here")
  const isbn = req.params.isbn;
  const username = req.session.authorization.username; // Assuming you store the username in the session

  if(books[isbn].reviews[username]) {
    // If the user has already posted a review,  the existing one
    return res.json({ message: 'Review deleted successfully.' })
  }});
  

module.exports.authenticated = regd_users;
module.exports.isValid = isValid;
module.exports.users = usersdb;
