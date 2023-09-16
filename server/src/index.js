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
const dotenv_1 = __importDefault(require("dotenv"));
const db_1 = require("./db");
const appError_1 = require("./util/appError");
const user_1 = __importDefault(require("./routes/user"));
const url_1 = __importDefault(require("./routes/url"));
const cookie_parser_1 = __importDefault(require("cookie-parser"));
dotenv_1.default.config();
/**
 * Create and start express server
 */
const serveApp = () => __awaiter(void 0, void 0, void 0, function* () {
    const app = (0, express_1.default)();
    const port = process.env.PORT;
    yield (0, db_1.connectToDatabase)();
    app.use(express_1.default.json());
    app.use((0, cookie_parser_1.default)());
    app.get('/', (req, res) => {
        res.send('URL Shortener');
    });
    app.use('/api/user', user_1.default);
    app.use('/api/url', url_1.default);
    app.use((err, req, res, next) => {
        console.error(err);
        if (err instanceof appError_1.AppError) {
            return res.status(err.statusCode).send(err.message);
        }
        else {
            return res.sendStatus(500);
        }
    });
    app.listen(port, () => {
        console.log(`[server]: Server is running at http://localhost:${port}`);
    });
});
serveApp();
