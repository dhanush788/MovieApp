import React from 'react';
import { Text, TouchableOpacity, Linking } from 'react-native';
import { StyleSheet } from 'react-native';

interface MovieDetailSectionProps {
  title: string;
  content: string | React.ReactNode;
  isLink?: boolean;
  url?: string;
}

const MovieDetailSection: React.FC<MovieDetailSectionProps> = ({ title, content, isLink, url }) => {
  const renderContent = isLink ? (
    <TouchableOpacity onPress={() => Linking.openURL(url as string)}>
      <Text style={styles.detailText}>{content}</Text>
    </TouchableOpacity>
  ) : (
    <Text style={styles.detailText}>{content}</Text>
  );

  return (
    <React.Fragment>
      <Text style={styles.detailTitle}>{title}</Text>
      {renderContent}
    </React.Fragment>
  );
};

const styles = StyleSheet.create({
  detailTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginTop: 10,
  },
  detailText: {
    fontSize: 16,
    color: '#333',
    marginVertical: 5,
  },
});

export default MovieDetailSection;
