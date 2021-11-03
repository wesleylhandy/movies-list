import { isPresent } from "@perfective/common";
import { TmdbMovie } from "../utils/movie";
import { LazyImage } from "./LazyImage";

export function MovieDetails(
  props: { movie: TmdbMovie }
): JSX.Element {
  const { movie } = props;
  return (
    <div className="my-5">
      <LazyImage
        src={movie.backdrop_path ?? ""}
        className="flex w-full"
        alt={movie.title}
      />
      <div className="my-5 -mx-5 w-full flex flex-row justify-start items-start flex-wrap md:flex-nowrap text-gray-900">
        <div className="mx-5 min-w-max">
          <div className="text-left text-lg font-sans">{movie.title}</div>
          {isPresent(movie.tagline) && (
            <div className="text-left text-lg font-sans mt-1">
              {movie.tagline}
            </div>
          )}
          {isPresent(movie.genres) && (
            <div className="text-left text-base font-body my-3">
              {movie.genres.map((genre) => genre.name).join(", ")}
            </div>
          )}
          {isPresent(movie.release_date) && (
            <div className="text-left text-base font-body my-3">
              {movie.release_date.slice(0, 4)}
            </div>
          )}
        </div>
        <div className="mx-5">
          {isPresent(movie.overview) && (
            <div className="text-left text-base font-body mb-3">
              {movie.overview}
            </div>
          )}
          {isPresent(movie.homepage) && (
            <div className="text-left text-base font-body mb-3">
              <a
                href={movie.homepage}
                target="_blank"
                rel="noreferrer noopener"
              >
                {movie.homepage}
              </a>
            </div>
          )}
          {isPresent(movie.runtime) && (
            <div className="text-left text-base font-body mb-3">
              Runtime: {movie.runtime} minutes.
            </div>
          )}
          {isPresent(movie.vote_average) && (
            <div className="text-left text-base font-body mb-3">
              Average Rating: {movie.vote_average}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
