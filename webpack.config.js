var webpack = require('webpack')
var HtmlWebpackPlugin = require('html-webpack-plugin')
var path = require('path')
var precss       = require('precss')
var autoprefixer = require('autoprefixer')
var doiuse = require('doiuse')

module.exports = {
    context:path.join(__dirname),
    devServer:{
        contentBase:path.join(__dirname),
        hot:true,
        inline:true
    },
    entry:[
       './client/index.js'
    ],
    output:{
        path:path.join(__dirname,'dist'),
        publicPath:'/'
    },
    module:{
        loaders:[
            {
                test:/\.jpeg$/,
                loader:'file-loader'
            },
            {
                test:/\.less$/,
                loader:'style-loader!css-loader!postcss-loader?sourceMap=inline&pack=cleaner!less-loader?lint&noIeCompat&strictImports&strictUnits'
            },
            {
                test:/\.js$/,
                loader:'babel?presets[]=es2015,presets[]=react',
                exclude:['/node_modules/']
            }
        ]
    },
    postcss: function () {
        return {
            defaults: [precss, autoprefixer],
            cleaner:  [autoprefixer()]
        };
    },
    plugins:[
        new webpack.HotModuleReplacementPlugin(),
        new HtmlWebpackPlugin({
			template:'./default_index.ejs'
		})
    ]
}
