import { promises as fs, write } from "node:fs";
import path from "node:path";

const userDataDB = path.resolve(process.cwd(), "./src/db/users.json");
const bookshelfDB = path.resolve(process.cwd(), "./src/db/bookshelves.json");
const booksDB = path.resolve(process.cwd(), "./src/db/books.json");
const bookDataDB = path.resolve(process.cwd(), "./src/db/user_book_data.json");



// This file handles making the actual sql/json requests and returns the result to be handled by controllers.js

/** //////////////////////////////////////////////////////////////////////////////////////////////
/** Get all users */
/** ////////////////////////////////////////////////////////////////////////////////////////////// */

export async function getAllUsers() {
    const userList = await fs.readFile(userDataDB, "utf8");

    if (!userList) {
        return [];
    }
    const listOfUsers = JSON.parse(userList);

    return listOfUsers;
}

/** //////////////////////////////////////////////////////////////////////////////////////////////
/** Get user by ID
/** ////////////////////////////////////////////////////////////////////////////////////////////// */

export async function getSpecificUser(user_id) {
    //console.log(`getSpecific user was called in the model`)
    const listOfUsers = await getAllUsers();
    const selectedUser = await listOfUsers.find(
        (users) => String(users.user_id) === String(user_id)
    );

    if (selectedUser) {
        console.log(`selectedUser was successfully found`);
        return selectedUser;
    }
    console.log(`selectedUser was not found`);
    return null;
}

/** //////////////////////////////////////////////////////////////////////////////////////////////
/** Get bookshelves by array
/** ////////////////////////////////////////////////////////////////////////////////////////////// */

export async function getBookshelves(user_id) {
    const bookshelves = await getAllBookshelves();

    const matches = bookshelves.filter(
        (shelf) => shelf["owned_by_user"] === user_id
    );

    return matches;
}

/** //////////////////////////////////////////////////////////////////////////////////////////////
/** Get all bookshelves for processing
/** ////////////////////////////////////////////////////////////////////////////////////////////// */

async function getAllBookshelves() {
    const bookshelves = await fs.readFile(bookshelfDB, "utf8");

    if (!bookshelves) {
        return [];
    }

    return JSON.parse(bookshelves);
}


/** //////////////////////////////////////////////////////////////////////////////////////////////
/** Get all books */
/** ////////////////////////////////////////////////////////////////////////////////////////////// */

async function getAllBooks() {
    const bookList = await fs.readFile(booksDB, "utf8");

    if (!bookList) {
        return [];
    }
    const listOfBooks = JSON.parse(bookList);

    return listOfBooks;
}


/** //////////////////////////////////////////////////////////////////////////////////////////////
/** Get book by id */
/** ////////////////////////////////////////////////////////////////////////////////////////////// */

export async function getBook(book_id) {
    const books = await getAllBooks();

    const match = books.find(
        (book) => Number(book["book_id"]) === Number(book_id)
    );

    return match;
}

/** //////////////////////////////////////////////////////////////////////////////////////////////
/** Get all user book data */
/** ////////////////////////////////////////////////////////////////////////////////////////////// */

export async function getAllBookData() {
    const bookData = await fs.readFile(bookDataDB, "utf8");

    if (!bookData) {
        return [];
    }
    const listOfBookData = JSON.parse(bookData);

    return listOfBookData;
}

/** //////////////////////////////////////////////////////////////////////////////////////////////
/** Get book by id */
/** ////////////////////////////////////////////////////////////////////////////////////////////// */

export async function getBookData(user_id ,book_id) {
    const bookData = await getAllBookData();

    const userMatches = bookData.filter((data)=> data["user_id"]=== user_id)
    
    const bookMatch = userMatches.find((data)=> String(data["book_id"])=== String(book_id))

    return bookMatch;
}
