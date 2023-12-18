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
