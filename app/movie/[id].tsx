import ParallaxScrollView from '@/components/ParallaxScrollView';
import { ThemedText } from '@/components/ThemedText';
import { ThemedView } from '@/components/ThemedView';
import { useRoute } from '@react-navigation/native';
import { useMovieContext } from '@/context/MovieContext';
import { Image, StyleSheet, Text, View, ActivityIndicator } from 'react-native';
import { useEffect } from 'react';
import MovieDetailSection from '@/components/MovieDetailSection';



export default function HomeScreen() {
  const route = useRoute();
  const { id } = route.params as { id: string };
  const { innerMovie, fetchMoviesByImdbID } = useMovieContext();

  useEffect(() => {
    if (id) {
      fetchMoviesByImdbID(id);
    }
  }, [id]);

  if (!innerMovie || innerMovie.imdbID !== id) {
    return (
      <View style={styles.loaderContainer}>
        <ActivityIndicator size="large" color="#0000ff" />
        <Text style={styles.loadingText}>Loading Movie...</Text>
      </View>
    );
  }

  return (
    <ParallaxScrollView
      headerBackgroundColor={{ light: '#A1CEDC', dark: '#1D3D47' }}
      headerImage={
        <Image source={{ uri: innerMovie.Poster }} style={styles.reactLogo} />
      }>
      <ThemedView style={styles.headerContainer}>
        <ThemedText type="title" style={styles.titleText}>{innerMovie.Title}</ThemedText>
        <Text style={styles.yearText}>{innerMovie.Year} | {innerMovie.Genre} | {innerMovie.Runtime}</Text>
      </ThemedView>

      <View style={styles.detailsContainer}>
        <MovieDetailSection title="Plot" content={innerMovie.Plot} />
        <MovieDetailSection title="Director" content={innerMovie.Director} />
        <MovieDetailSection title="Cast" content={innerMovie.Actors} />
        <MovieDetailSection title="Box Office" content={innerMovie.BoxOffice} />
        <MovieDetailSection title="Awards" content={innerMovie.Awards} />
        <MovieDetailSection title="Production" content={innerMovie.Production} />
        <MovieDetailSection title="Website" content={innerMovie.Website} isLink={true} url={innerMovie.Website} />
        <MovieDetailSection title="IMDB" content={innerMovie.imdbID} isLink={true} url={`https://www.imdb.com/title/${innerMovie.imdbID}`} />
        <MovieDetailSection title="IMDB Votes" content={innerMovie.imdbVotes} />
        <MovieDetailSection title="IMDB Rating" content={innerMovie.imdbRating} />
        <MovieDetailSection title="Rated" content={innerMovie.Rated} />
        <MovieDetailSection title="Released" content={innerMovie.Released} />
        <MovieDetailSection title="Writer" content={innerMovie.Writer} />
        <MovieDetailSection title="Language" content={innerMovie.Language} />
        <MovieDetailSection title="Country" content={innerMovie.Country} />
        <MovieDetailSection title="DVD" content={innerMovie.DVD} />
        <MovieDetailSection title="Metascore" content={innerMovie.Metascore} />
        <MovieDetailSection title="Type" content={innerMovie.Type} />
      </View>
    </ParallaxScrollView>
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
  reactLogo: {
    height: "100%",
    width: '100%',
    resizeMode: 'contain',
  },
  headerContainer: {
    padding:   20,
    backgroundColor: 'rgba(0,0,0,1)'
  },
  titleText: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#fff',
    marginBottom: 5,
  },
  yearText: {
    fontSize: 16,
    color: '#fff',
  },
  detailsContainer: {
    padding: 20,
    backgroundColor: '#fff',
  },
  detailTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginTop: 10,
  },
  plotText: {
    fontSize: 16,
    color: '#555',
    marginVertical: 10,
  },
  detailText: {
    fontSize: 16,
    color: '#333',
    marginVertical: 5,
  },
});
