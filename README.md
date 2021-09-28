# Portal UI Components 
A common library for Portal UI components and services that can be re-used across projects ex: Facilisight and Internal Portals.
It can also be bundled and packaged as npm pacakge

# Getting Started
Following are the commands that will be used to version bump, build and package the library.
1. Versioning
The Portal UI Components will be versioned using angular versioning , this will help in managing a release timeline.
Command : npm version x.y.z
2. Build
This is to build the Portal UI Shared library that will be packaged in next step.
Command: npm run build
3. Packing
This will pack the library as tgz , which can be used an external library and installed as node package and referred in project.
Command: npm pack [Note : this is to be run in dist folder that gets created after the npm build]
4. Publish
To publish to Azure Artifacts Feed , run the following command.
Command: npm publish
5. Local development
    a) First, we need to link the library to our app. Linking a library is 2 step process and is done via npm link command. 
    b) So we cd into dist/portal-ui-components and run npm link
    c) Next, from our project root folder run npm link portal-ui-components
    d) Now, if we run the library in the watch mode (npm run build-shared-lib-watch) and also run ng serve on project. We can develop our application and our linked libraries simultaneously, and see the app recompile with each modification to the library’s source code




