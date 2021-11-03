import { isPresent } from "@perfective/common";
import { InfiniteData } from 'react-query'

export const MOVIE_TILE_WIDTH = 360;

export type DateString = string;
export type Int32 = number;

export interface TmdbMovieGenre {
    id?: Int32;
    name?: string;
}

export interface TmdbMovieProductionCompanies {
    name?: string;
    id?: Int32;
    logo_path?: string | null;
    origin_country?: string;
}

export interface TmdbMovieProductionCountries {
    iso_3166_1?: string;
    name?: string;
}

export interface TmdbMovieSpokenLanguages {
    iso_639_1?: string;
    name?: string;
}

export type TmdbMovieStatus = 'Rumored' | 'Planned' | 'In Production' | 'Post Production' | 'Released' | 'Canceled';


export interface TmdbMovie {
    adult?: boolean;
    backdrop_path?: string | null;
    belongs_to_collection?: Record<string, unknown> | null;
    budget?: Int32;
    genres?: TmdbMovieGenre[];
    genre_ids?: Int32[];
    homepage?: string | null;
    id?: Int32;
    imdb_id?: string | null;
    original_language?: string;
    original_title?: string;
    overview?: string | null;
    popularity?: number;
    poster_path?: string | null;
    production_companies?: TmdbMovieProductionCompanies[];
    production_countries?: TmdbMovieProductionCountries[];
    release_date?: DateString;
    revenue?: Int32;
    runtime?: Int32 | null;
    spoken_languages?: TmdbMovieSpokenLanguages[];
    status?: TmdbMovieStatus;
    tagline?: string | null;
    title: string;
    video?: boolean;
    vote_average?: number;
    vote_count?: Int32Array;
}

export interface TmdbGetMovieListResponseDates {
    minimum: DateString;
    maximum: DateString;
}

export interface TmdbMoviesPageResult {
    dates: TmdbGetMovieListResponseDates;
    page: Int32;
    results: TmdbMovie[];
    total_pages: Int32;
    total_results: Int32;
}

export function emptyTmdbMoviesPageResult(): TmdbMoviesPageResult {
    return {
        dates: {
            minimum: '',
            maximum: '',
        },
        page: 0,
        results: [],
        total_pages: 0,
        total_results: 0,
    }
}

export function defaultTmdbMoviesPageResult(result: Partial<TmdbMoviesPageResult> = {}): TmdbMoviesPageResult {
    return {
        ...emptyTmdbMoviesPageResult(),
        ...result,
    }
}

export function resultsFromFetch(nowPlaying: InfiniteData<TmdbMoviesPageResult> | undefined, genres: {
    genres: TmdbMovieGenre[];
} | undefined): TmdbMovie[] {
    return nowPlaying?.pages.reduce((results, page) => ({...results, ...page})).results.map((movie: TmdbMovie) => {
      let movieGenres: TmdbMovieGenre[] = [];
      if (isPresent(movie.genre_ids)) {
        movieGenres = movie.genre_ids
          .map((id) => {
            return genres?.genres?.find((genre: TmdbMovieGenre) => id === genre.id);
          })
          .filter(isPresent);
      }
      return { ...movie, genres: movieGenres };
    }) ?? [];
}
  
export function uniqueResults(results: TmdbMovie[]): TmdbMovie[] {
    return results.reduce<TmdbMovie[]>((uniqueResults, result) => {
        if (uniqueResults.find(el => el.id === result.id)) {
            return uniqueResults;
        }
        return [...uniqueResults, result];
    }, [])
}
