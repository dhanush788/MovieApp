
export const buildSearchQuery = (query, type, year, genre) => {
    let searchQuery = query;
  
    if (type) searchQuery += `&type=${type}`;
    if (year) searchQuery += `&y=${year}`;
    if (genre) searchQuery += `&genre=${genre}`;
  
    return searchQuery;
  };
  