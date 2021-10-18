import TsLoader from 'ts-loader';
import { Plugin } from 'vuepress-types';
import { merge, identity } from 'lodash';
import Config from 'webpack-chain';

export interface TypescriptPluginOptions {
  tsLoaderOptions: Partial<TsLoader.Options>;
  babelLoaderOptions?: any;
  chainWebpack?(config: Config): void;
}

const TsTsxPlugin: Plugin<TypescriptPluginOptions> = ({
  tsLoaderOptions,
  babelLoaderOptions = {
    configFile: true,
  },
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
      .tap((opts) => merge(opts, babelLoaderOptions))
      .end()
      .use('ts-loader')
      .loader('ts-loader')
      .tap((opts) =>
        merge(opts, tsLoaderOptions, {
          appendTsSuffixTo: [/.vue$/, /.md$/],
        })
      )
      .end();

    config.module
      .rule('tsx')
      .test(/\.tsx$/)
      .use('babel-loader')
      .loader('babel-loader')
      .tap((opts) => merge(opts, babelLoaderOptions))
      .end()
      .use('ts-loader')
      .loader('ts-loader')
      .tap((opts) =>
        merge(opts, tsLoaderOptions, {
          appendTsxSuffixTo: [/.vue$/, /.md$/],
        })
      )
      .end();

    chainWebpack(config);
  },
});

module.exports = TsTsxPlugin;
