module.exports = [
    /** @note This breaks native modules. */
    // {
    //     test: /\.node$/,
    //     loader: "node-loader",
    //     options: {
    //         flags: os.constants.dlopen.RTLD_NOW,
    //     }
    // },
    {
        test: /\.(m?js|node)$/,
        parser: { amd: false },
        use:
        {
            loader: "@marshallofsound/webpack-asset-relocator-loader",
            options: { outputAssetBase: "native_modules" },
        },
    },
    {
        test: /\.tsx?$/,
        exclude: /(node_modules|\.webpack)/,
        use:
        {
            loader: "ts-loader",
            options: { transpileOnly: true }
        }
    },
];
