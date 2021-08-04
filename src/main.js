// The Vue build version to load with the `import` command
// (runtime-only or standalone) has been set in webpack.base.conf with an alias.
import Vue from 'vue'
import App from './App'

import VueFroala from "vue-froala-wysiwyg";
import $ from "jquery";

import "font-awesome/css/font-awesome.min.css";
import "froala-editor/css/froala_style.min.css";
import "froala-editor/css/froala_editor.pkgd.min.css";
import "froala-editor/js/froala_editor.pkgd.min.js";
import 'tributejs/dist/tribute.css';
import 'bootstrap/dist/css/bootstrap.css'
window.$ = $;

Vue.config.productionTip = false;
Vue.use(VueFroala);

/* eslint-disable no-new */
new Vue({
  el: "#app",
  components: { App },
  template: "<App/>"
});