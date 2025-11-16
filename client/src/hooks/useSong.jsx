import { useContext } from 'react';
import { SongContext } from '../contexts/SongContext';

export const useSong = () => {
  const context = useContext(SongContext);
  if (!context) {
    throw new Error('useUser must be used within SongProvider');
  }
  return context;
}

