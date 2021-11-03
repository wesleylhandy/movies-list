import * as React from "react";
import { useModal } from "../hooks/useModal";
import { TmdbMovie } from "../utils/movie";
import { LazyImage } from "./LazyImage";
import { isAbsent, isPresent } from "@perfective/common"
import { classNames } from "../utils/class-names";
import { MovieDetails } from "./MovieDetails";
import { useQueryClient } from 'react-query';

export interface MovieProps {
    movieId: TmdbMovie["id"];
    index: number;
    isActive: boolean;
    isFetching: boolean;
    onMouseEnter: (index: number) => void;
}

export function MovieSlide(props: MovieProps): JSX.Element | null {
    const { movieId, index, isActive, onMouseEnter, isFetching } = props;
    const { modalDispatch } = useModal();
    const queryClient = useQueryClient();
    const queryData= queryClient.getQueryData<{ movie: TmdbMovie; }>(['movie', movieId]);

    if (isAbsent(queryData) || isAbsent(queryData.movie)) {
        return null;
    }

    const { movie } = queryData;

    function handleClick(_event: React.MouseEvent<HTMLImageElement>): void {
        if (isPresent(movie)) {
            modalDispatch({
                title: movie?.title,
                modalContent: <MovieDetails movie={movie} />,
                isModalClosed: false,
            })
        }
    }

    function handleMouseEnter() {
        if (!isActive) {
            onMouseEnter(index);
        }
    }

    return (
        <div className={classNames("w-full max-w-xs hover:max-w-sm flex flex-col justify-center mx-5 flex-shrink-0", { 'max-w-sm': isActive })}>
            <LazyImage 
                className={classNames("flex w-full cursor-pointer hover:shadow-2xl", { 'cursor-not-allowed': isFetching, 'shadow-2xl': isActive })}
                src={movie.poster_path as string}
                alt={movie.title}
                onClick={handleClick}
                onMouseEnter={handleMouseEnter}
                tabIndex={isFetching ? -1 : 0}
            />
            <div className="text-center text-lg font-sans text-gray-50 my-5">{movie.title}</div>
            {isPresent(movie.genres) && (
                <div className="text-center text-base font-body text-gray-200 my-3">{movie.genres.map(genre => genre.name).join(', ')}</div>
            )}
            {isPresent(movie.release_date) && (
                <div className="text-center text-base font-body text-gray-200 my-3">{movie.release_date.slice(0,4)}</div>
            )}
        </div> 
    );
}

