<template>
    <d2-container padding>
        <el-form :model="ruleForm"
                 :rules="rules"
                 ref="ruleForm"
                 style="max-width: 550px"
                 label-width="100px"
                 class="demo-ruleForm">
            <el-form-item label="用户名"
                          prop="username">
                <el-input type="text"
                          :value="ruleForm.username"
                          disabled></el-input>
            </el-form-item>
            <el-form-item label="原密码"
                          prop="password">
                <el-input type="password"
                          v-model="ruleForm.password"
                          auto-complete="off"></el-input>
            </el-form-item>
            <el-form-item label="密码"
                          prop="newpassword1">
                <el-input type="password"
                          v-model="ruleForm.newpassword1"
                          auto-complete="off"></el-input>
            </el-form-item>
            <el-form-item label="确认密码"
                          prop="newpassword2">
                <el-input type="password"
                          v-model="ruleForm.newpassword2"
                          auto-complete="off"></el-input>
            </el-form-item>
            <el-form-item>
                <el-button type="primary" class="btn_comm" plain @click="resetForm('ruleForm')">重置</el-button>
                <el-button type="primary" class="btn_comm"
                           @click="submitForm('ruleForm')">提交</el-button>

            </el-form-item>
        </el-form>
    </d2-container>
</template>

<script>
    //import { mapState } from 'vuex'

    export default {
        name: "index",
        data() {
            let validatePass = (rule, value, callback) => {
                if (this.ruleForm.password !== '') {
                    if (value === '') {
                        callback(new Error('请再次输入密码'))
                    } else if (value !== this.ruleForm.newpassword1) {
                        callback(new Error('两次输入密码不一致!'))
                    } else {
                        callback()
                    }
                } else {
                    callback()
                }
            };
            return {
                fileList: [],
                ruleForm: {
                    username: this.$store.state.d2admin.user.info.username,
                    password: '',
                    newpassword1: '',
                    newpassword2: ''
                },
                rules: {
                    password: [{ required: true, min: 6, message: '原密码不能为空且不少于6位', trigger: 'change' }],
                    newpassword1: [{ required: true, min: 6, message: '新密码不能为空且不少于6位', trigger: 'change' }],
                    newpassword2: [{ required: true, validator: validatePass, trigger: 'blur' }]
                }
            }
        },
        created() {

        },
        /*computed: {
            ...mapState({
                userInfo: state => state.d2admin.user.info
            })
        },*/
        methods: {
            submitForm(formName) {
                this.$refs[formName].validate(valid => {
                    if (valid) {

                    } else {
                        return false
                    }
                })
            },
            resetForm(formName) {
                this.$refs[formName].resetFields()
            },
        }
    }
</script>

<style scoped lang="scss">

</style>