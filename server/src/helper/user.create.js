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
exports.createUser = void 0;
const user_db_1 = require("../models/user.db");
const appError_1 = require("../util/appError");
const uuid_1 = require("uuid");
/**
 * Create a new user
 * @param userData - User document.
 * @returns {string} Session ID of newly created user.
 */
const createUser = (userData) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const userExists = yield (0, user_db_1.checkUsernameExists)(userData.username);
        if (userExists) {
            throw new appError_1.BadRequestError('User already exists.');
        }
        const sessionId = (0, uuid_1.v4)();
        const newUser = {
            username: userData.username,
            password: userData.password,
            sessions: [
                {
                    sessionId: sessionId,
                    expiry: Date.now() + user_db_1.SESSION_DURATION,
                },
            ],
        };
        yield (0, user_db_1.insertUser)(newUser);
        return sessionId;
    }
    catch (e) {
        if (e instanceof appError_1.AppError) {
            throw e;
        }
        throw new appError_1.HelperError(e.message);
    }
});
exports.createUser = createUser;
