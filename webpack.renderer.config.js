const rules = require("./webpack.rules");

const cssRules =
{
    test: /\.css$/,
    use: [{ loader: "style-loader" }, { loader: "css-loader" }],
};

rules.push(cssRules);

const jsxRules =
{
    test: /\.jsx?$/,
    exclude: /node_modules/,
    use: [{ loader: "babel-loader" }]
};

rules.push(jsxRules);

module.exports = { module: { rules, }, };
