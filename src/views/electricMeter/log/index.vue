<template>
    <div class="app-container calendar-list-container">
        <basic-container>
            <div class="filter-container">
                <el-row :gutter="10">
                    <el-col :sm="10" :lg="10" :xl="10">
                        <el-date-picker
                                v-model="dateS"
                                type="datetimerange"
                                style="width: 300px;"
                                size="small"
                                unlink-panels
                                value-format="yyyy-MM-dd HH:mm:ss"
                                range-separator="-"
                                :picker-options="pickerOptions"
                                start-placeholder="开始日期"
                                end-placeholder="结束日期">
                        </el-date-picker>
                    </el-col>
                    <el-col :sm="14" :lg="14" :xl="14">
                        <el-button class="filter-item"
                                   type="primary"
                                   size="small"
                                   v-waves
                                   icon="el-icon-search"
                                   @click="handleFilter">搜索</el-button>
                    </el-col>
                </el-row>
            </div>
            <el-table :key='tableKey'
                      ref="singleTable"
                      :data="list"
                      v-loading="listLoading"
                      element-loading-text="给我一点时间"
                      border
                      fit
                      highlight-current-row
                      style="width: 99%">

                <el-table-column align="center"
                                 type="index"
                                 width="50"
                                 label="序号">
                    <template scope="scope">
                        <span>{{scope.$index+(listQuery.pageNo - 1) * listQuery.pageSize + 1}} </span>
                    </template>
                </el-table-column>
                <el-table-column align="center"
                                 label="产品key">
                    <template slot-scope="scope">
                        <span>{{scope.row.productKey}} </span>
                    </template>
                </el-table-column>
                <el-table-column align="center"
                                 label="设备名称">
                    <template slot-scope="scope">
                        <span>{{scope.row.deviceName}} </span>
                    </template>
                </el-table-column>
                <el-table-column align="center"
                                 label="电表名称">
                    <template slot-scope="scope">
                        <span>{{scope.row.electricMeterName}} </span>
                    </template>
                </el-table-column>
                <el-table-column align="center"
                                 label="告警类型">
                    <template slot-scope="scope">
                        <span>{{scope.row.identifier}} </span>
                    </template>
                </el-table-column>
                <el-table-column align="center"
                                 label="漏电电流">
                    <template slot-scope="scope">
                        <span>{{scope.row.l}} </span>
                    </template>
                </el-table-column>
                <el-table-column align="center"
                                 label="数据入库时间">
                    <template slot-scope="scope">
                        <span>{{scope.row.createTime | parseTime('{y}-{m}-{d} {h}:{i}')}}</span>
                    </template>
                </el-table-column>
            </el-table>

            <div v-show="!listLoading"
                 class="pagination-container">
                <el-pagination @size-change="handleSizeChange"
                               @current-change="handleCurrentChange"
                               :current-page.sync="listQuery.pageNo"
                               :page-sizes="[10,20,30, 50]"
                               :page-size="listQuery.pageSize"
                               layout="total, sizes, prev, pager, next, jumper"
                               :total="listQuery.total">
                </el-pagination>
            </div>
        </basic-container>

    </div>
</template>

<script>
    import {getLog} from "@/api/electricMeter/data";
    import {deepClone} from "@/util/util";
    import waves from "@/directive/waves/index.js"; // 水波纹指令
    export default {
        name: "index",
        props: [],
        directives: {
            waves
        },
        components: {},
        data() {
            return {
                list: null,
                listLoading: true,
                dateS:null,
                listQuery: {
                    total: null,
                    pageNo: 1,
                    pageSize: 10,
                    productKey:this.$route.query.productKey,
                    deviceName:this.$route.query.deviceName,
                    beginTime:'',
                    endTime:''
                },
                pickerOptions:{
                    disabledDate(time){
                        return time.getTime() > Date.now();
                    }
                },
                tableKey: 0
            }
        },
        beforeRouteUpdate (to, from, next) {
            this.listQuery.productKey = to.query.productKey;
            this.listQuery.deviceName = to.query.deviceName;
            this.getList();
            next()
        },
        created() {
            this.getList();
        },
        methods: {getList () {
                this.listLoading = true;
                getLog(this.listQuery).then(response => {
                    if(response.data.success){
                        this.list = response.data.data.list;
                        this.listQuery.total = response.data.data.total;
                    }else{
                        this.$message.error({message: response.data.message});
                        this.list=null;
                        this.listQuery.total=null;
                    }
                    this.listLoading = false;
                });
            },
            handleFilter () {
                if(this.dateS){
                    this.listQuery.beginTime=this.dateS[0];
                    this.listQuery.endTime=this.dateS[1];
                }else{
                    this.listQuery.beginTime="";
                    this.listQuery.endTime="";
                }
                this.listQuery.page = 1;
                this.getList();
            },
            handleSizeChange (val) {
                this.listQuery.pageSize = val;
                this.getList();
            },
            handleCurrentChange (val) {
                this.listQuery.page = val;
                this.getList();
            },
        }
    }
</script>

<style scoped lang="scss">

</style>