import React, { useEffect, useState } from "react";
import { useModal } from "../hooks/useModal";
import { TmdbMovie } from "../utils/movie";
import { LazyImage } from "./LazyImage";
import { isPresent } from "../utils/value";
import { classNames } from "../utils/class-names";
import { MovieDetails } from "./MovieDetails";

export interface MovieProps {
    movie: TmdbMovie;
    index: number;
    isActive: boolean;
    onMouseEnter: (index: number) => void;
}

export function MovieSlide(props: MovieProps): JSX.Element {
    const { movie, index, isActive, onMouseEnter } = props;
    const [movieDetails, setMovieDetails] = useState<TmdbMovie>(movie);
    const [isLoading, setIsLoading] = useState<boolean>(false);
    const { setModalContent, setTitle, setIsModalClosed } = useModal();
    useEffect(() => {
        if (isPresent(movieDetails.id)) {
            setIsLoading(true);
            fetch(`/api/movie/${movieDetails.id?.toString()}`)
                .then(res => res.json())
                .then(json => setMovieDetails(prevMovieDetails => ({ ...prevMovieDetails, ...json.movie })))
                .catch(console.error)
                .finally(() => setIsLoading(false))
        }
    }, [movieDetails.id]);

    function handleClick(event: React.MouseEvent<HTMLImageElement>): void {
        event.preventDefault();
        if (isLoading) {
            return;
        }
        setTitle(movieDetails.title as string);
        setModalContent(<MovieDetails movie={movieDetails} isActive={isActive} />);
        setIsModalClosed(false);
    }

    function handleMouseEnter() {
        if (!isActive) {
            onMouseEnter(index);
        }
    }

    return (
        <div className={classNames("w-full max-w-xs hover:max-w-sm flex flex-col justify-center mx-5 flex-shrink-0", { 'max-w-sm': isActive })}>
            <LazyImage 
                className={classNames("flex w-full cursor-pointer hover:shadow-2xl", { 'cursor-not-allowed': isLoading, 'shadow-2xl': isActive })}
                src={movieDetails.poster_path as string}
                alt={movieDetails.title}
                onClick={handleClick}
                onMouseEnter={handleMouseEnter}
                tabIndex={isLoading ? -1 : 0}
            />
            <div className="text-center text-lg font-sans text-gray-50 my-5">{movieDetails.title}</div>
            {isPresent(movieDetails.genres) && (
                <div className="text-center text-base font-body text-gray-200 my-3">{movieDetails.genres.map(genre => genre.name).join(', ')}</div>
            )}
            {isPresent(movieDetails.release_date) && (
                <div className="text-center text-base font-body text-gray-200 my-3">{movieDetails.release_date.slice(0,4)}</div>
            )}
        </div> 
    )
}