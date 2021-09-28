# Portal UI SharedLibrary

This library was generated with [Angular CLI](https://github.com/angular/angular-cli) version 8.2.14.

## Code scaffolding

Run `ng generate component component-name --project=portal-ui-components` to generate a new component. You can also use `ng generate directive|pipe|service|class|guard|interface|enum|module --project=portal-ui-components`.
> Note: Don't forget to add `--project=portal-ui-components` or else it will be added to the default project in your `angular.json` file. 

## Build

Run `ng build portal-ui-components` to build the project. The build artifacts will be stored in the `dist/` directory.

## Publishing

After building your library with `ng build portal-ui-components`, go to the dist folder `cd dist/portal-ui-components` and run `npm publish`.

## Running unit tests

Run `ng test portal-ui-components` to execute the unit tests via [Karma](https://karma-runner.github.io).

## Local development
    a) First, we need to link the library to our app. Linking a library is 2 step process and is done via npm link command. 
    b) go to the dist folder `cd dist/portal-ui-components` and run `npm link`
    c) Next, from our project root folder run `npm link portal-ui-components`
    d) Now, if we run the library in the watch mode (npm run build-shared-lib-watch) and also run ng serve on project. We can develop our application and our linked libraries simultaneously, and see the app recompile with each modification to the library’s source code

## Further help

To get more help on the Angular CLI use `ng help` or go check out the [Angular CLI README](https://github.com/angular/angular-cli/blob/master/README.md).
