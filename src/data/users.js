const firstNames = ['gifted', 'grooving', 'slow', 'jiggy', 'soulful', 'swaggy', 'punk', 'rock', 'jazzy', 'DJ', 'Chance The', 'A$AP', 'Big', 'lil', 'kid', 'Mr'];
const lastNames = ['kazoo', 'triangle', 'forte', 'sax', 'flute', 'banjo', 'oboe', 'piano', 'drums'];


export function makeUserName() {
  const firstName = firstNames[Math.floor(Math.random()*firstNames.length)];
  const lastName = lastNames[Math.floor(Math.random()*lastNames.length)];
  return firstName + '-' + lastName;
}