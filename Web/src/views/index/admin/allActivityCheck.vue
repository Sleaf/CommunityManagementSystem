<template>
  <el-table :data="activityApplications" style="width: 100%">
    <el-table-column prop="created_time" label="申请日期" width="150"></el-table-column>
    <el-table-column prop="field_id" label="场地编号"></el-table-column>
    <el-table-column prop="field_name" label="场地名称"></el-table-column>
    <el-table-column prop="date" label="活动日期" width="150"></el-table-column>
    <el-table-column prop="community_name" label="申请社团名称"></el-table-column>
    <el-table-column label="申请状态" width="180">
      <template slot-scope="scope">
        <div v-if="scope.row.status==='PADDING'">
          <el-button type="success" @click="passApplication(scope.row.id)">通过</el-button>
          <el-button type="danger" @click="rejectApplication(scope.row.id,scope.$index)">拒绝</el-button>
        </div>
        <div v-else>
          {{scope.row.status|statusString}}
        </div>
      </template>
    </el-table-column>
  </el-table>
</template>

<script>
  export default {
    name   : "allActivityCheck",
    data() {
      return {
        activityApplications: []
      }
    },
    filters: {
      statusString(value) {
        switch (value) {
          case 'PASSED':
            return '申请通过';
          default:
            return '已回绝';
        }
      }
    },
    methods: {
      passApplication(id) {
        this.$confirm('通过后将自动拒绝其他选择该场地的社团', '确认通过？').then(_ => {
          const loading = this.$loading({
            lock      : true,
            text      : '提交申请中...',
            spinner   : 'el-icon-loading',
            background: 'rgba(0, 0, 0, 0.7)'
          });
          this.$.ajax.post('/allActivity/pass', JSON.stringify({
            activity_id: id
          })).then(res => {
            this.$router.go(0);
          }, err => {
            this.$message.error('通过失败：' + err.msg);
          })
        }, cancel => null)
      },
      rejectApplication(id, index) {
        this.$confirm('拒绝后该社团需再次申请', '确认拒绝?').then(_ => {
          const loading = this.$loading({
            lock      : true,
            text      : '提交申请中...',
            spinner   : 'el-icon-loading',
            background: 'rgba(0, 0, 0, 0.7)'
          });
          this.$.ajax.post('/allActivity/reject', JSON.stringify({
            activity_id: id
          })).then(res => {
            this.activityApplications[index].status = 'REJECTED';
          }, err => {
            this.$message.error('拒绝失败：' + err.msg);
          }).finally(_=>{
            loading.close();
          })
        }, cancel => null)
      }
    },
    created() {
      const loading = this.$loading({
        lock      : true,
        text      : '初始化中...',
        spinner   : 'el-icon-loading',
        background: 'rgba(0, 0, 0, 0.7)'
      });
      this.$.ajax.get('/allActivityApplication').then(res => {
        console.log('所有活动申请：', res);
        this.activityApplications = res.map(i => ({
          ...i,
          created_time: new Date(i.created_time).format('YYYY-MM-DD hh:mm'),
          date        : new Date(i.date).format('YYYY年MM月DD日')
        })).reverse();;
      },err=>{
        this.$message.error('初始化失败：', err.msg);
      }).finally(_=>{
        loading.close();
      })
    }
  }
</script>

<style scoped>

</style>
