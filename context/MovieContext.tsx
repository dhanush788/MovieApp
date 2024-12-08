import React, { createContext, useState, useContext } from 'react';
import axios from 'axios';
import { Movie } from '@/Types/movieTypes';
import { MovieContextType } from '@/Types/MovieContextType';
import { MovieProviderProps } from '@/Types/MovieProviderProps';

const MovieContext = createContext<MovieContextType | undefined>(undefined);

export const useMovieContext = (): MovieContextType => {
    const context = useContext(MovieContext);
    if (!context) {
        throw new Error('useMovieContext must be used within a MovieProvider');
    }
    return context;
};

const API_KEY = 'c9f37d53';
const BASE_URL = `https://www.omdbapi.com/?apikey=${API_KEY}`;

const fetchMoviesFromApi = async (url: string) => {
    try {
        const response = await axios.get(url);
        return response.data;
    } catch (error) {
        console.error('Error fetching data:', error);
        throw error;
    }
};

export const MovieProvider: React.FC<MovieProviderProps> = ({ children }) => {
    const [movies, setMovies] = useState<Movie[] | null>(null);
    const [loading, setLoading] = useState(false);
    const [innerMovie, setInnerMovie] = useState<Movie | null>(null);

    const handleMovieData = (movieData: any, page: number) => {
        if (movieData.Response === 'True') {
            setInnerMovie(null);
            const newMovies = movieData.Search.map((movie: any) => ({
                Title: movie.Title,
                Year: movie.Year,
                Poster: movie.Poster,
                imdbID: movie.imdbID,
                Type: movie.Type,
            }));
            setMovies(page === 1 ? newMovies : [...(movies || []), ...newMovies]);
        } else {
            console.warn(movieData.Error || 'No movies found.');
        }
    };

    const fetchMoviesBySearch = async (search: string, page: number) => {
        setLoading(true);
        const url = `${BASE_URL}&s=${search}&page=${page}`;
        try {
            const movieData = await fetchMoviesFromApi(url);
            handleMovieData(movieData, page);
        } finally {
            setLoading(false);
        }
    };

    const fetchRandomMovies = async (page: number) => {
        setLoading(true);
        const randomSearchTerms = ['love', 'man', 'matrix', 'fun', 'star', 'moon', 'avengers'];
        const randomTerm = randomSearchTerms[Math.floor(Math.random() * randomSearchTerms.length)];
        const url = `${BASE_URL}&s=${randomTerm}&page=${page}`;

        try {
            const movieData = await fetchMoviesFromApi(url);
            handleMovieData(movieData, page);
        } catch (error) {
            console.warn('Retrying with a different term...');
            fetchRandomMovies(page); // Retry with another term
        } finally {
            setLoading(false);
        }
    };

    const fetchMoviesByImdbID = async (imdbID: string) => {
        setLoading(true);
        const url = `${BASE_URL}&i=${imdbID}`;
        try {
            const movieData = await fetchMoviesFromApi(url);
            if (movieData.Response === 'True') {
                setInnerMovie({ ...movieData });
            } else {
                setMovies(null);
            }
        } finally {
            setLoading(false);
        }
    };

    return (
        <MovieContext.Provider
            value={{
                movies,
                innerMovie,
                setMovies,
                fetchMoviesBySearch,
                fetchRandomMovies,
                fetchMoviesByImdbID,
                loading,
            }}>
            {children}
        </MovieContext.Provider>
    );
};
