<template>
  <div class="container">
    <h3>新建开放场地</h3>
    <el-form class="newField" ref="newField" :rules="newFieldRules" label-position="left"
             :model="newField">
      <el-form-item label="场地名称" prop="name">
        <el-input class="newFieldName" placeholder="请输入场地名称..." v-model="newField.name"></el-input>
      </el-form-item>
      <el-form-item label="开放日期" prop="date">
        <el-date-picker class="newFieldDate" v-model="newField.date"></el-date-picker>
      </el-form-item>
      <el-form-item>
        <el-button class="newField-btn" type="primary" @click="createField">新建活动场地</el-button>
      </el-form-item>
    </el-form>

    <h3>现开放的场地 </h3>
    <el-table :data="activities" style="width: 100%">
      <el-table-column prop="id" label="场地编号"></el-table-column>
      <el-table-column prop="date" label="开放日期"></el-table-column>
      <el-table-column prop="name" label="场地名称"></el-table-column>
      <el-table-column prop="status" label="场地状态"></el-table-column>
    </el-table>
  </div>
</template>

<script>
  export default {
    name   : "allActivity",
    data() {
      return {
        activities   : [],
        newField     : {
          name: '',
          date: ''
        },
        newFieldRules: {
          name: [
            {required: true, message: '请输入场地名称', trigger: 'blur'},
            {min: 1, max: 10, message: '社团名称应该为 1 到 10 字！', trigger: 'blur'}
          ],
          date: [
            {type: 'date', required: true, message: '请选择开放日期', trigger: 'change'}
          ],
        }
      }
    },
    methods: {
      createField() {
        this.$refs['newField'].validate((valid) => {
          if (valid) {
            this.$.ajax.post('/allActivity', JSON.stringify({
              name: this.newField.name,
              date: this.newField.date.toLocaleDateString(),
            })).then(res => {
              this.$message.success('新场地创建成功！');
              this.activities.unshift({
                ...this.newField,
                id    : '（刷新后获得）',
                status: '空闲',
              });
              this.newField = {};
            }, err => {
              this.$message.error('提交申请失败：' + err.msg);
            })
          }
        });
      }
    },
    created() {
      this.$.ajax.get('/allActivity').then(res => {
        console.log('所有活动场地：', res);
        this.activities = res.map(i => ({
          ...i,
          date  : new Date(i.date).format('YYYY年MM月DD日'),
          status: i.status === 'IDLE' ? '空闲' : '已占用'//偷懒
        })).reverse();
      })
    }
  }
</script>

<style lang="stylus" scoped>
  .newField
    .newFieldName
      width 30%
    .newFieldDate
      width 30%
    .newField-btn
      margin-left 8em


</style>
