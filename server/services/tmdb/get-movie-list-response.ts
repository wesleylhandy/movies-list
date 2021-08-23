import { DateString, Int32 } from "../../types";
import { TmdbMovie } from "./movie";

export interface TmdbGetMovieListResponseDates {
    minimum: DateString;
    maximum: DateString;
}

export interface TmdbGetMovieListResponse {
    dates: TmdbGetMovieListResponseDates;
    page: Int32;
    results: TmdbMovie[];
    total_pages: Int32;
    total_results: Int32;
}