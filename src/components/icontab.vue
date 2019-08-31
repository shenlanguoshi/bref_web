<template>
    <span :style="{color:color}" v-if="$slots.default.length && $slots.default[0].text"><i v-if="showicon" :style="{background:color }"></i><slot></slot></span>
</template>

<script>
    export default {
        name: "icontab",
        props:{
            showicon:{
                type:Boolean,
                default:true
            },
            color:{
                type: String
            }
        },
    }
</script>

<style scoped lang="scss">
    i{
        display: inline-block;
        width: 6px;
        height: 6px;
        vertical-align: middle;
        border-radius: 6px;
        margin-right: 8px;
    }
</style>