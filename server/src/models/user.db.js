"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.deleteUserSession = exports.addUserSession = exports.deleteExpiredUserSessions = exports.refreshUserSession = exports.findUser = exports.checkUsernameExists = exports.findUserBySession = exports.checkValidSession = exports.insertUser = exports.SESSION_DURATION = void 0;
const db_1 = require("../db");
const appError_1 = require("../util/appError");
// Duration (in ms) to keep session alive.
exports.SESSION_DURATION = 5 * 60 * 1000;
/**
 * Insert new user into DB.
 * @param userData - User document.
 */
const insertUser = (userData) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const userCollection = (0, db_1.getUserCollection)();
        const res = yield userCollection.insertOne(userData);
        if (!res.acknowledged) {
            throw new appError_1.DbError(`Could not insert user with username ${userData.username}.`);
        }
    }
    catch (e) {
        if (e instanceof appError_1.AppError) {
            throw e;
        }
        else {
            throw new appError_1.DbError(e.message);
        }
    }
});
exports.insertUser = insertUser;
/**
 * Check if session is valid.
 * @param sessionId - Session ID.
 * @returns {boolean} True if session with given session ID is valid, and false otherwise.
 */
const checkValidSession = (sessionId) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const userCollection = (0, db_1.getUserCollection)();
        const res = yield userCollection.findOne({
            'sessions.sessionId': sessionId,
            'sessions.expiry': {
                $gt: Date.now(),
            },
        });
        if (!res) {
            return false;
        }
        return true;
    }
    catch (e) {
        if (e instanceof appError_1.AppError) {
            throw e;
        }
        else {
            throw new appError_1.DbError(e.message);
        }
    }
});
exports.checkValidSession = checkValidSession;
/**
 * Find user by session ID.
 * @param sessionId - Session ID.
 * @returns {WithId<IUser>} User document of user with given session Id.
 */
const findUserBySession = (sessionId) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const userCollection = (0, db_1.getUserCollection)();
        const res = yield userCollection.findOne({
            'sessions.sessionId': sessionId,
            'sessions.expiry': {
                $gt: Date.now(),
            },
        });
        if (!res) {
            throw new appError_1.NotFoundError('User not found');
        }
        return res;
    }
    catch (e) {
        if (e instanceof appError_1.AppError) {
            throw e;
        }
        else {
            throw new appError_1.DbError(e.message);
        }
    }
});
exports.findUserBySession = findUserBySession;
/**
 * Check if a user with the given username already exists.
 * @param username - Username.
 * @returns {boolean} - True if user already exists, and false otherwise.
 */
const checkUsernameExists = (username) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const userCollection = (0, db_1.getUserCollection)();
        const user = yield userCollection.findOne({
            username: username,
        });
        if (user) {
            return true;
        }
        return false;
    }
    catch (e) {
        if (e instanceof appError_1.AppError) {
            throw e;
        }
        else {
            throw new appError_1.DbError(e.message);
        }
    }
});
exports.checkUsernameExists = checkUsernameExists;
/**
 * Find user with given username and password.
 * @param username - Username.
 * @param password - Password
 * @returns {WithId<IUser>} - User document.
 */
const findUser = (username, password) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const userCollection = (0, db_1.getUserCollection)();
        const user = yield userCollection.findOne({
            username: username,
            password: password,
        });
        if (!user) {
            throw new appError_1.NotFoundError('User not found.');
        }
        return user;
    }
    catch (e) {
        if (e instanceof appError_1.AppError) {
            throw e;
        }
        else {
            throw new appError_1.DbError(e.message);
        }
    }
});
exports.findUser = findUser;
/**
 * Update user session expiry to last for SESSION_DURATION more time.
 * @param sessionId - sessionId of session to be refreshed.
 */
const refreshUserSession = (sessionId) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const userCollection = (0, db_1.getUserCollection)();
        yield userCollection.findOneAndUpdate({
            'sessions.sessionId': sessionId,
        }, {
            $set: {
                'sessions.$.expiry': Date.now() + exports.SESSION_DURATION,
            },
        });
    }
    catch (e) {
        if (e instanceof appError_1.AppError) {
            throw e;
        }
        else {
            throw new appError_1.DbError(e.message);
        }
    }
});
exports.refreshUserSession = refreshUserSession;
/**
 * Delete all expired sessions for user with given userId.
 * @param userId Object Id of user to delete expired sessions for.
 */
const deleteExpiredUserSessions = (userId) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const userCollection = (0, db_1.getUserCollection)();
        yield userCollection.findOneAndUpdate({
            _id: userId,
        }, {
            $pull: {
                sessions: {
                    expiry: {
                        $lt: Date.now(),
                    },
                },
            },
        });
    }
    catch (e) {
        if (e instanceof appError_1.AppError) {
            throw e;
        }
        else {
            throw new appError_1.DbError(e.message);
        }
    }
});
exports.deleteExpiredUserSessions = deleteExpiredUserSessions;
/**
 * Add given session to user with given userId.
 * @param userId - Object Id of user to update.
 * @param session - session document.
 */
const addUserSession = (userId, session) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const userCollection = (0, db_1.getUserCollection)();
        yield userCollection.findOneAndUpdate({
            _id: userId,
        }, {
            $push: {
                sessions: session,
            },
        });
    }
    catch (e) {
        if (e instanceof appError_1.AppError) {
            throw e;
        }
        else {
            throw new appError_1.DbError(e.message);
        }
    }
});
exports.addUserSession = addUserSession;
/**
 * delete given session from user with given userId.
 * @param userId - Object Id of user to update.
 * @param sessionId - session ID to delete.
 */
const deleteUserSession = (userId, sessionId) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const userCollection = (0, db_1.getUserCollection)();
        yield userCollection.findOneAndUpdate({
            _id: userId,
        }, {
            $pull: {
                sessions: {
                    sessionId: sessionId,
                },
            },
        });
    }
    catch (e) {
        if (e instanceof appError_1.AppError) {
            throw e;
        }
        else {
            throw new appError_1.DbError(e.message);
        }
    }
});
exports.deleteUserSession = deleteUserSession;
