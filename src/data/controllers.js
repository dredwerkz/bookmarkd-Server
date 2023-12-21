import * as apiRequests from "./model.js";
import OpenAI from "openai";
import * as dotenv from "dotenv";

dotenv.config();
const openai = new OpenAI({
    apiKey: process.env.OPENAI_API_KEY,
});

// This file controls the api request, then repackages it for the router to send back

/** //////////////////////////////////////////////////////////////////////////////////////////////
/** Get all users
/** ////////////////////////////////////////////////////////////////////////////////////////////// */

export async function getAllUsers(req, res) {
    console.log(`getAllUsers() in controllers.js has been called`);
    const users = await apiRequests.getAllUsers();

    res.status(200).json({
        success: true,
        payload: users,
        // check this later
    });
}

/** //////////////////////////////////////////////////////////////////////////////////////////////
/** Get user by ID
/** ////////////////////////////////////////////////////////////////////////////////////////////// */

export async function getSpecificUser(req, res) {
    console.log(
        `getSpecificUser was called looking for user with id ${req.query["user_id"]}`
    );
    const desiredUserId = req.query["user_id"];
    const user = await apiRequests.getSpecificUser(desiredUserId);

    res.status(200).json({
        success: true,
        payload: user,
    });
}

/** //////////////////////////////////////////////////////////////////////////////////////////////
/** Bookshelves from array
/** ////////////////////////////////////////////////////////////////////////////////////////////// */

export async function getBookshelves(req, res) {
    /* 
    I want to take in an array of bookshelf IDs as part of the req.query, 
    convert them to a usable format for our router, 
    which will fetch the relevant bookshelves as an array of objects?
    */
    if (req.query["user_id"]) {
        console.log(`Get Bookshelves API route called with a user_id query`);

        const fetchedBookshelves = await apiRequests.getBookshelves(
            req.query["user_id"]
        );

        res.status(200).json({
            success: true,
            payload: fetchedBookshelves,
        });
    } else {
        console.log(
            `Get Bookshelves API route called with an invalid or missing user_id query`
        );
        return res.status(400).json({
            success: false,
            payload: null,
            message: "You must include a search query for this function",
        });
    }
}

/** //////////////////////////////////////////////////////////////////////////////////////////////
/** Get book by id
/** ////////////////////////////////////////////////////////////////////////////////////////////// */

export async function getBook(req, res) {
    console.log(`getBook() in controllers.js has been called`);
    const book = await apiRequests.getBook(req.query["book_id"]);

    res.status(200).json({
        success: true,
        payload: book,
        // check this later
    });
}

/** //////////////////////////////////////////////////////////////////////////////////////////////
/** Get book data or a user 
/** ////////////////////////////////////////////////////////////////////////////////////////////// */

export async function getBookData(req, res) {
    console.log(
        `getBookData() has been called with user_id ${req.query["user_id"]} and book_id ${req.query["book_id"]} `
    );
    const bookData = await apiRequests.getBookData(
        req.query["user_id"],
        req.query["book_id"]
    );

    res.status(200).json({
        success: true,
        payload: bookData,
    });
}
/** //////////////////////////////////////////////////////////////////////////////////////////////
/** Get AI data 
/** ////////////////////////////////////////////////////////////////////////////////////////////// */

export async function getAiRec(req, res) {
    const prompt = req.body.prompt;
    const searchType = req.body.searchType;

    const typeOfResponse = searchTypeFilter(searchType);

    function searchTypeFilter(searchType) {
        switch (searchType) {
            case "author":
                return "Give me a numbered list of 3 book recommandations, format use number with a fullstop, give me books with author's name and a short description, from this author : ";
            case "title":
                return "Give me a numbered list of 3 book recommandations, format use number with a fullstop, give me books with a short description similair to this title: ";
            case "genre":
                return "Give me a numbered list of 3 book recommandations, format use number with a fullstop, give me books with a short description from this author : ";
            default:
                return "Give me a numbered list of 3 book recommandations, format use number with a fullstop, give me books  with a short description from this author: ";
        }
    }

    // const prompt = "JK Rowling"
    const response = await openai.chat.completions.create({
        model: "gpt-3.5-turbo",
        messages: [
            {
                role: "user",
                // Example: `${"In a list of 3 book recommandations, give me the author: "}, ${" Jk Rowling "}
                content: `${typeOfResponse}, ${prompt}`,
            },
        ],
        // How long the response will be: 150, 200, 250, 300, 350, 400, 450, 500, 550, 600
        max_tokens: 450,
    });

    res.status(200).json({
        success: true,
        payload: response.choices[0].message,
    });
}

/** //////////////////////////////////////////////////////////////////////////////////////////////
/** Get search results
/** ////////////////////////////////////////////////////////////////////////////////////////////// */

