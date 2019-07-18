<template>
    <div>
        <div class="electricMeter"
             v-loading="listLoading"
             element-loading-text="给我一点时间">
            <div v-if="!listLoading && !list" class="el-table__empty-block"><span class="el-table__empty-text">暂无数据</span></div>
            <one v-for="item in list" :key="item.id" :msg="item"></one>
        </div>
        <div v-show="!listLoading"
             class="pagination-container">
            <el-pagination @size-change="handleSizeChange"
                           @current-change="handleCurrentChange"
                           :current-page.sync="listQuery.pageNo"
                           :page-sizes="[5,10,20,30, 50]"
                           :page-size="listQuery.pageSize"
                           layout="total, sizes, prev, pager, next, jumper"
                           :total="listQuery.total">
            </el-pagination>
        </div>
    </div>
</template>

<script>
    import {getData} from "@/api/electricMeter/data";
    import one from "./one";
    export default {
        name: "item",
        props: ['msg'],
        directives: {},
        components: {one},
        data() {
            return {
                listQuery: {
                    total: null,
                    pageNo: 1,
                    pageSize: 5,
                    id:this.msg
                },
                list:null,
                listLoading:false
            }
        },
        created() {
            //this.getList();
        },
        methods: {
            getList (id) {
                if(id){
                    this.listQuery.id=id;
                }
                this.listLoading = true;
                this.listQuery.isAsc = false;
                getData(this.listQuery).then(response => {
                    if(response.data.success){
                        this.list = response.data.data.list;
                        this.listQuery.total = response.data.data.total;
                    }else{
                        this.$message.error({message: response.data.message});
                        this.list=null;
                        this.total=null;
                    }
                    this.listLoading = false;
                });
            },
            handleSizeChange (val) {
                this.listQuery.pageSize = val;
                this.getList();
            },
            handleCurrentChange (val) {
                this.listQuery.pageNo = val;
                this.getList();
            },
        }
    }
</script>

<style  lang="scss">

</style>