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
const user_create_1 = require("../helper/user.create");
const user_login_1 = require("../helper/user.login");
const user_db_1 = require("../models/user.db");
const router = express_1.default.Router();
/**
 * Route to log-in existing user.
 */
router.post('/login', (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        if (!req.body.username || !req.body.password) {
            throw new appError_1.BadRequestError('Incomplete information to process request.');
        }
        const sessionId = yield (0, user_login_1.loginUser)(req.body.username, req.body.password, req.cookies['sessionId']);
        return res
            .cookie('sessionId', sessionId, {
            secure: true,
            httpOnly: true,
        })
            .sendStatus(200);
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
/**
 * Route to log-out existing user.
 */
router.post('/logout', authenticate_1.authenticate, (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        if (!req.cookies['sessionId']) {
            throw new appError_1.BadRequestError('Incomplete information to process request.');
        }
        yield (0, user_db_1.deleteUserSession)(req.user._id, req.cookies['sessionId']);
        return res.clearCookie('sessionId').sendStatus(200);
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
/**
 * Route to create new user.
 */
router.post('/', (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        if (!req.body.username || !req.body.password) {
            throw new appError_1.BadRequestError('Incomplete information to process request.');
        }
        const sessionId = yield (0, user_create_1.createUser)({
            username: req.body.username,
            password: req.body.password,
        });
        return res
            .cookie('sessionId', sessionId, {
            secure: true,
            httpOnly: true,
        })
            .sendStatus(200);
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
