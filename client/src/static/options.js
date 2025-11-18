const createOptions = (list) => list.map(item => ({ value: item, label: item }));

export const STATUS_OPTIONS = createOptions([
  "Idea", "Lyrics", "Demo", "Completed", "Released", "DOH"
]);

export const GENRE_OPTIONS = createOptions([
  "Rock", "Hip-Hop", "EDM", "Country", "Punk", "Indie", "Pop", "Alternative"
]);

export const KEY_OPTIONS = createOptions([
  "C", "C#", "Db", "D", "D#", "Eb", "E", "F", "F#", "Gb", "G", "G#",
  "Ab", "A", "A#", "Bb", "B", "Cm", "C#m", "Dm", "D#m", "Ebm", "Em",
  "Fm", "F#m", "Gm", "G#m", "Am", "A#m", "Bm"
]);