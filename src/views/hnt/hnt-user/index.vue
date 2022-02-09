<template>
  <BasicLayout>
    <template #wrapper>
      <el-card class="box-card">
        <el-form ref="queryForm" :model="queryParams" :inline="true" label-width="68px">
          <el-form-item label="用户名" prop="username">
            <el-input v-model="queryParams.username" placeholder="请输入用户名" clearable
                      size="small" @keyup.enter.native="handleQuery"/>
          </el-form-item>
          <el-form-item label="邮件" prop="email">
            <el-input v-model="queryParams.email" placeholder="请输入邮件" clearable
                      size="small" @keyup.enter.native="handleQuery"/>
          </el-form-item>
          <el-form-item label="电话号码" prop="mobile">
            <el-input v-model="queryParams.mobile" placeholder="请输入电话号码" clearable
                      size="small" @keyup.enter.native="handleQuery"/>
          </el-form-item>


          <el-form-item label="状态" prop="status">
            <el-select
              v-model="queryParams.status"
              placeholder="用户状态"
              clearable
              size="small"
              style="width: 160px"
            >
              <el-option
                v-for="dict in statusOptions"
                :key="dict.value"
                :label="dict.label"
                :value="dict.value"
              />
            </el-select>
          </el-form-item>

          <el-form-item>
            <el-button type="primary" icon="el-icon-search" size="mini" @click="handleQuery">搜索</el-button>
            <el-button icon="el-icon-refresh" size="mini" @click="resetQuery">重置</el-button>
          </el-form-item>
        </el-form>

        <el-row :gutter="10" class="mb8">
          <el-col :span="1.5">
            <el-button
              v-permisaction="['hnt:hntUser:add']"
              type="primary"
              icon="el-icon-plus"
              size="mini"
              @click="handleAdd"
            >新增
            </el-button>
          </el-col>
          <el-col :span="1.5">
            <el-button
              v-permisaction="['hnt:hntUser:edit']"
              type="success"
              icon="el-icon-edit"
              size="mini"
              :disabled="single"
              @click="handleUpdate"
            >修改
            </el-button>
          </el-col>
          <el-col :span="1.5">
            <el-button
              v-permisaction="['hnt:hntUser:remove']"
              type="danger"
              icon="el-icon-delete"
              size="mini"
              :disabled="multiple"
              @click="handleDelete"
            >删除
            </el-button>
          </el-col>
        </el-row>

        <el-table v-loading="loading" :data="hntUserList" @selection-change="handleSelectionChange">
          <el-table-column type="selection" width="55" align="center"/>
          <el-table-column label="用户名" align="center" prop="username" :show-overflow-tooltip="true"/>
          <el-table-column label="邮件" align="center" prop="email" :show-overflow-tooltip="true"/>
          <el-table-column label="电话号码" align="center" prop="mobile" :show-overflow-tooltip="true"/>
          <el-table-column label="状态" width="80" sortable="custom">
            <template slot-scope="scope">
              <el-switch
                v-model="scope.row.status"
                active-value="2"
                inactive-value="1"
                @change="handleStatusChange(scope.row)"
              />
            </template>
          </el-table-column>
          <el-table-column label="操作" align="center" class-name="small-padding fixed-width">
            <template slot-scope="scope">
              <el-popconfirm
                class="delete-popconfirm"
                title="确认要修改吗?"
                confirm-button-text="修改"
                @onConfirm="handleUpdate(scope.row)"
              >
                <el-button
                  slot="reference"
                  v-permisaction="['hnt:hntUser:edit']"
                  size="mini"
                  type="text"
                  icon="el-icon-edit"
                >修改
                </el-button>
              </el-popconfirm>
              <el-popconfirm
                class="delete-popconfirm"
                title="确认要删除吗?"
                confirm-button-text="删除"
                @onConfirm="handleDelete(scope.row)"
              >
                <el-button
                  slot="reference"
                  v-permisaction="['hnt:hntUser:remove']"
                  size="mini"
                  type="text"
                  icon="el-icon-delete"
                >删除
                </el-button>
              </el-popconfirm>
            </template>
          </el-table-column>
        </el-table>

        <pagination
          v-show="total>0"
          :total="total"
          :page.sync="queryParams.pageIndex"
          :limit.sync="queryParams.pageSize"
          @pagination="getList"
        />

        <!-- 添加或修改对话框 -->
        <el-dialog :title="title" :visible.sync="open" width="500px">
          <el-form ref="form" :model="form" :rules="rules" label-width="80px">

            <el-form-item label="用户名" prop="username">
              <el-input v-model="form.username" placeholder="用户名"
              />
            </el-form-item>
            <el-form-item label="邮件" prop="email">
              <el-input v-model="form.email" placeholder="邮件"
              />
            </el-form-item>
            <el-form-item label="电话号码" prop="mobile">
              <el-input v-model="form.mobile" placeholder="电话号码"
              />
            </el-form-item>
            <el-form-item label="数据库连接">
              <el-select v-model="form.connectionId" placeholder="请选择" @change="$forceUpdate()">
                <el-option
                  v-for="item in hntConnectionOptions"
                  :key="item.id"
                  :label="item.name"
                  :value="item.id"
                  :disabled="item.status == 1"
                />
              </el-select>
            </el-form-item>
            <el-form-item label="报告">
              <el-select v-model="form.reportId" placeholder="请选择" @change="$forceUpdate()">
                <el-option
                  v-for="item in hntReportOptions"
                  :key="item.id"
                  :label="item.name"
                  :value="item.id"
                  :disabled="item.status == 1"
                />
              </el-select>
            </el-form-item>
            <el-form-item label="状态">
              <el-radio-group v-model="form.status">
                <el-radio
                  v-for="dict in statusOptions"
                  :key="dict.value"
                  :label="dict.value"
                >{{ dict.label }}
                </el-radio>
              </el-radio-group>
            </el-form-item>
          </el-form>
          <div slot="footer" class="dialog-footer">
            <el-button type="primary" @click="submitForm">确 定</el-button>
            <el-button @click="cancel">取 消</el-button>
          </div>
        </el-dialog>
      </el-card>
    </template>
  </BasicLayout>
