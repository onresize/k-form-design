<template>
  <div class="content_box">
    <a-tabs v-model:activeKey="activeKey" @change="tabsChange">
      <a-tab-pane key="1" tab="通用表单" name="tabs1Flag">
        <a-table :dataSource="dataSource" :columns="columns" :pagination="customerTablePageConfig" size="small">
          <template slot="operation" slot-scope="text, record">
            <div>
              <a-button type="primary" size="small" ghost @click="editFunc(record)">编辑</a-button>
              <a-divider type="vertical" />
              <a-popconfirm title="确认删除吗？" cancelText="取消" okText="确认" @confirm="confirmFunc(record)">
                <a-button type="danger" size="small" ghost>删除</a-button>
              </a-popconfirm>
            </div>
          </template>
        </a-table>
      </a-tab-pane>
      <a-tab-pane key="2" tab="表单操作" name="tabs2Flag">
        <k-form-design hideResetHint @save="saveFunc" />
      </a-tab-pane>
    </a-tabs>

    <a-modal v-model="modalVisible" :title="mode + '表单'" cancelText="取消" okText="确认" centered @ok="toSubmit">
      <a-form :form="form">
        <a-form-item label="表单名称">
          <a-input placeholder="请输入" v-decorator="[
            'formName',
            { rules: [{ required: true, message: '表单名称不能为空' }] },
          ]" />
        </a-form-item>
        <a-form-item label="工序">
          <a-select placeholder="请选择" v-decorator="[
            'nodeId',
            { rules: [{ required: true, message: '请选择工序' }] },
          ]" style="width: 200px;" @change="handleChange">

            <a-select-option v-for="item in selectList" :key="item.strId" :value="item.strId">
              {{ item.nodeName }}
            </a-select-option>
          </a-select>
        </a-form-item>
        <a-form-item label="描述">
          <a-input placeholder="请输入" type="textarea" v-decorator="[
            'description',
            { rules: [{ required: false, message: '' }] },
          ]" />
        </a-form-item>
      </a-form>
    </a-modal>
  </div>
</template>

<script>
import { tool } from '../../utils/tools'
import { findPage, getQualityNodeList, saveOrUpdate, deleteList } from '../../api/index'

export default {
  data() {
    return {
      customerTablePageConfig: {
        total: 0, // 总数据
        pageSize: 20,  // 每页条数
        current: 1, // 当前页
        showTotal: (total) => `共 ${total} 条`, // 显示多少页
        showQuickJumper: true, // 是否显示跳转页面
        showSizeChanger: true, // 是否开启分页数据条数
        pageSizeOptions: ['20', '50', '100', '200'],  // 分页每页显示条数
      },
      form: this.$form.createForm(this, { name: 'dynamic_rule' }),
      modalVisible: false,
      params: {
        page: 1,
        pageSize: 20
      },
      activeKey: '1',
      dataSource: [],
      columns: [
        {
          title: '表单名称',
          dataIndex: 'formName',
          key: 'formName',
          width: '250px'
        },
        {
          title: '创建时间',
          dataIndex: 'createTime',
          key: 'createTime',
          align: 'center',
          width: '200px'
        },
        {
          title: '创建人',
          dataIndex: 'createBy',
          key: 'createBy',
          align: 'center',
          width: '300px'
        },
        {
          title: '描述',
          dataIndex: 'description',
          key: 'description',
        },
        {
          title: '操作',
          key: 'operation',
          scopedSlots: { customRender: 'operation' },
          align: 'center',
          width: '200px'
        },
      ],
      tmpJson: '',
      Gid: null,
      selectList: [],
      mode: '新增'
    }
  },
  methods: {
    async confirmFunc(record) {
      console.log('删除值：', record)

      const res = await deleteList({ id: record.id || '' })
      if (res.code == 200) {
        this.getTable()
      } else {
        this.$message.error('出错了')
      }
    },
    handleChange(value) {
      console.log(`selected ${value}`);
    },
    tabsChange(ket) {
      this.$store.dispatch('setTmpTableRowListActiveData', {})

      if (ket == '1') {
        this.getTable()
      }

      if (ket == '2') {
        this.Gid = null
        this.tmpJson = {}
      }
    },
    editFunc(record) {
      this.$store.dispatch('setTmpTableRowListActiveData', record)
      // console.log('编辑信息拿到的行json：', editorJsonData)

      this.activeKey = '2'
    },
    async toSubmit() {
      let reqData = {}
      this.form.validateFields(async (err, subMitData) => {
        if (!err) {
          reqData = {
            ...subMitData,
            id: this.Gid,
            dataJson: JSON.stringify(this.tmpJson)
          }
          console.log('上传前的表单值: ', reqData);

          const res = await saveOrUpdate(reqData)

          if (res.code == 200) {
            this.modalVisible = false
            this.$message.success('操作成功')
            this.activeKey = '1'
            this.getTable()
          } else {
            this.$message.error('出错了')
          }
        }
      });
    },
    async getTable() {
      const res = await findPage(this.params)
      console.log('获取列表数据：', res.data.rows)
      if (res.code == 200) {
        this.dataSource = res.data.rows.map((item) => ({
          ...item,
          key: item.id
        }))
      }
    },
    async getSelectList() {
      const res = await getQualityNodeList()
      console.log('获取工序下拉数据：', res)
      if (res.code == 200) {
        this.selectList = res.data
      }
    },
    // 保存
    saveFunc(rowData) {
      console.log('拿到列表行数据:', rowData)
      this.modalVisible = true
      this.getSelectList()
      this.form.resetFields();

      this.Gid = rowData.id || null
      this.mode = rowData.id ? '编辑' : '新增'

      if (rowData.id) {
        // 编辑
        this.tmpJson = JSON.parse(rowData.dataJson)
        this.$nextTick(() => {
          this.form.setFieldsValue({
            formName: rowData.formName,
            nodeId: rowData.nodeId,
            description: rowData.description,
          })
        });
      } else {
        // 新增
        this.tmpJson = JSON.parse(rowData.dataJson)
      }
    }
  },
  mounted() {
    let that = this
    window.addEventListener('message', function (event) {
      if (typeof event.data.tk === 'string') {
        console.log('子页面监听mes父页面data：', event.data)
        const tk = JSON.parse(event.data.tk)
        const permission = JSON.parse(event.data.permission)

        tool.data.set('tk', tk)
        tool.data.set('permission', permission)

        that.$nextTick(() => {
          that.getTable()
        })
      }
    })
  },
}
</script>

<style scoped></style>
