const createOptions = (list) => list.map(item => ({ value: item, label: item }));

export const STATUS_OPTIONS = createOptions([
  "Idea", "Lyrics", "Demo", "Completed", "Released", "DOH"
]);

export const GENRE_OPTIONS = createOptions([
  "Rock", "Hip-Hop", "EDM", "Country", "Punk", "Indie", "Pop", "Alternative"
]);


