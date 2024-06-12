const { defineConfig } = require('@vue/cli-service')
module.exports = defineConfig({
  publicPath:'/HVue/dist',
  transpileDependencies: [
    'vuetify'
  ]
})
