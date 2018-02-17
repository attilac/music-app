import Tone from 'tone';
import samples from "./samples.json";

export const settings = {
  transport: {
    'bpm': 70
  },
  basePath: './audio/'
}

export const defaultSequence = [
  {
    id: 2,
    name: settings.basePath + samples[2].kit + '/' + samples[2].file,
    vol: .7,
    muted: true,
    beats: [0, 3, 8],  
  },
  {
    id: 2,
    name: settings.basePath + samples[1].kit + '/' + samples[1].file,
    vol: .9,
    muted: false,
    beats: [9],  
  },  
  {
    id: 5,
    name: settings.basePath + samples[3].kit + '/' + samples[3].file,
    vol: .9,
    muted: false,
    beats: [2, 11],  
  },
  {
    id: 5,
    name: settings.basePath + samples[25].kit + '/' + samples[25].file,
    vol: .9,
    muted: false,
    beats: [2,7,11,13],  
  }               
];