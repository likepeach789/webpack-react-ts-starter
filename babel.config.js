const presets = [
    [
        "@babel/env",
        {
            useBuiltIns: "usage",
            corejs: 3
        },
    ],
    "@babel/preset-typescript",
    "@babel/preset-react"
];

const plugins = [
    "@babel/proposal-class-properties",
    "@babel/proposal-object-rest-spread",
    "@babel/plugin-transform-runtime"
];

module.exports = { presets, plugins };
