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
exports.authenticate = void 0;
const appError_1 = require("../util/appError");
const user_db_1 = require("../models/user.db");
/**
 * Middleware function to ensure user is authenticated.
 * Refreshes user session if user is authenticated, and throws a
 * 401 Unauthorized error otherwise.
 */
const authenticate = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const sessionId = req.cookies['sessionId'];
        const isValid = yield (0, user_db_1.checkValidSession)(sessionId);
        if (!isValid) {
            throw new appError_1.UnauthorizedError('Invalid session ID');
        }
        const user = yield (0, user_db_1.findUserBySession)(sessionId);
        yield (0, user_db_1.refreshUserSession)(sessionId);
        req.user = user;
        next();
    }
    catch (e) {
        if (e instanceof appError_1.AppError) {
            next(e);
        }
        else {
            next(new appError_1.UnauthorizedError(e.message));
        }
    }
});
exports.authenticate = authenticate;
