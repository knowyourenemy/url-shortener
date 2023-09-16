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
exports.getUrlCollection = exports.getUserCollection = exports.connectToDatabase = void 0;
const mongodb_1 = require("mongodb");
const appError_1 = require("./util/appError");
let dbConnection;
let userCollection;
let urlCollection;
/**
 * Establish connection to DB.
 */
const connectToDatabase = () => __awaiter(void 0, void 0, void 0, function* () {
    try {
        if (!process.env.DB_CONN_STRING ||
            !process.env.DB_NAME ||
            !process.env.USER_COLLECTION_NAME ||
            !process.env.URL_COLLECTION_NAME) {
            throw new appError_1.MissingEnvError();
        }
        const client = new mongodb_1.MongoClient(process.env.DB_CONN_STRING);
        yield client.connect();
        dbConnection = client.db(process.env.DB_NAME);
        userCollection = dbConnection.collection(process.env.USER_COLLECTION_NAME);
        urlCollection = dbConnection.collection(process.env.URL_COLLECTION_NAME);
        console.log(`Successfully connected to database: ${dbConnection.databaseName}.`);
    }
    catch (e) {
        if (e instanceof appError_1.AppError) {
            throw e;
        }
        else {
            throw new appError_1.DbError('Could not connect to DB.');
        }
    }
});
exports.connectToDatabase = connectToDatabase;
const getUserCollection = () => userCollection;
exports.getUserCollection = getUserCollection;
const getUrlCollection = () => urlCollection;
exports.getUrlCollection = getUrlCollection;
