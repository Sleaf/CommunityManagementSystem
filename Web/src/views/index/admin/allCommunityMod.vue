<template>
  <el-table :data="communityModApplications" style="width: 100%">
    <el-table-column prop="id" label="社团编号"></el-table-column>
    <el-table-column label="社团名称">
      <template slot-scope="scope">
        <el-popover trigger="hover" placement="bottom">
          <div slot="reference" class="name-wrapper">
            <el-tag size="medium">{{ scope.row.name }}</el-tag>
          </div>
          <p style="font-size: .75em">旧名称: {{ scope.row.name }}</p>
          <p>新名称: {{ scope.row.new_name }}</p>
        </el-popover>
      </template>
    </el-table-column>
    <el-table-column label="社团描述">
      <template slot-scope="scope">
        <el-popover trigger="hover" placement="bottom">
          <div slot="reference" class="name-wrapper">
            <el-tag size="medium">{{ scope.row.description }}</el-tag>
          </div>
          <p style="font-size: .75em">旧描述: {{ scope.row.description }}</p>
          <p>新描述: {{ scope.row.new_description }}</p>
        </el-popover>
      </template>
    </el-table-column>
    <el-table-column label="申请状态" width="180">
      <template slot-scope="scope">
        <div v-if="scope.row.status==='PADDING'">
          <el-button type="success" @click="passApplication(scope.row.community_id,scope.$index)">通过</el-button>
          <el-button type="danger" @click="rejectApplication(scope.row.community_id,scope.$index)">拒绝</el-button>
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
    name: "allCommunityMod",
    data() {
      return {
        communityModApplications: []
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
      passApplication(community_id,index) {
        this.$confirm('通过后将修改现有社团资料', '确认通过？').then(_ => {
          this.$.ajax.post('/allCommunity/mod/pass', JSON.stringify({
            community_id: community_id
          })).then(res => {
            this.$message.success('通过成功！');
            this.communityModApplications[index].status = 'PASSED';
          }, err => {
            this.$message.error('通过失败：' + err.msg);
          })
        }, cancel => null)
      },
      rejectApplication(community_id, index) {
        this.$confirm('拒绝后该社团需再次申请', '确认拒绝?').then(_ => {
          this.$.ajax.post('/allCommunity/mod/reject', JSON.stringify({
            community_id: community_id
          })).then(res => {
            this.$message.success('拒绝成功！');
            this.communityModApplications[index].status = 'REJECTED';
          }, err => {
            this.$message.error('拒绝失败：' + err.msg);
          })
        }, cancel => null)
      }
    },
    created() {
      this.$.ajax.get('/allCommunity/mod').then(res => {
        console.log('所有信息修改申请：', res);
        this.communityModApplications = res.reverse();
      })
    }
  }
</script>

<style scoped>

</style>
