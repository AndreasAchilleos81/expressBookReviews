const express = require('express');
const jwt = require('jsonwebtoken');
let books = require("./booksdb.js");
const regd_users = express.Router();

let users = [];

const isValid = (username) => { //returns boolean 
  //write code to check is the username is valid
}

const authenticatedUser = (username, password) => {
  //returns boolean write code to check if username and password match the one we have in records.
  let userwithsamename = users.filter((user) => {
    return user.username === username && user.password === password;
  });

  if (userwithsamename.length > 0) {
    return true;
  }
  else {
    return false;
  }
}

//only registered users can login
regd_users.post("/login", (req, res) => {
  //Write your code here
  const username = req.body.username;
  const password = req.body.password;

  if (!username || !password) {
    return res.status(404).json({ message: 'Error logging in' });
  }

  if (authenticatedUser(username, password)) {
    let accessToken = jwt.sign({ data: password }, 'access', { expiresIn: 60 * 60 });
    req.session.authorization = {
      accessToken, username
    }
    return res.status(200).json({ message: `User: ${username} successfully logged`, accessToken });
  }
  else {
    return res.status(200).json({ message: "Invalid Login. Check username and password" });
  }
});

// Add a book review
regd_users.put("/auth/review/:isbn", (req, res) => {
  const username = req.session.authorization.username;
  const isbn = req.params.isbn;
  const review = req.body.review;
  const bookToReview = books[isbn];
  if (bookToReview) {
    bookToReview.reviews[username] = review;
    return res.status(200).json({ message: `User:${username} has successfuly posted a review for book with isbn:${isbn} ` });
  }
  return res.status(404).json({ message: `Book with isbn:${isbn} was not found` });
});

regd_users.delete("/auth/review/:isbn", (req, res) => {
  const username = req.session.authorization.username;
  const isbn = req.params.isbn;
  const book = books[isbn];
  if (book){
    if(book.reviews[username]){
     delete book.reviews[username]; 
     return res.status(200).json({ message: `Review for book with isbn:${isbn} from username:${username} was succesfuly deleted` });
    }
    return res.status(404).json({ message: `Review for username:${username} was not found` });
  }
  return res.status(404).json({ message: `Book with isbn:${isbn} was not found` });
});

module.exports.authenticated = regd_users;
module.exports.isValid = isValid;
module.exports.users = users;
module.exports.authenticatedUser = authenticatedUser;
