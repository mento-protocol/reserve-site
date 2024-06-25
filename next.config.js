// This file sets a custom webpack configuration to use your Next.js app
// with Sentry.
// https://nextjs.org/docs/api-reference/next.config.js/introduction
// https://docs.sentry.io/platforms/javascript/guides/nextjs/

// eslint-disable-next-line @typescript-eslint/no-var-requires
const { withSentryConfig } = require("@sentry/nextjs");

const moduleExports = {
  reactStrictMode: true,
  experimental: {
    modern: true,
    scss: false,
    optimizeDeps: {
      include: ["react/jsx-runtime"],
    },
  },
  webpack: (config, context) => {
    config.module.rules.push({
      test: /\.md$/,
      use: [
        {
          loader: "raw-loader",
          options: {
            esModule: false,
          },
        },
      ],
    });
    if (config.plugins) {
      config.plugins.push(
        new context.webpack.IgnorePlugin({
          resourceRegExp: /^(lokijs|pino-pretty|encoding)$/,
        }),
      );
    }
    return config;
  },
  async headers() {
    return [
      {
        source: "/",
        headers: [
          {
            key: "Cache-Control",
            value: "public; max-age=60, stale-while-revalidate=600",
          },
        ],
      },
      {
        source: "/:other",
        headers: [
          {
            key: "Cache-Control",
            value: "public; max-age=60, stale-while-revalidate=600",
          },
        ],
      },
      {
        source: "/api/holdings/:kind",
        headers: [
          {
            key: "Cache-Control",
            value: "public; max-age=30, stale-while-revalidate=360",
          },
        ],
      },
      {
        source: "/api/targets",
        headers: [
          {
            key: "Cache-Control",
            value: "public; max-age=90, stale-while-revalidate=360",
          },
        ],
      },
      {
        source: "/api/:any",
        headers: [
          {
            key: "Cache-Control",
            value: "public; max-age=5, stale-while-revalidate=20",
          },
        ],
      },
    ];
  },

  sentry: {
    // Use `hidden-source-map` rather than `source-map` as the Webpack `devtool`
    // for client-side builds. (This will be the default starting in
    // `@sentry/nextjs` version 8.0.0.) See
    // https://webpack.js.org/configuration/devtool/ and
    // https://docs.sentry.io/platforms/javascript/guides/nextjs/manual-setup/#use-hidden-source-map
    // for more information.
    hideSourceMaps: true,
  },
};

const sentryWebpackPluginOptions = {
  // Additional config options for the Sentry Webpack plugin. Keep in mind that
  // the following options are set automatically, and overriding them is not
  // recommended:
  //   release, url, org, project, authToken, configFile, stripPrefix,
  //   urlPrefix, include, ignore

  silent: false, // Suppresses all logs
  // For all available options, see:
  // https://github.com/getsentry/sentry-webpack-plugin#options.
};

// Make sure adding Sentry options is the last code to run before exporting, to
// ensure that your source maps include changes from all other Webpack plugins
module.exports = withSentryConfig(moduleExports, sentryWebpackPluginOptions);
