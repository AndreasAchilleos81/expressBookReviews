const express = require('express');
let books = require("./booksdb.js");
const { JsonWebTokenError } = require('jsonwebtoken');
let isValid = require("./auth_users.js").isValid;
let users = require("./auth_users.js").users;
const public_users = express.Router();

public_users.post("/register", (req, res) => {
  const username = req.body.username;
  const password = req.body.password;

  if (username && password) {
    let filteredUsers = users.filter(u => { return (u.username === username && u.password === password) });
    if (filteredUsers.length > 0) {
      return res.status(200).json({ message: "user already registered" });
    }
    users.push({ username: username, password: password });
    return res.status(200).json({ message: `Registration of ${username} is complete` });
  }

  return res.status(404).json({ message: "missing username or password unable to register user" });

});

// Get the book list available in the shop
public_users.get('/', function (req, res) {
  res.setHeader('Content-Type', 'application/json');
  return res.json(books);
});

// Get book details based on ISBN
public_users.get('/isbn/:isbn', function (req, res) {
  const isbn = req.params.isbn;
  const book = books[isbn];
  if (book) {
    return res.json(book);
  }

  return res.status(404).json({ message: `book with isbn: ${isbn} not found` });
});

// Get book details based on author
public_users.get('/author/:author', function (req, res) {
  const author = req.params.author;
  let keys = Object.keys(books);
  for (let key of keys) {
    const book = books[key];
    if (book.author === author) {
      return res.json(book);
    }
  }
  return res.status(404).json({ message: `Author:${author} was not found` })
});

// Get all books based on title
public_users.get('/title/:title', function (req, res) {
  const title = req.params.title;
  let keys = Object.keys(books);
  for (let key of keys) {
    if (books[key].title === title) {
      return res.json(books[key]);
    }
  }
  return res.status(404).json({ message: `Author:${title} was not found` })
});

//  Get book review
public_users.get('/review/:isbn', function (req, res) {
  const isbn = req.params.isbn;
  const book = books[isbn];
  if (book) {
    if (Object.keys(book.reviews).length > 0) {
      return res.status(200).json(book.reviews);
    }
    else {
      return res.status(200).json({ message: `book with isbn: ${isbn} has no reviews entries yet` });
    }
  }
  return res.status(404).json({ message: `book with isbn: ${isbn} not found` });

});

module.exports.general = public_users;