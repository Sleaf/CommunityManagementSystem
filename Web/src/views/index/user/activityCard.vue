<template>
  <el-card>
    <h3>开放的活动场地：</h3>
    活动日期：
    <el-date-picker style="margin: .5em 0 .5em 0"
                    v-model="selectedDate" @change="updateActivityList"></el-date-picker>
    <el-table :data="activities" style="width: 100%">
      <el-table-column prop="id" label="场地编号"></el-table-column>
      <el-table-column prop="name" label="场地名称"></el-table-column>
      <el-table-column prop="status" label="场地状态"></el-table-column>
      <el-table-column>
        <template slot-scope="scope">
          <el-button disabled v-if="hasApply(scope.row.id)">
            已申请
          </el-button>
          <el-button :disabled="scope.row.status==='已占用'" @click="subApplication(scope.row.id,scope.$index)" v-else>
            申请占用
          </el-button>
        </template>
      </el-table-column>
    </el-table>
    <h3>我的申请历史：</h3>
    <el-table :data="myActivityApplication" style="width: 100%">
      <el-table-column prop="created_time" label="申请日期" width="150"></el-table-column>
      <el-table-column prop="field_id" label="场地编号"></el-table-column>
      <el-table-column prop="date" label="活动日期" width="150"></el-table-column>
      <el-table-column prop="name" label="场地名称"></el-table-column>
      <el-table-column prop="status" label="申请状态"></el-table-column>
    </el-table>
  </el-card>
</template>

<script>
  import {Loading} from 'element-ui';

  export default {
    name   : "activityCard",
    props  : {
      community_id: {
        type   : Number,
        default: -1
      },
    },
    data() {
      return {
        selectedDate         : Date.now(),
        activities           : [],
        myActivityApplication: []
      }
    },
    methods: {
      updateActivityList() {
        const loading = Loading.service({fullscreen: true});
        const reqDate = new Date(this.selectedDate).format('YYYY-MM-DD');
        this.$.ajax.get(`/allActivity?date=${reqDate}`).then(res => {
          console.log(`获得${reqDate}场地信息：`, res);
          this.activities = res.map(i => ({
            ...i,
            status: i.status === 'IDLE' ? '空闲' : '已占用'
          }));
        }, error => {
          this.$message.error('场地信息获取失败，请刷新页面');
        }).finally(_ => {
          loading.close();
        })
      },
      subApplication(field_id, index) {
        this.$.ajax.post('activity', JSON.stringify({
          community_id: this.community_id,
          field_id
        })).then(res => {
          this.$router.go(0);
        }, err => {
          this.$message.error('申请失败：' + err.msg);
        })
      },
      hasApply(field_id) {
        for (const application of this.myActivityApplication) {
          if (field_id === application.field_id && application.status === '待审核') return true;
        }
        return false;
      }
    },
    created() {
      this.updateActivityList();
      /*更新我的申请历史*/
      this.$.ajax.get('/activity').then(res => {
        console.log('我的申请信息：', res);
        this.myActivityApplication = res.map(i => ({
          ...i,
          created_time: new Date(i.created_time).format('YYYY-MM-DD hh:mm'),
          date        : new Date(i.date).format('YYYY年MM月DD日'),
          status      : i.status === 'PADDING' ? '待审核' :
            i.status === 'PASSED' ? '申请通过' : '已回绝'
        })).reverse();
      })
    }
  }
</script>

<style scoped>

</style>
