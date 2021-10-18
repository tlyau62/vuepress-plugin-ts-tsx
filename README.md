# vuepress-plugin-ts-tsx

A vuepress plugin that enable ts and tsx support.

## Setup

### Install

```
npm i vuepress-plugin-ts-tsx
```

### Config

```js
// .vuepress/config.js
module.exports = {
  plugins: [
    // ...
    [
      'vuepress-plugin-ts-tsx',
      {
        tsLoaderOptions(opts) {
          return {
            ...opts,
            transpileOnly: false,
          };
        },
      },
    ],

    // or simply ['vuepress-plugin-ts-tsx']
  ],
};
```

## Plugin options

### tsLoaderOptions

- **Type**: `(opts: Partial<TsLoader.Options>) => Partial<TsLoader.Options>`

- **Description**

  The argument `opts` is the default ts loader options. By default, the opts will be merged with `{transpileOnly: true}`. You may change it by returning a new option. Here is an example.

  ```ts
  const tsLoaderOptions = (opts) => ({
    ...opts,
    transpileOnly: false,
  });
  ```

### babelLoaderOptions

- **Type**: `(opts: Config.LoaderOptions): Config.LoaderOptions`

- **Description**

  The argument `opts` is the default babel loader options. By default, the opts will be merged with `{configFile: true}`. You may change it by returning a new option. Here is an example.

  ```ts
  const babelLoaderOptions = (opts) => ({
    ...opts,
    configFile: false,
  });
  ```

## TODO

1. add ts-loader config option
2. add support on enhanceApp.ts
3. add cache loader