</template>

<script>
import {addHntUser, delHntUser, getHntUser, listHntUser, updateHntUser, changeHntUserStatus} from '@/api/hnt/hnt-user'
import {listHntConnection} from '@/api/hnt/hnt-connection';
import {listHntReport} from '@/api/hnt/hnt-report';

export default {
  name: 'HntUser',
  components: {},
  data() {
    return {
      // 遮罩层
      loading: true,
      // 选中数组
      ids: [],
      // 非单个禁用
      single: true,
      // 非多个禁用
      multiple: true,
      // 总条数
      total: 0,
      // 弹出层标题
      title: '',
      // 是否显示弹出层
      open: false,
      isEdit: false,
      // 状态数据字典
      // HNT用户列表
      hntReportOptions: [],
      hntConnectionOptions: [],
      statusOptions: [],
      // 类型数据字典
      typeOptions: [],
      hntUserList: [],

      // 关系表类型

      // 查询参数
      queryParams: {
        pageIndex: 1,
        pageSize: 10,
        username: undefined,
        email: undefined,
        mobile: undefined,
        status: undefined

      },
      // 表单参数
      form: {},
      // 表单校验
      rules: {
        username: [{required: true, message: '用户名不能为空', trigger: 'blur'}],
        email: [{required: true, message: '邮件不能为空', trigger: 'blur'}],
        mobile: [{required: true, message: '电话号码不能为空', trigger: 'blur'}],
        status: [{required: true, message: '状态不能为空', trigger: 'blur'}],
        connectionId: [{required: true, message: '数据库连接不能为空', trigger: 'blur'}],
        reportId: [{required: true, message: '报告不能为空', trigger: 'blur'}]
      }
    }
  },
  created() {
    this.getList()
    this.getDicts('sys_normal_disable').then(response => {
      this.statusOptions = response.data
    })

    listHntConnection({pageSize: 1000}).then(response => {
      this.hntConnectionOptions = response.data.list
    })

    listHntReport({pageSize: 1000}).then(response => {
      this.hntReportOptions = response.data.list
    })
  },
  methods: {
    /** 查询参数列表 */
    getList() {
      this.loading = true
      listHntUser(this.addDateRange(this.queryParams, this.dateRange)).then(response => {
          this.hntUserList = response.data.list
          this.total = response.data.count
          this.loading = false
        }
      )
    },
    reportFormat(row, column) {
      // alert(JSON.stringify(this.hntUserOptions))
      // alert(JSON.stringify(row.userId))
      for (const oneReport of this.hntReportOptions) {
        if (oneReport.id === row.reportId) {
          return oneReport.name
        }
      }
      return ''
    },
    connectionFormat(row, column) {
      // alert(JSON.stringify(this.hntUserOptions))
      // alert(JSON.stringify(row.userId))
      for (const oneConnection of this.hntConnectionOptions) {
        if (oneConnection.id === row.conectionId) {
          return oneConnection.name
        }
      }
      return ''
    },
    // 取消按钮
    cancel() {
      this.open = false
      this.reset()
    },
    // 表单重置
    reset() {
      this.form = {

        id: undefined,
        username: undefined,
        email: undefined,
        mobile: undefined,
        status: undefined
      }
      this.resetForm('form')
    },
    getImgList: function () {
      this.form[this.fileIndex] = this.$refs['fileChoose'].resultList[0].fullUrl
    },
    fileClose: function () {
      this.fileOpen = false
    },
    // 关系
    // 文件
    /** 搜索按钮操作 */
    handleQuery() {
      this.queryParams.pageIndex = 1
      this.getList()
    },
    /** 重置按钮操作 */
    resetQuery() {
      this.dateRange = []
      this.resetForm('queryForm')
      this.handleQuery()
    },
    /** 新增按钮操作 */
    handleAdd() {
      this.reset()
      this.open = true
      this.title = '添加HNT用户管理'
      this.isEdit = false

      listHntConnection({pageSize: 1000}).then(response => {
        this.hntConnectionOptions = response.data.list
      })

      listHntReport({pageSize: 1000}).then(response => {
        this.hntReportOptions = response.data.list
      })
    },
    // 多选框选中数据
    handleSelectionChange(selection) {
      this.ids = selection.map(item => item.id)
      this.single = selection.length !== 1
      this.multiple = !selection.length
    },
    /** 修改按钮操作 */
    handleUpdate(row) {
      this.reset()
      const id =
        row.id || this.ids
      getHntUser(id).then(response => {
        this.form = response.data
        this.open = true
        this.title = '修改HNT用户管理'
        this.isEdit = true
      })

      listHntConnection({pageSize: 1000}).then(response => {
        this.hntConnectionOptions = response.data.list
      })

      listHntReport({pageSize: 1000}).then(response => {
        this.hntReportOptions = response.data.list
      })

    },
    // 用户状态修改
    handleStatusChange(row) {
      const text = row.status === '2' ? '启用' : '停用'
      this.$confirm('确认要"' + text + '""' + row.username + '"用户吗?', '警告', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(function () {
        return changeHntUserStatus(row)
      }).then(() => {
        this.msgSuccess(text + '成功')
      }).catch(function () {
        row.status = row.status === '2' ? '1' : '2'
      })
    },
    /** 提交按钮 */
    submitForm: function () {
      this.$refs['form'].validate(valid => {
        if (valid) {
          if (this.form.id !== undefined) {
            updateHntUser(this.form).then(response => {
              if (response.code === 200) {
                this.msgSuccess(response.msg)
                this.open = false
                this.getList()
              } else {
                this.msgError(response.msg)
              }
            })
          } else {
            addHntUser(this.form).then(response => {
              if (response.code === 200) {
                this.msgSuccess(response.msg)
                this.open = false
                this.getList()
              } else {
                this.msgError(response.msg)
              }
            })
          }
        }
      })
    },
    /** 删除按钮操作 */
    handleDelete(row) {
      var Ids = (row.id && [row.id]) || this.ids

      this.$confirm('是否确认删除编号为"' + Ids + '"的数据项?', '警告', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(function () {
        return delHntUser({'ids': Ids})
      }).then((response) => {
        if (response.code === 200) {
          this.msgSuccess(response.msg)
          this.open = false
          this.getList()
        } else {
          this.msgError(response.msg)
        }
      }).catch(function () {
      })
    }
  }
}
</script>
