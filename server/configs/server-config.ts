import { config } from 'dotenv';

config();

export const NODE_ENV = process.env.NODE_ENV;
export const PORT = process.env.PORT || 3001;
export const TMDB_API_KEY = process.env.TMDB_API_KEY!;


export const appName = 'Movie MicroService';

export const tmdbBaseUrl = 'https://api.themoviedb.org/3/'

export const tmdbImagesUrl = 'https://image.tmdb.org/t/p/w500';
