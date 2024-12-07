import React, { useState, useEffect } from 'react';
import { Image, StyleSheet, Text, View, ActivityIndicator, TextInput, Button, TouchableOpacity, FlatList, Animated, Easing } from 'react-native';
import DropDownPicker from 'react-native-dropdown-picker';
import { useMovieContext } from '@/context/MovieContext';
import { useNavigation } from '@react-navigation/native';

interface Movie {
  title: string;
  year: string;
  poster: string;
  imdbID: string;
}

export default function HomeScreen() {
  const { movies, loading, setMovies, fetchMoviesBySearch, fetchRandomMovies } = useMovieContext();
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
  const navigation = useNavigation();

  const genres = [
    { label: 'Action', value: 'Action' },
    { label: 'Comedy', value: 'Comedy' },
    { label: 'Drama', value: 'Drama' },
    { label: 'Romance', value: 'Romance' },
    { label: 'Horror', value: 'Horror' },
    { label: 'Sci-Fi', value: 'Sci-Fi' },
    { label: 'Thriller', value: 'Thriller' },
    { label: 'Adventure', value: 'Adventure' },
  ];

  const toggleFilters = () => {
    Animated.timing(filtersHeight, {
      toValue: showFilters ? 0 : 300,
      duration: 300,
      easing: Easing.ease,
      useNativeDriver: false,
    }).start();
    setShowFilters(!showFilters);
  };

  const handleSearch = () => {
    movies && movies.length > 0 && setMovies(null);
    setPage(1);
    let searchQuery = query;

    if (type) searchQuery += `&type=${type}`;
    if (year) searchQuery += `&y=${year}`;
    if (genre) searchQuery += `&genre=${genre}`;

    if (!searchQuery) {
      fetchRandomMovies(1);
    } else {
      fetchMoviesBySearch(searchQuery, 1);
    }
  };


  useEffect(() => {
    if (!movies && !query) {
      fetchRandomMovies(1);
    }
  }, []);

  const handleLoadMore = () => {
    if (loadingMore) return;
    setLoadingMore(true);
    const nextPage = page + 1;

    if (!query) {
      fetchRandomMovies(nextPage).finally(() => setLoadingMore(false));
    } else {
      let searchQuery = query;

      if (type) searchQuery += `&type=${type}`;
      if (year) searchQuery += `&y=${year}`;
      if (genre) searchQuery += `&genre=${genre}`;
      fetchMoviesBySearch(searchQuery, nextPage).finally(() => setLoadingMore(false));
    }

    setPage(nextPage);
  };

  const renderItem = ({ item }: { item: Movie }) => (

    <TouchableOpacity key={item.imdbID} style={styles.imageContainer}
    // onPress={() => navigation.navigate('MovieDetails', { imdbID: item.imdbID })}
    >
      <Image source={{ uri: item.poster }} style={styles.moviePoster} />
      <Text style={styles.movieTitle}>{item.title}</Text>
    </TouchableOpacity>
  );



  return (
    <View style={styles.container}>
      <TouchableOpacity style={styles.toggleButton} onPress={toggleFilters}>
        <Text style={styles.toggleButtonText}>{showFilters ? 'Hide Filters' : 'Show Filters'}</Text>
      </TouchableOpacity>

      <Animated.View style={{ height: filtersHeight, overflow: 'hidden' }}>
        {showFilters && (
          <View style={styles.filterContainer}>
            <TextInput
              style={styles.input}
              placeholder="Search for a movie..."
              value={query}
              onChangeText={setQuery}
            />
            <DropDownPicker
              style={styles.input}
              open={open}
              items={[
                { label: 'Movie', value: 'movie' },
                { label: 'Series', value: 'series' },
                { label: 'Episode', value: 'episode' },
              ]}
              value={type}
              setValue={setType}
              setOpen={setOpen}
            />
            <DropDownPicker
              style={styles.input}
              open={open2}
              items={genres}
              value={genre}
              setValue={setGenre}
              setOpen={setOpen2}
              placeholder="Select Genre"
            />
            <TextInput
              style={styles.input}
              placeholder="Year (optional)"
              keyboardType="numeric"
              value={year}
              onChangeText={setYear}
            />
            <Button title="Search" color={"#101010"} onPress={handleSearch} />
          </View>
        )}
      </Animated.View>
      {movies ?
        <FlatList
          data={movies}
          renderItem={renderItem}
          keyExtractor={(item) => item.imdbID}
          numColumns={2}
          contentContainerStyle={styles.gridContainer}
          onEndReached={handleLoadMore}
          onEndReachedThreshold={0.1}
          ListFooterComponent={
            loadingMore ? (
              <View style={styles.loaderContainer}>
                <ActivityIndicator size="large" color="#0000ff" />
              </View>
            ) : null
          }
        />
        :
        loading ?

          <View style={styles.loaderContainer}>
            <ActivityIndicator size="large" color="#0000ff" />
            <Text style={styles.loadingText}>Loading Movie...</Text>
          </View>
          :
          <View style={styles.loaderContainer}>
            <Text style={styles.loadingText}>No movies found.</Text>
          </View>
      }
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
    gap: 20
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
});
