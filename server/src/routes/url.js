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
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const authenticate_1 = require("../middleware/authenticate");
const appError_1 = require("../util/appError");
const url_create_1 = require("../helper/url.create");
const url_db_1 = require("../models/url.db");
const authorize_1 = require("../middleware/authorize");
const router = express_1.default.Router();
router
    /**
     * Get original URL from shortened URL.
     * Does not require authentication.
     */
    .get('/:shortenedUrl', (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        if (!req.params.shortenedUrl) {
            throw new appError_1.BadRequestError('Incomplete information to process request.');
        }
        const url = yield (0, url_db_1.getUrl)(req.params.shortenedUrl);
        return res.redirect(url.originalUrl);
    }
    catch (e) {
        if (e instanceof appError_1.AppError) {
            next(e);
        }
        else {
            next(new appError_1.RouteError(e.message));
        }
    }
}))
    /**
     * Delete shortened URL.
     * Requires user to be authenticated.
     */
    .delete('/:shortenedUrl', authenticate_1.authenticate, authorize_1.authorize, (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        if (!req.params.shortenedUrl) {
            throw new appError_1.BadRequestError('Incomplete information to process request.');
        }
        yield (0, url_db_1.deleteUrl)(req.params.shortenedUrl);
        return res.sendStatus(200);
    }
    catch (e) {
        if (e instanceof appError_1.AppError) {
            next(e);
        }
        else {
            next(new appError_1.RouteError(e.message));
        }
    }
}));
router
    /**
     * Create new URL.
     * Requires user to be authenticated.
     */
    .post('/', authenticate_1.authenticate, (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        if (!req.body.originalUrl) {
            throw new appError_1.BadRequestError('Incomplete information to process request.');
        }
        const shortenedUrl = yield (0, url_create_1.createUrl)(req.body.originalUrl, req.user._id);
        return res.status(200).send({ shortenedUrl: shortenedUrl });
    }
    catch (e) {
        if (e instanceof appError_1.AppError) {
            next(e);
        }
        else {
            next(new appError_1.RouteError(e.message));
        }
    }
}))
    /**
     * Get all user URLS.
     * Requires user to be authenticated.
     */
    .get('/', authenticate_1.authenticate, (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const urls = yield (0, url_db_1.getAllUserUrls)(req.user._id);
        return res.status(200).send({ urls: urls });
    }
    catch (e) {
        if (e instanceof appError_1.AppError) {
            next(e);
        }
        else {
            next(new appError_1.RouteError(e.message));
        }
    }
}));
exports.default = router;
