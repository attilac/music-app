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
    id: 1,
    path: `${settings.basePath}${samples[2].kit}/${samples[2].file}`,
    vol: -6,
    muted: false,
    beats: [0, 3, 8],
    key: 'q',
  },
  {
    id: 2,
    path: `${settings.basePath}${samples[1].kit}/${samples[1].file}`,
    vol: -6,
    muted: false,
    beats: [9],
    key: 'w',
  },
  {
    id: 3,
    path: `${settings.basePath}${samples[3].kit}/${samples[3].file}`,
    vol: -6,
    muted: false,
    beats: [2, 11],
    key: 'e',
  },
  {
    id: 4,
    path: `${settings.basePath}${samples[25].kit}/${samples[25].file}`,
    vol: -6,
    muted: false,
    beats: [2, 7, 11, 13],
    key: 'r',
  },
  {
    id: 5,
    path: `${settings.basePath}${samples[4].kit}/${samples[4].file}`,
    vol: -6,
    muted: false,
    beats: [],
    key: 't',
  },
  {
    id: 6,
    path: `${settings.basePath}${samples[5].kit}/${samples[5].file}`,
    vol: -6,
    muted: false,
    beats: [],
    key: 'y',
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
