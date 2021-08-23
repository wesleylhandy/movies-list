import { Router } from "express";
import fetch from 'isomorphic-fetch';

import { TMDB_API_KEY, tmdbBaseUrl, tmdbImagesUrl } from "../configs/server-config";
import { TmdbMovieListGenreResponse } from "../services/tmdb/get-movie-genre-response";
import { TmdbGetMovieListResponse } from "../services/tmdb/get-movie-list-response";
import { TmdbGetMovieRequestQuery } from "../services/tmdb/get-movie-request";
import { TmdbGetMovieDetailsResponse } from "../services/tmdb/get-movie-response";
import { Int32 } from "../types";
import { logger } from "../utils/logger";
import { completeUrl } from "../utils/url";

// tslint:disable-next-line variable-name
export const apiRouter = Router();

export interface GetNowPlayingSearchQuery {
    page?: Int32;
}

export interface GetMovieDetailsUrlParam {
    movieId: string;
}

apiRouter.get('/movie/genres', async (request, response) => {
    try {
        const requestQuery: TmdbGetMovieRequestQuery = {
            api_key: TMDB_API_KEY,
            language: 'en-US'
        };

        const genres = await fetch(completeUrl(tmdbBaseUrl, `genre/movie/list`, requestQuery))
            .then<TmdbMovieListGenreResponse>(res => res.json());

        return response.json(genres)

    } catch (error: unknown) {
        logger.log('error', error);
        return response.status(500).json({ error })
    }
});

apiRouter.get('/movie/:movieId', async (request, response) => {
    try {
        const movieId = request.params.movieId;
        const requestQuery: TmdbGetMovieRequestQuery = {
            api_key: TMDB_API_KEY,
            language: 'en-US'
        };

        const tmdbResponse = await fetch(completeUrl(tmdbBaseUrl, `movie/${movieId}`, requestQuery))
            .then<TmdbGetMovieDetailsResponse>(res => res.json());

        const movie = { ...tmdbResponse };
        if (typeof tmdbResponse.backdrop_path !== 'undefined') {
            movie.backdrop_path = `${tmdbImagesUrl}${movie.backdrop_path}`;
        }
        if (typeof tmdbResponse.poster_path !== 'undefined') {
            movie.poster_path = `${tmdbImagesUrl}${movie.poster_path}`;
        }
        if (typeof tmdbResponse.production_companies !== 'undefined') {
            movie.production_companies = tmdbResponse.production_companies.map(company => {
                const productionCompany = { ...company };
                if (typeof productionCompany.logo_path !== 'undefined') {
                    productionCompany.logo_path = `${tmdbImagesUrl}${productionCompany.logo_path}`
                }
                return productionCompany;
            });
        }
        return response.json({ movie });
    } catch (error: unknown) {
        logger.log('error', error);
        return response.status(500).json({ error })
    }
});

apiRouter.get('/movies/now_playing', async (request, response) => {
    try {
        const query = request.query as unknown as GetNowPlayingSearchQuery;

        const page = query.page ?? 1;

        const requestQuery: TmdbGetMovieRequestQuery = {
            api_key: TMDB_API_KEY,
            include_adult: 'false',
            language: 'en-US',
            page: page.toString()
        };

        const tmdbResponse = await fetch(completeUrl(tmdbBaseUrl, 'movie/now_playing', requestQuery))
            .then<TmdbGetMovieListResponse>(res => res.json());

        const results = tmdbResponse.results.map(result => {
            const movie = { ...result };
            if (typeof result.backdrop_path !== 'undefined') {
                movie.backdrop_path = `${tmdbImagesUrl}${movie.backdrop_path}`;
            }
            if (typeof result.poster_path !== 'undefined') {
                movie.poster_path = `${tmdbImagesUrl}${movie.poster_path}`;
            }
            return movie;
        });

        return response.json({ ...tmdbResponse, results });
    } catch (error: unknown) {
        logger.log('error', error);
        return response.status(500).json({ error })
    }
});

