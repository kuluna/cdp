cdp
-----

[![npm version](https://badge.fury.io/js/cdp.svg)](https://badge.fury.io/js/cdp)

Necessary to clean the desk Policy(CDP) in node.js.

Are there many config files in the project directory? cdp puts them in one `configs.json`.

プロジェクトフォルダの中にたくさんのコンフィグファイルがありませんか？cdpはそれらを一つの`configs.json`にまとめます。

# Example
## Angular
`$ ng new NewProject`
```
./
│  .angular-cli.json    <- config file
│  .editorconfig        <- config file
│  .gitignore
│  karma.conf.js        <- config file
│  package.json
│  protractor.conf.js   <- config file
│  README.md
│  tslint.json          <- config file
│  
├─e2e
│      app.e2e-spec.ts
│      app.po.ts
│      tsconfig.json    <- config file
│      
└─src
    │  favicon.ico
    │  index.html
    │  main.ts
    │  polyfills.ts
    │  styles.css
    │  test.ts
    │  tsconfig.json    <- config file
    │  
    ├─app
    │      app.component.css
    │      app.component.html
    │      app.component.spec.ts
    │      app.component.ts
    │      app.module.ts
    │      
    ├─assets
    │      .gitkeep
    │      
    └─environments
            environment.prod.ts
            environment.ts
```

However, use cdp after,

`$ cdp --in --gitignore --afterdelete .angular-cli.json .editorconfig karma.conf.js protractor.conf.js tslint.json e2e/tsconfig.json src/tsconfig.json`
```
./
│  .gitignore
│  configs.json     <- one config file!
│  package.json
│  README.md
│  
├─e2e
│      app.e2e-spec.ts
│      app.po.ts
│      
└─src
    │  favicon.ico
    │  index.html
    │  main.ts
    │  polyfills.ts
    │  styles.css
    │  test.ts
    │  
    ├─app
    │      app.component.css
    │      app.component.html
    │      app.component.spec.ts
    │      app.component.ts
    │      app.module.ts
    │      
    ├─assets
    │      .gitkeep
    │      
    └─environments
            environment.prod.ts
            environment.ts
```

Git push and 🍺!

If you want to restore the files,  
ファイルを元に戻したい時は、下のコマンドを実行してください。

`$ cdp --out`

# Install
`$ npm install -g cdp`

# Usage
```
$ cdp
Usage: cdp mode

mode:
--in [--afterdelete] [--gitignore] [filePath] Checkin for configs.json.
  --afterdelete                               Delete files after checkin.
  --gitignore                                 Add files to gitignore.
--out                                         Checkout from configs.json.
```

# Develop
1. `git clone https://github.com/kuluna/cdp.git`
1. `cd cdp`
1. `npm install`
1. `npm build`

# Contributing
1. Fork it!
1. Create your feature branch: `git checkout -b my-new-feature`
1. Commit your changes: `git commit -am 'Add some feature'`
1. Push to the branch: `git push origin my-new-feature`
1. Submit a pull request :D

# License
MIT License.
