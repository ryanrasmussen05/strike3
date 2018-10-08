# Strike3

NFL picking application.  Choose a different NFL team to win every week, you can only choose a team once all season.  Three strikes and you are out.

* Angular 6
* NGRX
* Angular Bootstrap
* Firebase
    * Hosting
    * Realtime Database
    * Functions
    * Storage

## Development server

* `ng serve`
    * dev server at `http://localhost:4200/`

## Build

* `ng-build --prod`
    * build production ready code in the `dist` directory

## Deploy

* `firebase deploy`
    * deploy everything to firebase
* `firebase deploy --only hosting | functions`
    * deploy specific pieces only to firebase
