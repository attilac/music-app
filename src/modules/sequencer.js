import Tone from 'tone';
import { settings } from './../data/model';

export function create(tracks, beatNotifier) {
  // new Tone.Sequence ( callback , events , subdivision )
  const loop = new Tone.Sequence(
    loopHandler(tracks, beatNotifier),
    new Array(16).fill(0).map((_, i) => i),
    '16n',
  );

  // Tone.Transport.bpm.value = 70;
  // Tone.Transport.start();
  // console.log(loop);
  return loop;
}

export function update(loop, tracks, beatNotifier) {
  loop.callback = loopHandler(tracks, beatNotifier);
  return loop;
}

export function setBPM(bpm) {
  Tone.Transport.bpm.value = bpm;
}

function loopHandler(tracks, beatNotifier) {
  // tracks: {id: 1, name: "hihat-reso", vol: .4, muted: false, beats: initBeats(16)}
  const urls = tracks.reduce((acc, { name }) => ({ ...acc, [name]: name }), {});
  // console.log(urls);
  // new Tone.Players ( urls , [ onload ] )
  const keys = new Tone.Players(urls).toMaster();
  return (time, index) => {
    beatNotifier(index);
    // console.log(index);
    const vel = (Math.random() * 0.5) + 0.5;
    tracks.forEach(({
      name,
      vol,
      muted,
      beats,
    }) => {
      if (beats.includes(index)) {
        try {
          // "1n" should be set via some "noteLength" track prop
          keys.get(name).start(time, 0, '1n', 0, muted ? 0 : vel * vol);
        } catch (e) {
          // We're most likely in a race condition where the new sample hasn't been loaded
          // just yet; silently ignore, it will resiliently catch up later.
          // console.log(e);
          console.log('Sample buffer not loaded');
        }
      }
    });
  };
}
