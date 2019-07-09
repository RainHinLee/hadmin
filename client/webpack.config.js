

/*--webpack 配置文件--*/

const path = require('path');
const fs = require('fs');
const webpack = require('webpack');
const stylus = require('stylus');
const nib = require('nib');
const config = require('./config.js');
const VueLoaderPlugin = require('vue-loader/lib/plugin')
const MiniCssExtractPlugin = require('mini-css-extract-plugin')
const StringReplacePlugin = require("string-replace-webpack-plugin");

const TYPE = process.argv.includes('--env.test') ? "test" : "release";
const PATTERNS = TYPE=="test" ? config.patterns.test : config.patterns.release;  //--- ajax请求api域名

//--- entry 入口文件
function getEntryFiles(){
	let result ={};
	let src = path.resolve(__dirname,`./src`);

	fs.readdirSync(src).forEach(item=>{
		if(item !=="public"){ //--public不发布
			let target = path.resolve(__dirname,`./src/${item}`);
			let files = fs.readdirSync(target);

			if(files.includes('main.js')){
				result[item] = `./src/${item}/main.js`;
			};
		};
	});

	return result;
};

//---输出文件
function getOutPutPath(){
	let paths = {
    'test' : path.resolve(__dirname,`../server/dist/`),
    'release' : path.resolve(__dirname,`../online/dist/`)
	}
	return paths[TYPE];
};


module.exports = {
  mode: "development",  // "production", // "development",  //
	entry: getEntryFiles(),
	output: {
		filename: "[name].js",
		path: getOutPutPath()
  },
  optimization: {
    splitChunks: {
      cacheGroups: {
        styles: {name: 'styles',test: /\.css$/, chunks: 'all',enforce: true},
      }
    }
  },

	watchOptions: {
    "ignored": /node_modules/
  },

  plugins:[
    new VueLoaderPlugin(),
		new StringReplacePlugin(), //--字符替换插件
    new webpack.LoaderOptionsPlugin({ //--配置stylus全局变量
      test: /\.vue/,
      stylus: {
        default: {
          use: [nib()],
          import:['~nib/lib/nib/index.styl',path.resolve(__dirname,`./theme/vars.styl`)]
        },
      },
   }),
   new MiniCssExtractPlugin({filename: '[name].css'})
  ],

	module:{ //--解析规则
		rules:[
			{
				test: /\.vue$/,
				use:[
					{loader:'vue-loader',options:{extractCSS: true}},
					{loader:StringReplacePlugin.replace({ replacements: PATTERNS})}
				]
      },
			{
				test: /\.js$/,
				use:[
					{loader:'babel-loader'},
					{loader:StringReplacePlugin.replace({ replacements: PATTERNS})}
				]
      },
      {
        test: /\.styl(us)?$/,
        use: ['vue-style-loader','css-loader','stylus-loader']
      },
      {
        test: /\.css$/,
        use: [process.env.NODE_ENV !== 'production'? 'vue-style-loader' : MiniCssExtractPlugin.loader,'css-loader']
      }
		]
	},

	resolve: {
		alias: {
			'api' : path.resolve(__dirname,`./src/public/api/index.js`),
			'util' : path.resolve(__dirname,`./src/public/util/index.js`),
		}
	}

}
