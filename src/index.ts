import TsLoader from 'ts-loader';
import { Plugin } from 'vuepress-types';

export interface TypescriptPluginOptions {
  tsLoaderOptions: Partial<TsLoader.Options>;
}

const TsTsxPlugin: Plugin<TypescriptPluginOptions> = () => ({
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
      .use('ts-loader')
      .loader('ts-loader')
      .options({
        appendTsSuffixTo: [/.vue$/, /.md$/],
      })
      .end();

    config.module
      .rule('tsx')
      .test(/\.tsx$/)
      .use('babel-loader')
      .loader('babel-loader')
      .end()
      .use('ts-loader')
      .loader('ts-loader')
      .options({
        appendTsxSuffixTo: [/.vue$/, /.md$/],
      })
      .end();
  },
});

module.exports = TsTsxPlugin;
