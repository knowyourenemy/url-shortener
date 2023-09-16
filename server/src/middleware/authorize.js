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
exports.authorize = void 0;
const appError_1 = require("../util/appError");
const url_db_1 = require("../models/url.db");
/**
 * Middleware function to ensure that the URL being accessed belongs to the user.
 * Throws a 403 Forbidden error otherwise.
 */
const authorize = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    var _a;
    try {
        const shortenedUrl = req.params.shortenedUrl;
        const url = yield (0, url_db_1.getUrl)(shortenedUrl);
        if (!url.userId.equals((_a = req.user) === null || _a === void 0 ? void 0 : _a._id)) {
            throw new appError_1.ForbiddenError('User does not have access to this resource.');
        }
        next();
    }
    catch (e) {
        if (e instanceof appError_1.AppError) {
            next(e);
        }
        else {
            next(new appError_1.ForbiddenError(e.message));
        }
    }
});
exports.authorize = authorize;
