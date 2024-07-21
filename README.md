# W2M Challenge by Juanjo Lozano 21/07/2024

This is a repository that contains an Angular 17 project challenge for W2M, this project uses latest Angular features, like standalone components, new syntax and signals.

## Considerations

* Directive and interceptor has been developed.
* This project uses json-server as a mockserver, it is mandatory to follow the setup guide.
* Tests and better styiling has not been implemented due to lack of time.
* Any question or additional comment, feel free to contact me (lbarcelo.juanjo@gmail.com).

## Setup

* Install modules
    ```
        npm install 
    ```

* Install json server (@0.17.4 is mandatory)

    ```
        npm i -g json-server@0.17.4
        json-server --watch db.json
    ```

* Serve angular project

     ```
     ng serve --open
     ```