export async function getSearchResults(req, res) {
    console.log(
        `getSearchResults() has been called with search query ${req.query["query"]}`
    );
    const searchResults = await apiRequests.getSearchResults(
        req.query["search"]
    );

    res.status(200).json({
        success: true,
        payload: searchResults,
    });
}

/** //////////////////////////////////////////////////////////////////////////////////////////////
/** Add book to favourites
/** ////////////////////////////////////////////////////////////////////////////////////////////// */

export async function addToFavourites(req, res) {
    console.log(
        `addToFavourites() has been called with book_id ${req.query["book_id"]} and user_id ${req.query["user_id"]}`
    );
    const confirmation = await apiRequests.addToFavourites(
        req.query["book_id"],
        req.query["user_id"]
    );

    res.status(200).json({
        success: true,
        payload: confirmation,
    });
}

/** //////////////////////////////////////////////////////////////////////////////////////////////
/** Delete book from favourites
/** ////////////////////////////////////////////////////////////////////////////////////////////// */

export async function deleteFromFavourites(req, res) {
    console.log(
        `deleteFromFavourites() has been called with book_id ${req.query["book_id"]} and user_id ${req.query["user_id"]}`
    );
    const confirmation = await apiRequests.deleteFromFavourites(
        req.query["book_id"],
        req.query["user_id"]
    );

    res.status(200).json({
        success: true,
        payload: confirmation,
    });
}

/** //////////////////////////////////////////////////////////////////////////////////////////////
/** Add book to Completed
/** ////////////////////////////////////////////////////////////////////////////////////////////// */

export async function addToCompleted(req, res) {
    console.log(
        `addToCompleted() has been called with book_id ${req.query["book_id"]} and user_id ${req.query["user_id"]}`
    );
    const confirmation = await apiRequests.addToCompleted(
        req.query["book_id"],
        req.query["user_id"]
    );

    res.status(200).json({
        success: true,
        payload: confirmation,
    });
}

/** //////////////////////////////////////////////////////////////////////////////////////////////
/** Delete book from Completed
/** ////////////////////////////////////////////////////////////////////////////////////////////// */

export async function deleteFromCompleted(req, res) {
    console.log(
        `deleteFromCompleted() has been called with book_id ${req.query["book_id"]} and user_id ${req.query["user_id"]}`
    );
    const confirmation = await apiRequests.deleteFromCompleted(
        req.query["book_id"],
        req.query["user_id"]
    );

    res.status(200).json({
        success: true,
        payload: confirmation,
    });
}

/** //////////////////////////////////////////////////////////////////////////////////////////////
/** Add book to Custom Shelf
/** ////////////////////////////////////////////////////////////////////////////////////////////// */

export async function addBookToShelf(req, res) {
    console.log(
        `addBookToShelf() has been called with book_id ${req.query["book_id"]}, user_id ${req.query["user_id"]} and bookshelf_id ${req.query["bookshelf_id"]}`
    );
    const confirmation = await apiRequests.addBookToShelf(
        req.query["book_id"],
        req.query["user_id"],
        req.query["bookshelf_id"]
    );

    res.status(200).json({
        success: true,
        payload: confirmation,
    });
}

/** //////////////////////////////////////////////////////////////////////////////////////////////
/** Create new Bookshelf
/** ////////////////////////////////////////////////////////////////////////////////////////////// */

export async function createNewBookshelf(req, res) {
    console.log(
        `createNewBookshelf() has been called with book_id ${req.query["book_id"]}, user_id ${req.query["user_id"]}, bookshelf_id ${req.query["bookshelf_id"]} and bookshelf_name ${req.query["bookshelf_name"]}`
    );
    const confirmation = await apiRequests.createNewBookshelf(
        req.query["book_id"],
        req.query["user_id"],
        req.query["bookshelf_name"],
        req.query["bookshelf_id"]
    );

    res.status(200).json({
        success: true,
        payload: confirmation,
    });
}

/** //////////////////////////////////////////////////////////////////////////////////////////////
/** Reset Bookshelves
/** ////////////////////////////////////////////////////////////////////////////////////////////// */

export async function resetBookshelves(req, res) {
    console.log(
        `resetBookshelves() has been called`
    );
    const confirmation = await apiRequests.resetBookshelves();

    res.status(200).json({
        success: true,
        payload: confirmation,
    });
}

/** //////////////////////////////////////////////////////////////////////////////////////////////
/** Get user's current reads'
/** ////////////////////////////////////////////////////////////////////////////////////////////// */

export async function getCurrentBooks(req, res) {
    console.log(
        `getCurrentBooks was called looking for user with id ${req.query["user_id"]}`
    );

    const currentBooks = await apiRequests.getCurrentBooks(req.query["user_id"]);

    res.status(200).json({
        success: true,
        payload: currentBooks,
    });
}