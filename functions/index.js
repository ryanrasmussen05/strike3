const functions = require('firebase-functions');

exports.editPick = functions.firestore.document('picks/{pickId}').onCreate(event => {
  var data = event.data.data();
  data.time = new Date();

  return event.data.ref.set(data, {merge: true});
});

