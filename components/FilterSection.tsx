import { FilterSectionProps } from '@/Types/FilterSectionProps';
import React from 'react';
import { TextInput, Button, View, StyleSheet } from 'react-native';
import DropDownPicker from 'react-native-dropdown-picker';

const FilterSection: React.FC<FilterSectionProps> = ({
  query,
  setQuery,
  type,
  setType,
  genre,
  setGenre,
  year,
  setYear,
  handleSearch,
  open,
  setOpen,
  open2,
  setOpen2,
}) => {
  return (
    <View style={styles.filterContainer}>
      <TextInput
        style={styles.input}
        placeholder="Search for a movie..."
        value={query}
        onChangeText={setQuery}
      />
      <View style={[styles.dropdownContainer, { zIndex: 1000 }]}>
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
          containerStyle={styles.dropdownContainerStyle}
        />
      </View>
      <View style={[styles.dropdownContainer, { zIndex: 999 }]}>
        <DropDownPicker
          style={styles.input}
          open={open2}
          items={[
            { label: 'Action', value: 'Action' },
            { label: 'Comedy', value: 'Comedy' },
            { label: 'Drama', value: 'Drama' },
            { label: 'Romance', value: 'Romance' },
            { label: 'Horror', value: 'Horror' },
            { label: 'Sci-Fi', value: 'Sci-Fi' },
            { label: 'Thriller', value: 'Thriller' },
            { label: 'Adventure', value: 'Adventure' },
          ]}
          value={genre}
          setValue={setGenre}
          setOpen={setOpen2}
          placeholder="Select Genre"
          containerStyle={styles.dropdownContainerStyle}
          dropDownContainerStyle={{
            maxHeight: 120,
          }}
          listMode="SCROLLVIEW"
        />
      </View>
      <TextInput
        style={styles.input}
        placeholder="Year (optional)"
        keyboardType="numeric"
        value={year}
        onChangeText={setYear}
      />
      <Button title="Search" color={'#101010'} onPress={handleSearch} />
    </View>
  );
};

const styles = StyleSheet.create({
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
  dropdownContainer: {
    position: 'relative',
  },
  dropdownContainerStyle: {
    marginBottom: 5,
  },
});

export default FilterSection;
