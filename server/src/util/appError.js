"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ForbiddenError = exports.UnauthorizedError = exports.RouteError = exports.HelperError = exports.DbError = exports.MissingEnvError = exports.BadRequestError = exports.NotFoundError = exports.AppError = void 0;
class AppError extends Error {
    constructor(message, statusCode) {
        super(message);
        this.statusCode = statusCode;
    }
}
exports.AppError = AppError;
class NotFoundError extends AppError {
    constructor(message) {
        super(message, 404);
    }
}
exports.NotFoundError = NotFoundError;
class BadRequestError extends AppError {
    constructor(message) {
        super(message, 400);
    }
}
exports.BadRequestError = BadRequestError;
class MissingEnvError extends AppError {
    constructor() {
        super('Missing environment variable.', 500);
    }
}
exports.MissingEnvError = MissingEnvError;
class DbError extends AppError {
    constructor(message) {
        super(message, 500);
    }
}
exports.DbError = DbError;
class HelperError extends AppError {
    constructor(message) {
        super(message, 500);
    }
}
exports.HelperError = HelperError;
class RouteError extends AppError {
    constructor(message) {
        super(message, 500);
    }
}
exports.RouteError = RouteError;
class UnauthorizedError extends AppError {
    constructor(message) {
        super(message, 401);
    }
}
exports.UnauthorizedError = UnauthorizedError;
class ForbiddenError extends AppError {
    constructor(message) {
        super(message, 403);
    }
}
exports.ForbiddenError = ForbiddenError;
