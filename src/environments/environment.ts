// This file can be replaced during build by using the `fileReplacements` array.
// `ng build --prod` replaces `environment.ts` with `environment.prod.ts`.
// The list of file replacements can be found in `angular.json`.

export const environment = {
  production: false,
  // hostV1: 'http://localhost:3000',
  hostV1: 'https://node-expense-task.herokuapp.com',
  firebaseConfig: {
    apiKey: 'AIzaSyDxxiDaOtkgQtYIdUq3jQE3wqVYrtexH4E',
    authDomain: 'expence-task.firebaseapp.com',
    databaseURL: 'https://expence-task.firebaseio.com',
    projectId: 'expence-task',
    storageBucket: 'expence-task.appspot.com',
    messagingSenderId: '390558563705',
    appId: '1:390558563705:web:b0ad5a6bc6d3e33b8b43a8',
    measurementId: 'G-2SGSVZM2S1'
  }
};

/*
 * For easier debugging in development mode, you can import the following file
 * to ignore zone related error stack frames such as `zone.run`, `zoneDelegate.invokeTask`.
 *
 * This import should be commented out in production mode because it will have a negative impact
 * on performance if an error is thrown.
 */
// import 'zone.js/dist/zone-error';  // Included with Angular CLI.
