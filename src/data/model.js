import Tone from 'tone';
import samples from './samples.json';

export const settings = {
  transport: {
    bpm: 70,
  },
  basePath: './audio/',
};

export const defaultSequence = [
  {
    id: 2,
    name: `${settings.basePath}${samples[2].kit}/${samples[2].file}`,
    vol: 0.7,
    muted: true,
    beats: [0, 3, 8],
  },
  {
    id: 2,
    name: `${settings.basePath}${samples[1].kit}/${samples[1].file}`,
    vol: 0.9,
    muted: false,
    beats: [9],
  },
  {
    id: 5,
    name: `${settings.basePath}${samples[3].kit}/${samples[3].file}`,
    vol: 0.9,
    muted: false,
    beats: [2, 11],
  },
  {
    id: 5,
    name: `${settings.basePath}${samples[25].kit}/${samples[25].file}`,
    vol: 0.9,
    muted: false,
    beats: [2, 7, 11, 13],
  },
];

export function toggleTrackBeat(tracks, id, beat) {
  return tracks.map((track) => {
    if (track.id !== id) {
      return track;
    }
    return { ...track, beats: track.beats.map((v, i) => (i !== beat ? v : !v)) };
  });
}

function compare(a, b) {
  if (a.time < b.time) {
    return -1;
  }
  if (a.time > b.time) {
    return 1;
  }
  return 0;
}
