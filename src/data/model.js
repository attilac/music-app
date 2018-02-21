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
    path: `${settings.basePath}${samples[17].kit}/${samples[17].file}`,
    vol: -6,
    muted: false,
    beats: [0],
    key: 'q',
  },
  {
    id: 2,
    path: `${settings.basePath}${samples[1].kit}/${samples[1].file}`,
    vol: -6,
    muted: false,
    beats: [10],
    key: 'w',
  },
  {
    id: 3,
    path: `${settings.basePath}${samples[3].kit}/${samples[3].file}`,
    vol: -6,
    muted: false,
    beats: [4, 12, 7],
    key: 'e',
  },
  {
    id: 4,
    path: `${settings.basePath}${samples[25].kit}/${samples[25].file}`,
    vol: -6,
    muted: false,
    beats: [2, 7, 11, 13, 10, 12, 14],
    key: 'r',
  },
  {
    id: 5,
    path: `${settings.basePath}${samples[4].kit}/${samples[4].file}`,
    vol: -6,
    muted: false,
    beats: [15],
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
  {
    id: 7,
    path: `${settings.basePath}${samples[6].kit}/${samples[6].file}`,
    vol: -6,
    muted: false,
    beats: [],
    key: 'u',
  },
  {
    id: 8,
    path: `${settings.basePath}${samples[7].kit}/${samples[7].file}`,
    vol: -6,
    muted: false,
    beats: [],
    key: 'i',
  },
  {
    id: 9,
    path: `${settings.basePath}${samples[8].kit}/${samples[8].file}`,
    vol: -6,
    muted: false,
    beats: [],
    key: 'o',
  },
  {
    id: 10,
    path: `${settings.basePath}${samples[9].kit}/${samples[9].file}`,
    vol: -6,
    muted: false,
    beats: [],
    key: 'p',
  },
];

export function toggleTrackBeat(tracks, id, beat) {
  return tracks.map((track) => {
    if (track.id !== id) {
      return track;
    }
    // console.log(beat);
    return { ...track, beats: beatReplacer(track.beats, beat) };
  });
}

export function clearTrackBeat(tracks, id) {
  return tracks.map((track) => {
    if (track.id !== id) {
      return track;
    }
    return { ...track, beats: [] };
  });
}

function beatReplacer(beats, beat) {
  let newBeats = [...beats];
  if (!beats.includes(beat)) {
    newBeats = [...beats, beat];
  }
  return newBeats;
}

function sortNumber(a, b) {
  return a - b;
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
