import Vue from 'vue'
import App from './App.vue'
import router from './router.js';
// Require Froala Editor js file.
require('froala-editor/js/froala_editor.pkgd.min.js')

// Require Froala Editor css files.
require('froala-editor/css/froala_editor.pkgd.min.css')
require('froala-editor/css/froala_style.min.css')

// Import and use Vue Froala lib.
import VueFroala from 'vue-froala-wysiwyg'
Vue.use(VueFroala)

Vue.config.productionTip = false

new Vue({
	router,
  render: h => h(App),
}).$mount('#app')

// 报错原因: new Vue({}) 里面应该写成router,才能被简写识别