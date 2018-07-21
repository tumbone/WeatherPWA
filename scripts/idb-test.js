var dbPromise = idb.open('test-db', 4, function (upgradeDb) {
  switch (upgradeDb.oldVersion) {
    case 0:
      var keyValStore = upgradeDb.createObjectStore('keyVal');
      keyValStore.put('world', 'hello');
    case 1:
      // Entries will be listed in alphabetical order of the name key property
      upgradeDb.createObjectStore('people', { keyPath: 'name' });
    case 2:
      var peopleStore = upgradeDb.transaction.objectStore('people');
      peopleStore.createIndex('animal', 'favoriteAnimal');
    case 3:
      var peopleStore = upgradeDb.transaction.objectStore('people');
      peopleStore.createIndex('age', 'age');
  }
})

dbPromise.then(function (db) {
  var tx = db.transaction('keyVal');
  var keyValStore = tx.objectStore('keyVal');
  return keyValStore.get('hello');
}).then(function (val) {
  console.log('The value for "hello" is: ', val);
});

dbPromise.then(function (db) {
  var tx = db.transaction('keyVal', 'readwrite');
  var keyValStore = tx.objectStore('keyVal');
  keyValStore.put('bar', 'foo');
  return tx.complete;
}).then(function () {
  console.log('Added foo:bar to keyval');
})

dbPromise.then(function (db) {
  var tx = db.transaction('people', 'readwrite');
  var peopleStore = tx.objectStore('people');

  peopleStore.put({
    name: 'Mulenga Bwalya',
    age: 26,
    favoriteAnimal: 'dog'
  })
  peopleStore.put({
    name: 'Chanda Banda',
    age: 32,
    favoriteAnimal: 'cat'
  })
  peopleStore.put({
    name: 'John Jere',
    age: 23,
    favoriteAnimal: 'bird'
  })
  peopleStore.put({
    name: 'Paul Mwelwa',
    age: 19,
    favoriteAnimal: 'goat'
  })

  return tx.complete;
}).then(function () {
  console.log('People added')
});

dbPromise.then(function (db) {
  var tx = db.transaction('people');
  var peopleStore = tx.objectStore('people')
  var animalIndex = peopleStore.index('animal');

  // return peopleStore.getAll();
  // return animalIndex.getAll('cat');
  return animalIndex.getAll();
}).then(function (people) {
  console.log('People: ', people)
})

dbPromise.then(function (db) {
  var tx = db.transaction('people');
  var peopleStore = tx.objectStore('people');
  var ageIndex = peopleStore.index('age');

  return ageIndex.getAll();
}).then(function (people) {
  console.log('People by age:', people);
})

dbPromise.then(function (db) {
  var tx = db.transaction('people');
  var peopleStore = tx.objectStore('people');
  var ageIndex = peopleStore.index('age');

  return ageIndex.openCursor();
}).then(function (cursor) {
  // Skip the first entry in the table
  return cursor.advance(1);
}).then(function logPerson(cursor) {
  if (!cursor) return;
  console.log('Cursored at:', cursor.value.name);
  // cursor.update(newValue);
  // cursor.delete();
  return cursor.continue().then(logPerson);
}).then(function () {
  console.log('Done cursoring');
})