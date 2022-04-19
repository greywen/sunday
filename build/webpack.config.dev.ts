import path from "path";
import webpack from "webpack";
import HtmlWebpackPlugin from "html-webpack-plugin";
import { WebpackConfiguration } from "./webpack.config";

const config: WebpackConfiguration = {
    mode: "development",
    entry: "./src/index.tsx",
    output: {
        publicPath: "/",
        path: path.join(__dirname, "dist"),
    },
    devtool: "source-map",
    devServer: {
        historyApiFallback: true,
        port: 3000,
        open: true,
        hot: true
    },
    resolve: {
        extensions: [".tsx", ".ts", ".jsx", ".js"],
        alias: {
            "@layout": path.resolve(__dirname, "../src/layout"),
            "@pages": path.resolve(__dirname, "../src/pages"),
            "@components": path.resolve(__dirname, "../src/components"),
            "@hooks": path.resolve(__dirname, "../src/hooks"),
            "@utils": path.resolve(__dirname, "../src/utils"),
            "@apis": path.resolve(__dirname, "../src/apis"),
            "@servers": path.resolve(__dirname, "../src/servers"),
            "@interfaces": path.resolve(__dirname, "../src/interfaces"),
            "@common": path.resolve(__dirname, "../src/common"),
        }
    },
    module: {
        rules: [
            {
                test: /\.(ts|js)x?$/i,
                exclude: /node_modules/,
                use: {
                    loader: "babel-loader",
                    options: {
                        presets: [
                            // "@babel/preset-env",
                            "@babel/preset-react",
                            // fix babel-loader Unexpected token, expected ","
                            "@babel/preset-typescript",
                        ]
                    }
                }
            },
            {
                test: /\.(less|css)$/,
                use: [
                    {
                        loader: "style-loader",
                    },
                    {
                        loader: "css-loader",
                    },
                    {
                        loader: "less-loader",
                        options: {
                            lessOptions: {
                                // modifyVars: {
                                //     "primary-color": "#093d64",
                                //     "link-color": "#0c548a",
                                // },
                                javascriptEnabled: true
                            },
                        },
                    }
                ]
            },
            {
                test: /\.(png|jpg|gif|svg)$/,
                use: [
                    {
                        loader: "url-loader",
                        options: {
                            limit: 8192
                        }
                    }
                ]
            }
        ]
    },
    plugins: [
        new HtmlWebpackPlugin({
            template: "./src/index.html",
        }),
        new webpack.ProgressPlugin()
    ]
}

export default config;

