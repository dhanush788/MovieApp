import React, { useState, useEffect, useRef } from 'react';
import { Image, StyleSheet, Text, View, ActivityIndicator, TouchableOpacity, FlatList, Animated, Easing } from 'react-native';
import { useMovieContext } from '@/context/MovieContext';
import { Link } from 'expo-router';
import { Movie } from '@/Types/movieTypes';
import { buildSearchQuery } from '@/utils/helpers';
import FilterSection from '@/components/FilterSection';

export default function HomeScreen() {
  const { movies, loading, setMovies, fetchMoviesBySearch, fetchRandomMovies, fetchMoviesByImdbID } = useMovieContext();
  const [query, setQuery] = useState('');
  const [type, setType] = useState('movie');
  const [year, setYear] = useState('');
  const [open, setOpen] = useState(false);
  const [open2, setOpen2] = useState(false);
  const [showFilters, setShowFilters] = useState(false);
  const [page, setPage] = useState(1);
  const [loadingMore, setLoadingMore] = useState(false);
  const [genre, setGenre] = useState('');
  const [filtersHeight] = useState(new Animated.Value(0));
  const [showScrollButton, setShowScrollButton] = useState(false); 
  const flatListRef = useRef<FlatList>(null);

  useEffect(() => {
    if (!movies && !query) {
      fetchRandomMovies(1);
    }
  }, []);

  useEffect(() => {
    if (loadingMore) {
      setTimeout(() => {
        setLoadingMore(false);
      }, 5000);
    }
  }, [loadingMore]);

  // This function toggles the filters section
  const toggleFilters = () => {
    Animated.timing(filtersHeight, {
      toValue: showFilters ? 0 : 320,
      duration: 300,
      easing: Easing.ease,
      useNativeDriver: false,
    }).start();
    setShowFilters(!showFilters);
  };

  // This function handles the search for movies
  const handleSearch = () => {
    if (movies && movies.length > 0) {
      setMovies(null);
    }
    setPage(1);

    const searchQuery = buildSearchQuery(query, type, year, genre);

    if (!searchQuery) {
      fetchRandomMovies(1);
    } else {
      fetchMoviesBySearch(searchQuery, 1);
    }
  };

  // This function loads more movies helping in infinite scrolling
  const handleLoadMore = () => {
    if (loadingMore) return;
    setLoadingMore(true);
    const nextPage = page + 1;
    let searchQuery = query;
    if (query) {
      searchQuery = buildSearchQuery(query, type, year, genre);
    }
    if (!searchQuery) {
      fetchRandomMovies(nextPage).finally(() => setLoadingMore(false));
    } else {
      fetchMoviesBySearch(searchQuery, nextPage).finally(() => setLoadingMore(false));
    }

    setPage(nextPage);
  };

  // Handle scroll position to show/hide the scroll-to-top button
  const handleScroll = (event: any) => {
    const contentOffsetY = event.nativeEvent.contentOffset.y;
    if (contentOffsetY > 200) {
      setShowScrollButton(true); // show button when scrolled down 200px
    } else {
      setShowScrollButton(false); // hide button when near top
    }
  };

  const renderItem = ({ item }: { item: Movie }) => (
    <Link
      key={item.imdbID}
      style={styles.imageContainer}
      href={`/movie/${item.imdbID}`}
    >
      <Image source={{ uri: item.Poster }} style={styles.moviePoster} />
      <Text style={styles.movieTitle}>{item.Title}</Text>
    </Link>
  );

  // Scroll to top when the button is clicked
  const scrollToTop = () => {
    flatListRef.current?.scrollToOffset({ offset: 0, animated: true });
  };

  return (
    <View style={styles.container}>
      {/* filter toggle button */}
      <TouchableOpacity style={styles.toggleButton} onPress={toggleFilters}>
        <Text style={styles.toggleButtonText}>{showFilters ? 'Hide Filters' : 'Apply Filters'}</Text>
      </TouchableOpacity>

      {/* filters section */}
      <Animated.View style={{ height: filtersHeight, overflow: 'hidden' }}>
        {showFilters && (
          <FilterSection
            query={query}
            setQuery={setQuery}
            type={type}
            setType={setType}
            genre={genre}
            setGenre={setGenre}
            year={year}
            setYear={setYear}
            handleSearch={handleSearch}
            open={open}
            setOpen={setOpen}
            open2={open2}
            setOpen2={setOpen2}
          />
        )}
      </Animated.View>

      {/* movie grid */}
      {movies ? (
        <FlatList
          ref={flatListRef}
          data={movies}
          renderItem={renderItem}
          keyExtractor={(item) => item.imdbID}
          numColumns={2}
          contentContainerStyle={styles.gridContainer}
          onEndReached={handleLoadMore}
          onEndReachedThreshold={0.1}
          onScroll={handleScroll}
          ListFooterComponent={
            loadingMore ? (
              <View style={styles.loaderContainer}>
                <ActivityIndicator size="large" color="#0000ff" />
              </View>
            ) : null
          }
        />
      ) : loading ? (
        <View style={styles.loaderContainer}>
          <ActivityIndicator size="large" color="#0000ff" />
          <Text style={styles.loadingText}>Loading Movie...</Text>
        </View>
      ) : (
        <View style={styles.loaderContainer}>
          <Text style={styles.loadingText}>No movies found.</Text>
        </View>
      )}

      {/* Scroll to top button */}
      {showScrollButton && (
        <TouchableOpacity style={styles.scrollButton} onPress={scrollToTop}>
          <Text style={styles.scrollButtonText}>↑</Text>
        </TouchableOpacity>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  loaderContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#fff',
  },
  loadingText: {
    marginTop: 10,
    fontSize: 16,
    color: '#555',
  },
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  toggleButton: {
    padding: 15,
    backgroundColor: '#101010',
    alignItems: 'center',
  },
  toggleButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
  },
  filterContainer: {
    padding: 20,
    backgroundColor: '#f5f5f5',
    borderBottomLeftRadius: 20,
    borderBottomRightRadius: 20,
  },
  input: {
    borderWidth: 1,
    borderColor: '#101010',
    padding: 10,
    marginBottom: 10,
    borderRadius: 5,
    fontSize: 16,
  },
  gridContainer: {
    width: '100%',
    padding: 10,
    gap: 20,
  },
  imageContainer: {
    width: '46%',
    marginHorizontal: "2%",
    marginBottom: 20,
    alignItems: 'center',
  },
  moviePoster: {
    width: '100%',
    height: 200,
    resizeMode: 'cover',
    borderRadius: 10,
  },
  movieTitle: {
    fontSize: 14,
    fontWeight: 'bold',
    marginTop: 10,
    textAlign: 'center',
    color: '#333',
  },
  scrollButton: {
    position: 'absolute',
    bottom: 20,
    right: 20,
    backgroundColor: '#000',
    width: 50,
    height: 50,
    borderRadius: 50,
    justifyContent: 'center',
    alignItems: 'center',
  },
  scrollButtonText: {
    color: '#fff',
    fontSize: 24,
  },
});
