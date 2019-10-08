# Why ?

When a (typescript?) server projects grows,
the overhead of restarting your server or launching your mocha tests grows likewise.

Using Webpack HMR, such overheads are removed.

# Test HMR with this repo

## 0) Install the right testing extension
I created a pull request on the original extension [vscode-mocha-test-adapter](https://marketplace.visualstudio.com/items?itemName=hbenl.vscode-mocha-test-adapter).

Until this pull request is accepted, you must use my fork of this extension:

1) Uninstall [Mocha Test explorer](https://marketplace.visualstudio.com/items?itemName=hbenl.vscode-mocha-test-adapter)
2) Install [Mocha Test Explorer - HMR support](https://marketplace.visualstudio.com/items?itemName=oguimbal.vscode-mocha-test-adapter)

## 1) Clone this repo
```
git clone git@github.com:oguimbal/vscode-mocha-hmr-sample.git
code vscode-mocha-hmr-sample
```

## 2) Install & start webpack

```
npm i
npm start
```

This will start your webpack build

## 3) Refresh your tests / run your server

Just click the "refresh" button in vscode test explorer, and you will see a realtime view of your tests.

Tests will be updated almost instantly every time you change a file, no matter your project size (with no compilation overhead).

Hit F5 to run your sever (it also supports HMR => it will auto-restart instantly when a file changes).


# How to configure on my repo ?

## 1) Configure webpack

You must setup Webpack HMR build for your server.

See HMR configuration [webpack.config.js](./webpack.config.js) to understand a bit how to do that.

## 2) Configure your tests

*Mocha tests explorer* supports HMR when you set the `mochaExplorer.hmrBundle`: see [.vscode/settings.json](./.vscode/settings.json)

This option assumes that your bunle root contains the code below. See [tests-index.js](./tests-index.js) for an example

```
// nb: to install this module:  npm i vscode-mocha-hmr -D
require('vscode-mocha-hmr')(module);
```

When set, a worker will be spawned that watches for HMR changes, and updates your tests instantly.

Tests will also be executed (or debugged) instantly.

nb: By "instantly", I mean "with no overhead due to process creation or typescript compilation", which was making me lose >10seconds on every test execution on big projects.


## 3) Configure your server to handle HMR

HMR is great for testing, but for running as well. This repository demonstrates how to setup HMR for an express server.

You must explicitely handle HMR in your code to tell webpack that you support it.

A naive implementation ca be found in [src/main.ts](./src/main.ts), which in short consists in adding in your entry file:

```
if (module.hot) {
    module.hot.accept();
    module.hot.dispose(() => {
        // dispose your old resources here (stop server, ...)
    });
}
```

Doing so, your server will be automatically restarted when a file changes, without recompiling the whole app.


# HMR Drawbacks - things to know about

- When you restart webpack compilation, you must also hit the "refresh tests" to see new tests or test changes.
- If a dependency module is unchanged, and if it has a state (i.e. internal variables), then this internal state will remain when restarting tests/reloading server using HMR.
- HMR is pretty transparent in many cases, but it is not magic: You must always keep it in mind when something is obviously wrong, and restart your server/reload your tests.