import TsLoader from 'ts-loader';
import { Plugin } from 'vuepress-types';
import { merge, identity } from 'lodash';
import Config from 'webpack-chain';

export interface TypescriptPluginOptions {
  tsLoaderOptions?(opts: Partial<TsLoader.Options>): Partial<TsLoader.Options>;
  babelLoaderOptions?(opts: Config.LoaderOptions): Config.LoaderOptions;
  chainWebpack?(config: Config): void;
}

export const defaultTsLoaderOptions: Partial<TsLoader.Options> = {
  transpileOnly: true,
};

export const defaultBabelLoaderOptions: any = {
  configFile: true,
};

const TsTsxPlugin: Plugin<TypescriptPluginOptions> = ({
  tsLoaderOptions = identity,
  babelLoaderOptions = identity,
  chainWebpack = identity,
}) => ({
  name: 'vuepress-plugin-ts-tsx',

  /**
   * Allow following files support typescript:
   * - .ts
   * - .tsx
   * - .vue
   * - .md
   *
   * @see https://github.com/TypeStrong/ts-loader/tree/v8.3.0#appendtsxsuffixto
   */
  chainWebpack(config): void {
    config.resolve.extensions.add('.ts').add('.tsx');

    config.module
      .rule('vue')
      .test(/\.vue$/)
      .use('vue-loader')
      .loader('vue-loader')
      .tap((opts) => {
        opts.loaders = {
          ...opts.loaders,
          ts: 'ts-loader',
          tsx: 'babel-loader!ts-loader',
        };

        return opts;
      })
      .end();

    config.module
      .rule('ts')
      .test(/\.ts$/)
      .use('babel-loader')
      .loader('babel-loader')
      .tap(
        (opts) =>
          babelLoaderOptions(merge(opts, defaultBabelLoaderOptions)) || opts
      )
      .end()
      .use('ts-loader')
      .loader('ts-loader')
      .tap(
        (opts) =>
          tsLoaderOptions(
            merge(opts, defaultTsLoaderOptions, {
              appendTsSuffixTo: [/.vue$/, /.md$/],
            })
          ) || opts
      )
      .end();

    config.module
      .rule('tsx')
      .test(/\.tsx$/)
      .use('babel-loader')
      .loader('babel-loader')
      .tap(
        (opts) =>
          babelLoaderOptions(merge(opts, defaultBabelLoaderOptions)) || opts
      )
      .end()
      .use('ts-loader')
      .loader('ts-loader')
      .tap(
        (opts) =>
          tsLoaderOptions(
            merge(opts, defaultTsLoaderOptions, {
              appendTsxSuffixTo: [/.vue$/, /.md$/],
            })
          ) || opts
      )
      .end();

    chainWebpack(config);
  },
});

module.exports = TsTsxPlugin;
