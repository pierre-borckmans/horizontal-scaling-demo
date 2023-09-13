/* eslint-disable @typescript-eslint/no-var-requires */

const withReactSvg = require("next-react-svg");
const path = require("path");

const nextReactSvgOptions = {
  include: path.resolve(__dirname, "public"),
};

/** @type {import("next").NextConfig} */
const nextConfig = {
  output: "export",
};

module.exports = (phase, defaultConfig) => {
  const plugins = [withReactSvg(nextReactSvgOptions)];

  const config = plugins.reduce(
    (acc, plugin) => {
      const update = plugin(acc);
      return typeof update === "function"
        ? update(phase, defaultConfig)
        : update;
    },
    { ...nextConfig }
  );

  return config;
};
