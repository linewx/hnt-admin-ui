
<template>
    <BasicLayout>
        <template #wrapper>
            <el-card class="box-card">
                <el-form ref="queryForm" :model="queryParams" :inline="true" label-width="68px">
                    
                    <el-form-item>
                        <el-button type="primary" icon="el-icon-search" size="mini" @click="handleQuery">搜索</el-button>
                        <el-button icon="el-icon-refresh" size="mini" @click="resetQuery">重置</el-button>
                    </el-form-item>
                </el-form>

                <el-row :gutter="10" class="mb8">
                    <el-col :span="1.5">
                        <el-button
                                v-permisaction="['hnt:hntConnection:add']"
                                type="primary"
                                icon="el-icon-plus"
                                size="mini"
                                @click="handleAdd"
                        >新增
                        </el-button>
                    </el-col>
                    <el-col :span="1.5">
                        <el-button
                                v-permisaction="['hnt:hntConnection:edit']"
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
                                v-permisaction="['hnt:hntConnection:remove']"
                                type="danger"
                                icon="el-icon-delete"
                                size="mini"
                                :disabled="multiple"
                                @click="handleDelete"
                        >删除
                        </el-button>
                    </el-col>
                </el-row>

                <el-table v-loading="loading" :data="hntConnectionList" @selection-change="handleSelectionChange">
                    <el-table-column type="selection" width="55" align="center"/><el-table-column label="连接名称" align="center" prop="name"
                                                 :show-overflow-tooltip="true"/><el-table-column label="主机名" align="center" prop="host"
                                                 :show-overflow-tooltip="true"/><el-table-column label="状态" align="center" prop="status"
                                                 :formatter="statusFormat" width="100">
                                    <template slot-scope="scope">
                                        {{ statusFormat(scope.row) }}
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
                             v-permisaction="['hnt:hntConnection:edit']"
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
                              v-permisaction="['hnt:hntConnection:remove']"
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
                        
                                    <el-form-item label="连接名称" prop="name">
                                        <el-input v-model="form.name" placeholder="连接名称"
                                                      />
                                    </el-form-item>
                                    <el-form-item label="连接类型" prop="dbtype">
                                        <el-select v-model="form.dbtype"
                                                       placeholder="请选择" >
                                                <el-option
                                                        v-for="dict in dbtypeOptions"
                                                        :key="dict.value"
                                                        :label="dict.label"
                                                        :value="dict.value"
                                                />
                                            </el-select>
                                    </el-form-item>
                                    <el-form-item label="用户名" prop="username">
                                        <el-input v-model="form.username" placeholder="用户名"
                                                      />
                                    </el-form-item>
                                    <el-form-item label="密码" prop="password">
                                        <el-input v-model="form.password" placeholder="密码"
                                                      />
                                    </el-form-item>
                                    <el-form-item label="主机名" prop="host">
                                        <el-input v-model="form.host" placeholder="主机名"
                                                      />
                                    </el-form-item>
                                    <el-form-item label="端口号" prop="port">
                                        <el-input v-model="form.port" placeholder="端口号"
                                                      />
                                    </el-form-item>
                                    <el-form-item label="状态" prop="status">
                                        <el-radio-group v-model="form.status">
                                                <el-radio
                                                        v-for="dict in statusOptions"
                                                        :key="dict.value"
                                                        :label="dict.value"
                                                >{{ dict.label }}</el-radio>
                                            </el-radio-group>
                                    </el-form-item>
                                    <el-form-item label="是否默认" prop="isDefault">
                                        <el-radio-group v-model="form.isDefault">
                                                <el-radio
                                                        v-for="dict in isDefaultOptions"
                                                        :key="dict.value"
                                                        :label="dict.value"
                                                >{{ dict.label }}</el-radio>
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
    import {addHntConnection, delHntConnection, getHntConnection, listHntConnection, updateHntConnection} from '@/api/hnt/hnt-connection'
    
    export default {
        name: 'HntConnection',
        components: {
        },
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
                // 类型数据字典
                typeOptions: [],
                hntConnectionList: [],
                dbtypeOptions: [],statusOptions: [],isDefaultOptions: [],
                // 关系表类型
                
                // 查询参数
                queryParams: {
                    pageIndex: 1,
                    pageSize: 10,
                    
                },
                // 表单参数
                form: {
                },
                // 表单校验
                rules: {}
        }
        },
        created() {
            this.getList()
            this.getDicts('db_type').then(response => {
                this.dbtypeOptions = response.data
            })
            this.getDicts('sys_normal_disable').then(response => {
                this.statusOptions = response.data
            })
            this.getDicts('sys_yes_no').then(response => {
                this.isDefaultOptions = response.data
            })
            },
        methods: {
            /** 查询参数列表 */
            getList() {
                this.loading = true
                listHntConnection(this.addDateRange(this.queryParams, this.dateRange)).then(response => {
                        this.hntConnectionList = response.data.list
                        this.total = response.data.count
                        this.loading = false
                    }
                )
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
                name: undefined,
                dbtype: undefined,
                username: undefined,
                password: undefined,
                host: undefined,
                port: undefined,
                status: undefined,
                isDefault: undefined,
            }
                this.resetForm('form')
            },
            getImgList: function() {
              this.form[this.fileIndex] = this.$refs['fileChoose'].resultList[0].fullUrl
            },
            fileClose: function() {
              this.fileOpen = false
            },
            dbtypeFormat(row) {
                return this.selectDictLabel(this.dbtypeOptions, row.dbtype)
            },
            statusFormat(row) {
                return this.selectDictLabel(this.statusOptions, row.status)
            },
            isDefaultFormat(row) {
                return this.selectDictLabel(this.isDefaultOptions, row.isDefault)
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
                this.title = '添加hnt数据库连接'
                this.isEdit = false
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
                getHntConnection(id).then(response => {
                    this.form = response.data
                    this.open = true
                    this.title = '修改hnt数据库连接'
                    this.isEdit = true
                })
            },
            /** 提交按钮 */
            submitForm: function () {
                this.$refs['form'].validate(valid => {
                    if (valid) {
                        if (this.form.id !== undefined) {
                            updateHntConnection(this.form).then(response => {
                                if (response.code === 200) {
                                    this.msgSuccess(response.msg)
                                    this.open = false
                                    this.getList()
                                } else {
                                    this.msgError(response.msg)
                                }
                            })
                        } else {
                            addHntConnection(this.form).then(response => {
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
                      return delHntConnection( { 'ids': Ids })
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
