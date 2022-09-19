# Sicarator
> Sicara's project generator

## Installation

- Install a stable version of [node.js](https://nodejs.org/) if you don't have one 
- Install [Yeoman](http://yeoman.io):
    ```bash
    npm install -g yo
    ```
- Install `Sicarator` via `npm` and `git`:
    ```bash
    npm install -g git+https://github.com/sicara/sicarator
    ```

## Usage

- Before generating a new project, make sure to install last version from `Sicarator`:
    ```bash
    npm install -g git+https://github.com/sicara/sicarator
    ```

- Generate a new project with:
    ```bash
    yo sicarator
    ```

## Contribute to the project

- In order to run your version of the project, you can use the following command in your project directory :
    ```bash
  npm link
    ```
- For debugging, you can run :
  ```bash
  npx --node-options="--inspect" yo sicarator
  ```