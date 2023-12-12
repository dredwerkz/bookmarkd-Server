import { promises as fs, write } from "node:fs";
import path from "node:path";

const userDataDB = path.resolve(process.cwd(), "./src/db/users.json");
const bookshelfDB = path.resolve(process.cwd(), "./src/db/bookshelves.json");

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
