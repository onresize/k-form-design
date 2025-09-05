import http from '../utils/req'

// 查看表单列表
const findPage = (params = { page: 1, pageSize: 20 }) =>
  http({
    method: 'get',
    url: '/api-mes/quality/form/findPage',
    params,
  })

// 获取工序下拉列表
const getQualityNodeList = (params) =>
  http({
    method: 'get',
    url: '/api-mes/reportData/getQualityNodeList',
    params,
  })

// 新增模版
const saveOrUpdate = (data) =>
  http({
    method: 'post',
    url: '/api-mes/quality/form/saveOrUpdate',
    data,
  })

// 删除表单
const deleteList = (data) =>
  http({
    method: 'post',
    url: '/api-mes/quality/form/delete',
    data,
  })

export { findPage, getQualityNodeList, saveOrUpdate, deleteList }
