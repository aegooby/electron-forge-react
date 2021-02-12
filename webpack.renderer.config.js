/* eslint-disable @typescript-eslint/no-var-requires */
const rules = require("./webpack.rules");
const plugins = require("./webpack.plugins");

const rules_config =
{
    test: /\.css$/,
    use: [ { loader: "style-loader" }, { loader: "css-loader" } ],
};
rules.push(rules_config);

module.exports =
{
    module: { rules },
    plugins: plugins,
    devtool: "source-map",
    resolve: { extensions: [ ".js", ".ts", ".jsx", ".tsx", ".css" ] },
};
