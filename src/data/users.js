const firstNames = ['Grooving', 'Polygon', 'Young', 'Dr', 'DJ', 'A$AP', 'Kid', 'Aphex', 'Slow'];
const lastNames = ['Noise', 'Triangle', 'SineWave', 'Sparks', 'Galaxy', 'Column', 'Points', 'Gold'];

export function makeUserName() {
  const firstName = firstNames[Math.floor(Math.random()*firstNames.length)];
  const lastName = lastNames[Math.floor(Math.random()*lastNames.length)];
  return firstName + '-' + lastName;
}

export function storeCurrentUser(user) {
  const stringifiedUser = JSON.stringify(user);
  return localStorage.setItem('currentUser', stringifiedUser);
}

export function fetchCurrentUser() {
  const currentUser = localStorage.getItem('currentUser');
  return currentUser ? JSON.parse(currentUser) : '';
}