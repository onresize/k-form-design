// 引入@babel/polyfill处理兼容
import '@babel/polyfill'

import Vue from 'vue'
import App from './App.vue'
import router from './router/'
import store from './store'
// import Cmp from "./components/CustomComponent/index.vue";

// 预加载组件
// import "../packages/core/preUseComponents";
// 懒加载组件
import { useAntd } from '../packages/core/useComponents'
import { nodeSchema } from '../packages/mini'
import KFormDesign from '../packages/use'
import { message, notification, Modal, Form } from 'ant-design-vue'

// const Cmp = {
//   label: 'cmp',
//   render: function(h) {
//     return h('div', '我是自定义组件')
//   },
// }

// // 添加字段
// nodeSchema.addSchemas(
// [
//   {
//     type: 'demo', // 表单类型
//     label: '自定义组件', // 标题文字
//     icon: 'icon-gallery',
//     component: Cmp,
//     options: {
//       defaultValue: undefined,
//       multiple: false,
//       disabled: false,
//       width: '100%',
//       clearable: true,
//       placeholder: '请选择',
//       showSearch: false,
//       showLabel: true,
//     },
//     model: '',
//     key: '',
//     rules: [
//       {
//         required: false,
//         message: '必填项',
//       },
//     ],
//   },
// ]
// )

// // 添加分组
// nodeSchema.addSchemaGroup({
//   title: '自定义组件',
//   list: ['demo'],
// })

Vue.use(KFormDesign)
useAntd(Vue)
// KFormDesign.setFormBuildConfig({
//   dynamicData: {
//     test: [
//       { label: "test", value: "1" },
//       { label: "test1", value: "2" }
//     ]
//   }
// });
Vue.config.productionTip = false
Vue.prototype.$message = message
Vue.prototype.$notification = notification
Vue.prototype.$info = Modal.info
Vue.prototype.$success = Modal.success
Vue.prototype.$error = Modal.error
Vue.prototype.$warning = Modal.warning
Vue.prototype.$confirm = Modal.confirm
Vue.prototype.$form = Form

new Vue({
  router,
  store,
  render: (h) => h(App),
}).$mount('#app')
