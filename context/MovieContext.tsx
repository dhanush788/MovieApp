import React, { createContext, useState, useContext, ReactNode } from 'react';
import axios from 'axios';

interface Movie {
    title: string;
    year: string;
    poster: string;
    imdbID: string;
}

interface MovieContextType {
    movies: Movie[] | null;
    setMovies: React.Dispatch<React.SetStateAction<Movie[] | null>>;
    fetchMoviesBySearch: (search: string, page: number) => Promise<void>;
    fetchRandomMovies: (page: number) => Promise<void>;
    loading: boolean;
}

interface MovieProviderProps {
    children: ReactNode;
}

const MovieContext = createContext<MovieContextType | undefined>(undefined);

export const useMovieContext = (): MovieContextType => {
    const context = useContext(MovieContext);
    if (!context) {
        throw new Error('useMovieContext must be used within a MovieProvider');
    }
    return context;
};

export const MovieProvider: React.FC<MovieProviderProps> = ({ children }) => {
    const [movies, setMovies] = useState<Movie[] | null>(null);
    const [loading, setLoading] = useState(false);

    const API_KEY = 'c9f37d53';
    const BASE_URL = `http://www.omdbapi.com/?apikey=${API_KEY}`;

    const fetchMoviesBySearch = async (search: string, page: number) => {
        setLoading(true);
        try {
            const response = await axios.get(`${BASE_URL}&s=${search}&page=${page}`);
            const movieData = response.data;

            if (movieData.Response === 'True') {
                setMovies((prevMovies) => {
                    const newMovies = movieData.Search.map((movie: any) => ({
                        title: movie.Title,
                        year: movie.Year,
                        poster: movie.Poster,
                        imdbID: movie.imdbID,
                    }));
                    return page === 1 ? newMovies : [...(prevMovies || []), ...newMovies];
                });
            } else {
                setMovies(null);
            }
        } catch (error) {
            console.error('Error fetching movies:', error);
        } finally {
            setLoading(false);
        }
    };


    const fetchRandomMovies = async (page: number) => {
        setLoading(true);
        try {
            const randomSearchTerms = ['love', 'man', 'matrix', 'fun', 'star', 'moon', 'avengers'];
            const randomTerm = randomSearchTerms[Math.floor(Math.random() * randomSearchTerms.length)];

            const response = await axios.get(`${BASE_URL}&s=${randomTerm}&page=${page}`);
            const movieData = response.data;

            if (movieData.Response === 'True') {
                setMovies((prevMovies) => {
                    const newMovies = movieData.Search.map((movie: any) => ({
                        title: movie.Title,
                        year: movie.Year,
                        poster: movie.Poster,
                        imdbID: movie.imdbID,
                    }));
                    return page === 1 ? newMovies : [...(prevMovies || []), ...newMovies];
                });
            } else if (movieData.Error === "Too many results.") {
                console.warn("Too many results. Retrying with a different term...");
                await fetchRandomMovies(page);
            } else {
                console.warn(movieData.Error || "No movies found.");
                setMovies(null);
            }
        } catch (error) {
            console.error('Error fetching random movies:', error);
        } finally {
            setLoading(false);
        }
    };


    return (
        <MovieContext.Provider
            value={{
                movies,
                setMovies,
                fetchMoviesBySearch,
                fetchRandomMovies,
                loading,
            }}>
            {children}
        </MovieContext.Provider>
    );
};
