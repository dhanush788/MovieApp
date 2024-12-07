export interface FilterSectionProps {
    query: string;
    setQuery: React.Dispatch<React.SetStateAction<string>>;
    type: string;
    setType: React.Dispatch<React.SetStateAction<string>>;
    genre: string;
    setGenre: React.Dispatch<React.SetStateAction<string>>;
    year: string;
    setYear: React.Dispatch<React.SetStateAction<string>>;
    handleSearch: () => void;
    open: boolean;
    setOpen: React.Dispatch<React.SetStateAction<boolean>>;
    open2: boolean;
    setOpen2: React.Dispatch<React.SetStateAction<boolean>>;
  }