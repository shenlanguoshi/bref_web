<template>
    <div class="app-container calendar-list-container">
        <basic-container>
            <el-row>
                <el-col :sm="8" :md="5">
                    <region @node-click="getRegion"></region>
                </el-col>
                <el-col :sm="16" :md="19">
                    <item ref="$item" :msg="itemId"></item>
                </el-col>
            </el-row>

        </basic-container>
    </div>
</template>

<script>
    import region from "@/views/admin/region/tree";
    import item from "./item";
    export default {
        name: "index",
        props: [],
        directives: {},
        components: {
            region,
            item
        },
        data() {
            return {
                itemId:null
            }
        },
        created() {

        },
        methods: {
            getRegion (data) {
                this.itemId=data.id;
                this.$refs.$item.getList(data.id)
            }
        }
    }
</script>

<style scoped>

</style>