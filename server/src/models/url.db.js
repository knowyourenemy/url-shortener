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
exports.deleteUrl = exports.getAllUserUrls = exports.getUrl = exports.checkOriginalUrlExists = exports.insertUrl = void 0;
const db_1 = require("../db");
const appError_1 = require("../util/appError");
/**
 * Insert new url into DB
 * @param urlData - Url document.
 */
const insertUrl = (urlData) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const urlCollection = (0, db_1.getUrlCollection)();
        const res = yield urlCollection.insertOne(urlData);
        if (!res.acknowledged) {
            throw new appError_1.DbError(`Could not insert url ${urlData.originalUrl} for user ${urlData.userId}.`);
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
exports.insertUrl = insertUrl;
/**
 * Check if URL with given originalUrl and userId already exists.
 * @param originalUrl - URL to check.
 * @param userId - Object ID of user.
 */
const checkOriginalUrlExists = (originalUrl, userId) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const urlCollection = (0, db_1.getUrlCollection)();
        const res = yield urlCollection.findOne({
            userId: userId,
            originalUrl: originalUrl,
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
exports.checkOriginalUrlExists = checkOriginalUrlExists;
/**
 * Get URL for given shortened URL.
 * @param shortenedUrl - shortened URL.
 * @returns {WithId<IUrl>} URL document.
 */
const getUrl = (shortenedUrl) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const urlCollection = (0, db_1.getUrlCollection)();
        const res = yield urlCollection.findOne({
            shortenedUrl: shortenedUrl,
        });
        if (!res) {
            throw new appError_1.NotFoundError('URL not found.');
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
exports.getUrl = getUrl;
/**
 * Get all URLs for given user.
 * @param userId - Object Id of user.
 * @returns {WithId<IUrl>[]} Url documents of given user.
 */
const getAllUserUrls = (userId) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const urlCollection = (0, db_1.getUrlCollection)();
        const res = yield urlCollection.find({ userId: userId }).toArray();
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
exports.getAllUserUrls = getAllUserUrls;
/**
 * Delete URL with given Id.
 * @param shortenedUrl - Shortened URL of URL to delete.
 */
const deleteUrl = (shortenedUrl) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const urlCollection = (0, db_1.getUrlCollection)();
        const res = yield urlCollection.deleteOne({
            shortenedUrl: shortenedUrl,
        });
        if (!res.acknowledged) {
            throw new appError_1.DbError(`Could not delete url with shorened URL ${shortenedUrl}.`);
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
exports.deleteUrl = deleteUrl;
