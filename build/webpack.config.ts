import webpack from 'webpack';
export interface WebpackConfiguration extends webpack.Configuration {
  devServer?: DevServerConfiguration;
}

interface DevServerConfiguration {
  port?: number;
  inline?: boolean;
  hot?: boolean;
  historyApiFallback?: boolean;
  open?: boolean;
}
