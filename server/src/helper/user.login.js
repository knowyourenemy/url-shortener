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
exports.loginUser = void 0;
const user_db_1 = require("../models/user.db");
const uuid_1 = require("uuid");
const appError_1 = require("../util/appError");
/**
 * Log-in user with given username and password.
 * @param username - username of user.
 * @param password - password of user.
 * @param existingSessionId - Existing session ID from cookies (if any).
 * @returns {string} Session ID of user session.
 */
const loginUser = (username, password, existingSessionId) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const user = yield (0, user_db_1.findUser)(username, password);
        yield (0, user_db_1.deleteExpiredUserSessions)(user._id);
        if (existingSessionId) {
            const isValid = yield (0, user_db_1.checkValidSession)(existingSessionId);
            if (isValid) {
                yield (0, user_db_1.refreshUserSession)(existingSessionId);
                return existingSessionId;
            }
        }
        const sessionId = (0, uuid_1.v4)();
        const session = {
            sessionId: sessionId,
            expiry: Date.now() + user_db_1.SESSION_DURATION,
        };
        yield (0, user_db_1.addUserSession)(user._id, session);
        return sessionId;
    }
    catch (e) {
        if (e instanceof appError_1.AppError) {
            throw e;
        }
        throw new appError_1.HelperError(e.message);
    }
});
exports.loginUser = loginUser;
