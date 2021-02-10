module.exports =
{
    entry: "./app/index.ts",
    module: { rules: require("./webpack.rules") },
    resolve: { extensions: [ ".js", ".ts", ".jsx", ".tsx", ".css", ".json" ] },
};
