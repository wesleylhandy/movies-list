"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.tmdbImagesUrl = exports.tmdbBaseUrl = exports.appName = exports.TMDB_API_KEY = exports.PORT = exports.NODE_ENV = void 0;
const dotenv_1 = require("dotenv");
dotenv_1.config();
exports.NODE_ENV = process.env.NODE_ENV;
exports.PORT = process.env.PORT || 3001;
exports.TMDB_API_KEY = process.env.TMDB_API_KEY;
exports.appName = 'Movie MicroService';
exports.tmdbBaseUrl = 'https://api.themoviedb.org/3/';
exports.tmdbImagesUrl = 'https://image.tmdb.org/t/p/w500';
//# sourceMappingURL=server-config.js.map