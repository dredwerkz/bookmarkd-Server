import * as apiRequests from "./model.js";

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
        console.log(`Get Bookshelves API route called with an invalid or missing user_id query`);
        return res.status(400).json({
            success: false,
            payload: null,
            message: "You must include a search query for this function",
        });
    }

}
