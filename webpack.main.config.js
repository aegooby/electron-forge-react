module.exports =
{
    entry: "./app/index.ts",
    devtool: "source-map",
    module: { rules: require("./webpack.rules") },
    resolve: { extensions: [ ".js", ".ts", ".jsx", ".tsx", ".css", ".json" ] },
};
