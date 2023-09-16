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
exports.createUrl = void 0;
const url_db_1 = require("../models/url.db");
const appError_1 = require("../util/appError");
// a-zA-Z0-9
// Excludes 'l', 'L', 'o', 'O', '0', '1' to make URL easier to read.
// This is because some of these characters (e.g. l, 1) are easily confused with each other.
const AVAILABLE_CHARS = 'abcdefghijkmnpqrstuvwxyzABCDEFGHIJKMNPQRSTUVWXYZ23456789';
const ENCODE_LENGTH = 7;
/**
 * generate random string of length ENCODE_LENGTH from characters in AVAILABLE_CHARS.
 * @returns {string} random string.
 */
const generateRandomString = () => {
    try {
        let encodedUrl = '';
        while (encodedUrl.length < ENCODE_LENGTH) {
            encodedUrl += AVAILABLE_CHARS.charAt(Math.floor(Math.random() * AVAILABLE_CHARS.length));
        }
        return encodedUrl;
    }
    catch (e) {
        if (e instanceof appError_1.AppError) {
            throw e;
        }
        throw new appError_1.HelperError(e.message);
    }
};
/**
 * Create a new URL.
 * @param originalUrl - Original URL to be shortened.
 * @param userId - Object ID of user.
 * @returns {string} shortened URL.
 */
const createUrl = (originalUrl, userId) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const urlExists = yield (0, url_db_1.checkOriginalUrlExists)(originalUrl, userId);
        if (urlExists) {
            throw new appError_1.BadRequestError('URL already exists.');
        }
        const shortenedUrl = generateRandomString();
        const urlData = {
            userId: userId,
            originalUrl: originalUrl,
            shortenedUrl: shortenedUrl,
        };
        yield (0, url_db_1.insertUrl)(urlData);
        return shortenedUrl;
    }
    catch (e) {
        if (e instanceof appError_1.AppError) {
            throw e;
        }
        throw new appError_1.HelperError(e.message);
    }
});
exports.createUrl = createUrl;
