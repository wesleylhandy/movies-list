export const MOVIE_TILE_WIDTH = 500;

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

export enum MovieListSort {
    NameAscending = "Name Ascending",
    NameDescending = "Name Descending",
    GenreAscending = "Genre Ascending",
    GenreDescending = "Genre Descending",
    YearAscending = "Year Ascending",
    YearDescending = "Year Descending",
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
