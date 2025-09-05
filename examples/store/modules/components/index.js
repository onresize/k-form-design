import Vue from 'vue'

const components = {
  state: {
    tmpTableRowActiveData: {}, // 暂存表单列表行数据
  },
  actions: {
    setTmpTableRowListActiveData({ commit }, data) {
      commit('SET_JSON_DATA', data)
    },
  },
  mutations: {
    SET_JSON_DATA(state, data) {
      state.tmpTableRowActiveData = data
    },
  },
}

export default components
