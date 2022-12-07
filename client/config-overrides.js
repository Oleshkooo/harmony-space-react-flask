const { alias } = require('react-app-rewire-alias')

const override = (config, env) => {
    alias({
        '@': './src',
        '@components': './src/components',
        '@hoc': './src/hoc',
        '@pages': './src/pages',
        '@styles': './src/styles',
        '@hooks': './src/hooks',
        '@utils': './src/utils',
        '@assets': './src/assets',
        '@context': './src/context',
        '@store': './src/store',
    })(config)

    return config
}
module.exports = override