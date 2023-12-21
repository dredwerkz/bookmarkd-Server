import { promises as fs, write } from "node:fs";
import path from "node:path";
import defaultBookshelves from "../resetdb/bookshelves.js"

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

export async function getBookData(user_id, book_id) {
    const bookData = await getAllBookData();

    const userMatches = bookData.filter((data) => data["user_id"] === user_id);

    const bookMatch = userMatches.find(
        (data) => String(data["book_id"]) === String(book_id)
    );
    console.log(`Fetching book data for user:`)
    console.log(bookMatch)
    return bookMatch;
}

/** //////////////////////////////////////////////////////////////////////////////////////////////
/** Get search results
/** ////////////////////////////////////////////////////////////////////////////////////////////// */

export async function getSearchResults(searchQuery) {
    const bookData = await getAllBooks();

    const searchResultsTitle = bookData.filter((data) =>
        data["title"].toLowerCase().includes(searchQuery.toLowerCase())
    );

    const searchResultsAuthor = bookData.filter((data) =>
        data["author"].toLowerCase().includes(searchQuery.toLowerCase())
    );

    const rawSearchResults = searchResultsTitle.concat(searchResultsAuthor);

    const searchResults = rawSearchResults.filter(
        (item, index, self) =>
            self.findIndex((t) => t.book_id === item.book_id) === index
    );

    return searchResults;
}

/** //////////////////////////////////////////////////////////////////////////////////////////////
/** Write bookshelf JSON file
/** ////////////////////////////////////////////////////////////////////////////////////////////// */

export async function writeBookshelfFile(array) {
    const JSONPayload = JSON.stringify(array);
    await fs.writeFile(bookshelfDB, JSONPayload);

    console.log("Bookshelves written to file.");
}

/** //////////////////////////////////////////////////////////////////////////////////////////////
/** Add book to favourites
/** ////////////////////////////////////////////////////////////////////////////////////////////// */

export async function addToFavourites(book_id, user_id) {
    const bookshelves = await getAllBookshelves();

    bookshelves
        .filter(
            (shelf) =>
                shelf.owned_by_user === user_id && shelf.system_flag === "favs"
        )[0]
        .bookshelf_books.push(Number(book_id));

    writeBookshelfFile(bookshelves);

    return bookshelves.filter(
        (shelf) =>
            shelf.owned_by_user === user_id && shelf.system_flag === "favs"
    );
}

/** //////////////////////////////////////////////////////////////////////////////////////////////
/** Delete book from favourites
/** ////////////////////////////////////////////////////////////////////////////////////////////// */

export async function deleteFromFavourites(book_id, user_id) {
    const bookshelves = await getAllBookshelves();

    const indexOfBookToDelete = bookshelves
        .filter(
            (shelf) =>
                shelf.owned_by_user === user_id && shelf.system_flag === "favs"
        )[0]
        .bookshelf_books.indexOf(Number(book_id));

    bookshelves
        .filter(
            (shelf) =>
                shelf.owned_by_user === user_id && shelf.system_flag === "favs"
        )[0]
        .bookshelf_books.splice(indexOfBookToDelete, 1);

    writeBookshelfFile(bookshelves);

    return bookshelves.filter(
        (shelf) =>
            shelf.owned_by_user === user_id && shelf.system_flag === "favs"
    );
}

/** //////////////////////////////////////////////////////////////////////////////////////////////
/** Add book to Completed
/** ////////////////////////////////////////////////////////////////////////////////////////////// */

export async function addToCompleted(book_id, user_id) {
    const bookshelves = await getAllBookshelves();

    bookshelves
        .filter(
            (shelf) =>
                shelf.owned_by_user === user_id &&
                shelf.system_flag === "complete"
        )[0]
        .bookshelf_books.push(Number(book_id));

    writeBookshelfFile(bookshelves);

    return bookshelves.filter(
        (shelf) =>
            shelf.owned_by_user === user_id && shelf.system_flag === "complete"
    );
}

/** //////////////////////////////////////////////////////////////////////////////////////////////
/** Delete book from Completed
/** ////////////////////////////////////////////////////////////////////////////////////////////// */

export async function deleteFromCompleted(book_id, user_id) {
    const bookshelves = await getAllBookshelves();

    const indexOfBookToDelete = bookshelves
        .filter(
            (shelf) =>
                shelf.owned_by_user === user_id &&
                shelf.system_flag === "complete"
        )[0]
        .bookshelf_books.indexOf(Number(book_id));

    bookshelves
        .filter(
            (shelf) =>
                shelf.owned_by_user === user_id &&
                shelf.system_flag === "complete"
        )[0]
        .bookshelf_books.splice(indexOfBookToDelete, 1);

    writeBookshelfFile(bookshelves);

    return bookshelves.filter(
        (shelf) =>
            shelf.owned_by_user === user_id && shelf.system_flag === "complete"
    );
}

/** //////////////////////////////////////////////////////////////////////////////////////////////
/** Add book to Completed
/** ////////////////////////////////////////////////////////////////////////////////////////////// */

export async function addBookToShelf(book_id, user_id, bookshelf_id) {
    const bookshelves = await getAllBookshelves();

    bookshelves
        .filter(
            (shelf) =>
                shelf.owned_by_user === user_id &&
                shelf.bookshelf_id === bookshelf_id
        )[0]
        .bookshelf_books.push(Number(book_id));

    writeBookshelfFile(bookshelves);

    return bookshelves.filter(
        (shelf) =>
            shelf.owned_by_user === user_id &&
            shelf.bookshelf_id === bookshelf_id
    );
}

/** //////////////////////////////////////////////////////////////////////////////////////////////
/** Create new Bookshelf
/** ////////////////////////////////////////////////////////////////////////////////////////////// */

export async function createNewBookshelf(
    book_id,
    user_id,
    bookshelf_name,
    bookshelf_id
) {
    const bookshelves = await getAllBookshelves();

    const newBookshelf = {
        bookshelf_id: String(bookshelf_id),
        system_flag: null,
        bookshelf_name: String(bookshelf_name),
        bookshelf_books: [Number(book_id)],
        owned_by_user: String(user_id),
    };

    bookshelves.push(newBookshelf)

    writeBookshelfFile(bookshelves);

    return bookshelves
}

/** //////////////////////////////////////////////////////////////////////////////////////////////
/** Reset Bookshelves
/** ////////////////////////////////////////////////////////////////////////////////////////////// */

export async function resetBookshelves() {

    writeBookshelfFile(defaultBookshelves);

    const bookshelves = await getAllBookshelves();

    return bookshelves
}

/** //////////////////////////////////////////////////////////////////////////////////////////////
/** Get user's current reads'
/** ////////////////////////////////////////////////////////////////////////////////////////////// */

export async function getCurrentBooks(user_id) {
    //console.log(`getSpecific user was called in the model`)
    const listOfUsers = await getAllUsers();
    const selectedUser = await listOfUsers.find(
        (users) => String(users.user_id) === String(user_id)
    );

    if (selectedUser) {
        console.log(`selectedUser was successfully found`);
        return selectedUser.current_reading
    }
    console.log(`selectedUser was not found`);
    return null;
}