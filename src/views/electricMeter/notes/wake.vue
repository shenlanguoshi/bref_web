<template>
    <div class="app-container calendar-list-container">
        <basic-container>
            <el-row>
                <el-col :sm="8" :md="5">
                    <region @node-click="getRegion"></region>
                </el-col>
                <el-col :sm="16" :md="19">
                    <slot ref="item" :msg="itemId"></slot>
                </el-col>
            </el-row>

        </basic-container>
    </div>
</template>

<script>
    import region from "@/views/admin/region/tree";
    export default {
        name: "wake",
        components: {
            region
        },
        data() {
            return {
                itemId:11
            }
        },
        created() {

        },
        methods: {
            getRegion (data) {
                this.itemId=data.id;
                console.log(this.$refs)
                console.log(data)
                //this.$refs.item.getList(data.id)
            }
        }
    }
</script>

<style  lang="scss">
    .electricMeter {
        border:1px solid #EBEEF5;
        min-height: 200px;
        padding:5px;
    &:after{
         content:"";
         display: block;
         clear: both;

     }
    .pagination-container {

    }
    .box-card {
        width:380px;
        max-width: 100%;
        float:left;
        margin:5px;
    .el-card__header{
        padding:10px 20px
    }
    .no_b{
        margin:0;
    &.c{
         text-align: center;
     }
    &.r{
         text-align: right;
     }
    }
    .top_header{
    }
    .c_r{
        color:red;
    }
    .b_L{
        border-right:1px solid #F9F7F7;
    }
    .b_b{
        border-bottom:1px solid #F9F7F7;
    }
    }
    }
</style>