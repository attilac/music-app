import Tone from 'tone';

export function createPlayers(tracks) {
  // tracks: {id: 1, name: "hihat-reso", vol: .4, muted: false, beats: initBeats(16)}
  const limiter = new Tone.Limiter(-6).toMaster();
  const paths = tracks.reduce((acc, { path }) => ({ ...acc, [path]: path }), {});
  // console.log(paths);
  // new Tone.Players ( paths , [ onload ] )
  const samplePlayers = new Tone.Players(paths).connect(limiter);
  // console.log(samplePlayers);
  return samplePlayers;
}

export function create(tracks, beatNotifier, timeNotifier, samplePlayers) {
  // new Tone.Sequence ( callback , events , subdivision )
  const loop = new Tone.Sequence(
    loopHandler(tracks, beatNotifier, timeNotifier, samplePlayers),
    new Array(16).fill(0).map((_, i) => i),
    '16n',
  );
  return loop;
}

export function update(loop, tracks, beatNotifier, timeNotifier, samplePlayers) {
  loop.callback = loopHandler(tracks, beatNotifier, timeNotifier, samplePlayers);
  return loop;
}

export function setBPM(bpm) {
  Tone.Transport.bpm.value = bpm;
}

function loopHandler(tracks, beatNotifier, timeNotifier, samplePlayers) {
  return (time, index) => {
    beatNotifier(index);
    timeNotifier();
    tracks.forEach(({ path, vol, muted, beats }) => {
      if (beats.includes(index)) {
        try {
          // Player.start(startTime, offset, duration)
          samplePlayers.get(path).volume.value = vol;
          samplePlayers.get(path).mute = muted;
          samplePlayers.get(path).start(time, 0, '1n');
        } catch (e) {
          console.log(e, 'Sample buffer not loaded');
        }
      }
    });
  };
}

export function click(inst) {
  const loop = new Tone.Sequence(
    clickHandler(inst),
    ['G5', 'C5', 'C5', 'C5'],
    '4n',
  );
  return loop;
}

function clickHandler(inst) {
  return (time, note) => {
    try {
      // console.log('Click ', note);
      // console.log(inst);
      inst.triggerAttackRelease(note, '16n');
    } catch (e) {
      console.log(e, 'Sample buffer not loaded');
    }
  };
}

export function createClickSynth() {
  const synth = new Tone.Synth({
    oscillator: {
      type: 'sine',
    },
    envelope: {
      attack: 0,
      decay: 0.1,
      sustain: 0,
      release: 0,
    },
  }).toMaster();
  synth.volume.value = -6;
  return synth;
}
