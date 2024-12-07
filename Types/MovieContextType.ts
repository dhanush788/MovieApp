import { Movie } from '@/utils/movieTypes';

export interface MovieContextType {
    movies: Movie[] | null;
    innerMovie: Movie | null;
    setMovies: React.Dispatch<React.SetStateAction<Movie[] | null>>;
    fetchMoviesBySearch: (search: string, page: number) => Promise<void>;
    fetchRandomMovies: (page: number) => Promise<void>;
    fetchMoviesByImdbID: (imdbID: string) => Promise<void>;
    loading: boolean;
}