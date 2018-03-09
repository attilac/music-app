import samples from './samples.json';
import sampleKits from './sample-kits.json';

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

export function createDefaultSequence(samples, kitName) {
  return samples.map((item, index) => 
    ({ 
      id: index,
      path: `${settings.basePath}${kitName}/${item.file}`,
      vol: -6,
      muted: false,
      beats: [],
      key: item.key,
    })
  )
}

export function toggleTrackBeat(tracks, id, beat) {
  return tracks.map((track) => {
    if (track.id !== id) {
      return track;
    }
    // console.log(beat);
    return { ...track, beats: beatReplacer(track.beats, beat) };
  });
}

export function resetTrack(tracks, id) {
  return tracks.map((track) => {
    if (track.id !== id) {
      return track;
    }
    return { ...track, beats: [] };
  });
}

export function eraseEventFromTrack(tracks, id, beat) {
  return tracks.map((track) => {
    if (track.id !== id) {
      return track;
    }
    // console.log(beat);
    return { ...track, beats: removeBeat(track.beats, beat) };
  });
}

function removeBeat(beats, beat) {
  let newBeats = [...beats];
  return newBeats.filter(item =>
    item !== beat
  );
}

function beatReplacer(beats, beat) {
  let newBeats = [...beats];
  if (!beats.includes(beat)) {
    newBeats = [...beats, beat];
  }
  return newBeats;
}

export function copyBeatsToNewBars(beats, resolution, bars) {
  // console.log(beats);
  if (beats.length === 0) { return beats; }
  let newBeats;
  newBeats = beats.map(beat => 
    beat + resolution
  )
  const concatBeatsArray = [...beats, ...newBeats];
  // console.log(concatBeatsArray);
  return concatBeatsArray;
}

export function trimBeatsFromBars(beats, resolution, bars) {
  const beatLength = bars * resolution;
  // console.log(beats);
  return beats.filter(beat =>
    beat < beatLength
  );
}

export function getSampleByKey(key, kitName) {
  const kit = sampleKits.kits.find(item => 
    item.name === kitName
  );
  if (!kit) { return; } 

  const samples = kit.sounds;
  // console.log(samples);

  const sample = samples.find(item =>
    item.key === key
  );
  if (!sample) { return; }
  // console.log(sample);
  
  return sample.file;
}

