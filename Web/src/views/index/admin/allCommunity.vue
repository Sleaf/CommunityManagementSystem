<template>
  <el-table :data="communities" style="width: 100%">
    <el-table-column prop="id" label="社团编号"></el-table-column>
    <el-table-column label="社团信息">
      <template slot-scope="scope">
        <el-popover trigger="hover" placement="bottom">
          <div slot="reference" class="name-wrapper">
            <el-tag size="medium">{{ scope.row.name }}</el-tag>
          </div>
          <p>名称: {{ scope.row.name }}</p>
          <p>描述: {{ scope.row.description }}</p>
        </el-popover>
      </template>
    </el-table-column>
    <el-table-column prop="owner_name" label="社长"></el-table-column>
    <el-table-column label="社团等级">
      <template slot-scope="scope">
        {{scope.row.rank|rank}}
      </template>
    </el-table-column>
    <el-table-column label="社团状态">
      <template slot-scope="scope">
        {{scope.row.status|status}}
      </template>
    </el-table-column>
    <el-table-column width="300">
      <template slot-scope="scope">
        <div v-if="scope.row.status==='PADDING'">
          <el-button type="success" @click="passApplication(scope.row.id,scope.$index)">通过</el-button>
          <el-button type="danger" @click="rejectApplication(scope.row.id,scope.$index)">拒绝</el-button>
        </div>
        <div v-else-if="scope.row.status==='USABLE'">
          <el-button size="medium" @click="rankCommunity(scope.row,scope.$index)">修改评级</el-button>

          <el-button size="medium" type="danger" @click="freezeCommunity(scope.row.id,scope.$index)">
            禁用社团
          </el-button>
        </div>
        <div v-else-if="scope.row.status==='DISABLED'">
          <el-button size="medium" type="primary" @click="thawCommunity(scope.row.id,scope.row.owner_id,scope.$index)">
            启用社团
          </el-button>
        </div>
        <div v-else></div>
      </template>
    </el-table-column>
  </el-table>
</template>

<script>
  import rankDialog from './rankDialog'

  export default {
    name   : "allCommunity",
    data() {
      return {
        communities: []
      }
    },
    filters: {
      status(value) {
        switch (value) {
          case 'USABLE':
            return '可用';
          case 'PADDING':
            return '等待审核';
          case 'PASSED':
            return '申请通过';
          case 'REJECTED':
            return '已回绝';
          default:
            return '不可用';
        }
      },
      rank(value) {
        switch (String(value)) {
          case '1':
            return '一星社团';
          case '2':
            return '二星社团';
          case '3':
            return '三星社团';
          case '4':
            return '四星社团';
          case '5':
            return '五星社团';
          default:
            return '未评级';
        }
      }
    },
    methods: {
      passApplication(id, index) {
        this.$confirm('通过后该社团将启用', '确认通过？').then(_ => {
          const loading = this.$loading({
            lock      : true,
            text      : '提交申请中...',
            spinner   : 'el-icon-loading',
            background: 'rgba(0, 0, 0, 0.7)'
          });
          this.$.ajax.post('/allCommunity/pass', JSON.stringify({
            community_id: id
          })).then(res => {
            this.$message.success('通过成功！');
            this.communities[index].status = 'USABLE';
          }, err => {
            this.$message.error('通过失败：' + err.msg);
          }).finally(_=>{
            loading.close();
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
          this.$.ajax.post('/allCommunity/reject', JSON.stringify({
            community_id: id
          })).then(res => {
            this.$message.success('拒绝成功！');
            this.communities[index].status = 'REJECTED';
          }, err => {
            this.$message.error('拒绝失败：' + err.msg);
          }).finally(_=>{
            loading.close();
          })
        }, cancel => null)
      },
      rankCommunity(row, index) {
        const h = this.$createElement;
        this.$msgbox({
          title            : `【${row.name}】 - 社团评级`,
          message          : h(rankDialog, {
            props: {
              rankLevel   : row.rank || '未评级',
              community_id: row.id
            }
          }),
          showConfirmButton: false,
          showCancelButton : false,
        }).then(confirm => null, cancel => null);
      },
      thawCommunity(id, owner_id, index) {
        this.$confirm('解冻后恢复社团功能（当该用户当前掌管某个社团或申请某个社团时解冻将失效）', '确认冻结？').then(_ => {
          const loading = this.$loading({
            lock      : true,
            text      : '提交申请中...',
            spinner   : 'el-icon-loading',
            background: 'rgba(0, 0, 0, 0.7)'
          });
          this.$.ajax.post('/allCommunity/thaw', JSON.stringify({
            community_id: id,
            owner_id    : owner_id,
          })).then(res => {
            this.$message.success('解冻成功！');
            this.communities[index].status = 'USABLE';
          }, err => {
            this.$message.error('解冻失败：' + err.msg);
          }).finally(_=>{
            loading.close();
          })
        }, cancel => null)
      },
      freezeCommunity(id, index) {
        this.$confirm('冻结后社团将不可用', '确认冻结？').then(_ => {
          const loading = this.$loading({
            lock      : true,
            text      : '提交申请中...',
            spinner   : 'el-icon-loading',
            background: 'rgba(0, 0, 0, 0.7)'
          });
          this.$.ajax.post('/allCommunity/freeze', JSON.stringify({
            community_id: id
          })).then(res => {
            this.$message.success('冻结成功！');
            this.communities[index].status = 'DISABLED';
          }, err => {
            this.$message.error('冻结失败：' + err.msg);
          }).finally(_=>{
            loading.close();
          })
        }, cancel => null)
      },
    },
    created() {
      const loading = this.$loading({
        lock      : true,
        text      : '初始化中...',
        spinner   : 'el-icon-loading',
        background: 'rgba(0, 0, 0, 0.7)'
      });
      this.$.ajax.get('/allCommunity').then(res => {
        console.log('所有社团信息：', res);
        this.communities = res.reverse();
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
