import Tone from 'tone';

export const settings = {
  transport: {
    'bpm': 70
  },
  basePath: './audio/',
  testSynth: new Tone.Synth({
    "oscillator" : {
      "type" : "sine"
    },
    "envelope" : {
      "attack" : 0.005,
      "decay" : 0.1,
      "sustain" : 0.3,
      "release" : 1
    }
  }),
  loop: new Tone.Loop(function(time){
    settings.testSynth.triggerAttackRelease("C4", "16n", time);
    // console.log(time);
  }, "8n"),
}