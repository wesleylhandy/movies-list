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
exports.apiRouter = void 0;
const express_1 = require("express");
const isomorphic_fetch_1 = __importDefault(require("isomorphic-fetch"));
const server_config_1 = require("../configs/server-config");
const logger_1 = require("../utils/logger");
const url_1 = require("../utils/url");
// tslint:disable-next-line variable-name
exports.apiRouter = express_1.Router();
exports.apiRouter.get('/movie/genres', (request, response) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const requestQuery = {
            api_key: server_config_1.TMDB_API_KEY,
            language: 'en-US'
        };
        const genres = yield isomorphic_fetch_1.default(url_1.completeUrl(server_config_1.tmdbBaseUrl, `genre/movie/list`, requestQuery))
            .then(res => res.json());
        return response.json(genres);
    }
    catch (error) {
        logger_1.logger.log('error', error);
        return response.status(500).json({ error });
    }
}));
exports.apiRouter.get('/movie/:movieId', (request, response) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const movieId = request.params.movieId;
        const requestQuery = {
            api_key: server_config_1.TMDB_API_KEY,
            language: 'en-US'
        };
        const tmdbResponse = yield isomorphic_fetch_1.default(url_1.completeUrl(server_config_1.tmdbBaseUrl, `movie/${movieId}`, requestQuery))
            .then(res => res.json());
        const movie = Object.assign({}, tmdbResponse);
        if (typeof tmdbResponse.backdrop_path !== 'undefined') {
            movie.backdrop_path = `${server_config_1.tmdbImagesUrl}${movie.backdrop_path}`;
        }
        if (typeof tmdbResponse.poster_path !== 'undefined') {
            movie.poster_path = `${server_config_1.tmdbImagesUrl}${movie.poster_path}`;
        }
        if (typeof tmdbResponse.production_companies !== 'undefined') {
            movie.production_companies = tmdbResponse.production_companies.map(company => {
                const productionCompany = Object.assign({}, company);
                if (typeof productionCompany.logo_path !== 'undefined') {
                    productionCompany.logo_path = `${server_config_1.tmdbImagesUrl}${productionCompany.logo_path}`;
                }
                return productionCompany;
            });
        }
        return response.json({ movie });
    }
    catch (error) {
        logger_1.logger.log('error', error);
        return response.status(500).json({ error });
    }
}));
exports.apiRouter.get('/movies/now_playing', (request, response) => __awaiter(void 0, void 0, void 0, function* () {
    var _a;
    try {
        const query = request.query;
        const page = (_a = query.page) !== null && _a !== void 0 ? _a : 1;
        const requestQuery = {
            api_key: server_config_1.TMDB_API_KEY,
            include_adult: 'false',
            language: 'en-US',
            page: page.toString()
        };
        const tmdbResponse = yield isomorphic_fetch_1.default(url_1.completeUrl(server_config_1.tmdbBaseUrl, 'movie/now_playing', requestQuery))
            .then(res => res.json());
        const results = tmdbResponse.results.map(result => {
            const movie = Object.assign({}, result);
            if (typeof result.backdrop_path !== 'undefined') {
                movie.backdrop_path = `${server_config_1.tmdbImagesUrl}${movie.backdrop_path}`;
            }
            if (typeof result.poster_path !== 'undefined') {
                movie.poster_path = `${server_config_1.tmdbImagesUrl}${movie.poster_path}`;
            }
            return movie;
        });
        return response.json(Object.assign(Object.assign({}, tmdbResponse), { results }));
    }
    catch (error) {
        logger_1.logger.log('error', error);
        return response.status(500).json({ error });
    }
}));
//# sourceMappingURL=api.js.map