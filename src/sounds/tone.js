import Tone from 'tone';

export const settings = {
  transport: {
    'bpm': 70
  },
  samples: [
    {"file":"flash-1.mp3"},
    {"file":"clay.mp3"}, 
    {"file":"moon.mp3"}, 
    {"file":"piston-1.mp3"}, 
    {"file":"timer.mp3"}, 
    {"file":"suspension.mp3"}, 
    {"file":"prism-1.mp3"}, 
    {"file":"squiggle.mp3"}, 
    {"file":"glimmer.mp3"}, 
    {"file":"dotted-spiral.mp3"},
    {"file":"flash-2.mp3"},
    {"file":"veil.mp3"},
    {"file":"ufo.mp3"},
    {"file":"piston-2.mp3"},
    {"file":"bubbles.mp3"},
    {"file":"strike.mp3"},
    {"file":"prism-2.mp3"},
    {"file":"pinwheel.mp3"},
    {"file":"zig-zag.mp3"},
    {"file":"flash-3.mp3"},
    {"file":"wipe.mp3"},
    {"file":"splits.mp3"},
    {"file":"piston-3.mp3"},
    {"file":"corona.mp3"},
    {"file":"confetti.mp3"},
    {"file":"prism-3.mp3"}
   ], 
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
    console.log(time);
  }, "8n"),
}