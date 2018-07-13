<template>
  <el-container>
    <!--title-->
    <el-header height="4em">
      <h1 class="title untouchable">NTM社团管理系统</h1>
    </el-header>
    <el-container>
      <!--Main-->
      <el-main>
        <div v-if="myCommunity == null"></div>
        <!--申请未通过-->
        <el-card class="none-content" v-else-if="myCommunity.name == null || myCommunity.status==='PADDING' ">
          <div slot="header">{{myCommunity.status==='PADDING'?'你的社团正在审核！':'你名下还没有社团呢，填写以下信息马上申请！'}}</div>
          <el-form class="newCommunityForm" ref="myCommunity" :rules="newCommunityRules" label-position="left"
                   :model="myCommunity">
            <el-form-item label="社团名称" prop="name">
              <el-input class="name" placeholder="请输入社团名称..." v-model="myCommunity.name"
                        :disabled="myCommunity.status==='PADDING'"></el-input>
            </el-form-item>
            <el-form-item label="社团描述" prop="description">
              <el-input class="desc" placeholder="请输入社团描述..." type="textarea" resize="none" rows="4"
                        v-model="myCommunity.description"
                        :disabled="myCommunity.status==='PADDING'"></el-input>
            </el-form-item>
          </el-form>
          <el-button class="apply-btn" type="warning" v-if="myCommunity.status==='PADDING'"
                     disabled>正在审核...
          </el-button>
          <el-button class="apply-btn" type="primary" @click="applyCommunity"
                     v-else>立即申请
          </el-button>
        </el-card>
        <!--申请通过-->
        <div v-else-if="myCommunity.status==='USABLE'">
          <p>社团名称：{{myCommunity.name}}</p>
          <p>社团描述：{{myCommunity.description}}</p>
        </div>
      </el-main>
    </el-container>
    <!--footer-->
    <el-footer class="untouchable" height="3em">
      Design By Sleaf
    </el-footer>
  </el-container>
</template>

<script>
  export default {
    name   : 'layout_user',
    data() {
      return {
        myCommunity      : null,
        newCommunityRules: {
          name       : [
            {required: true, message: '请输入社团名称', trigger: 'blur'},
            {min: 3, max: 10, message: '社团名称应该为 3 到 10 字！', trigger: 'blur'}
          ],
          description: [
            {required: true, message: '请输入社团描述', trigger: 'blur'},
            {max: 150, message: '社团描述长度应不多于150字！', trigger: 'blur'}
          ],
        }
      }
    },
    methods: {
      applyCommunity() {
        this.$refs['newCommunity'].validate((valid) => {
          if (valid) {
            this.$.ajax.post('/community', JSON.stringify({
              name       : this.myCommunity.name,
              description: this.myCommunity.description,
            })).then(res => {
              this.$message.success('提交申请成功！请等待管理员审核');
              this.myCommunity.status = 'PADDING';
            }, err => {
              this.$message.error('提交申请失败：' + err.msg);
            })
          }
        });
      },
      logout() {
        const loading = this.$loading({
          lock      : true,
          text      : '登出中...',
          spinner   : 'el-icon-loading',
          background: 'rgba(0, 0, 0, 0.7)'
        });
        this.$.ajax.post(`/logout`).then((res) => {
          this.$router.replace('/login');
          this.$message.success('退出成功');
        }, (err) => {
          this.$message.error('登出失败：' + err.msg)
        }).finally(() => {
          loading.close();
        });

      }
    },
    created() {
      if (sessionStorage.role !== 'USER') {
        this.$router.push('/login');
        return;
      }
      this.fullscreenLoading = true;
      this.$.ajax.get('/community').then(res => {
        console.log('社团信息：', res);
        this.myCommunity = res || {};
      }, err => {
        this.$message.error('初始化失败：', err.msg);
      }).finally(_ => {
        this.fullscreenLoading = false;
      })

    },
    mounted() {
    },

  }
</script>

<style lang="stylus" scoped>
  .el-container
    width 100%
    height 100%
    padding 0
    margin 0

  .el-header, .el-footer
    background-color: #B3C0D1
    color: #333
    line-height: 2em
    .logo
      height 3em
      margin .5em
      border-radius 1em
    .title
      white-space nowrap
      text-overflow ellipsis
      overflow hidden

  .el-main
    color: #333
    text-align left
    height 100% -7em
    display flex
    align-items: center
    justify-content center
    .none-content
      font-size 1.5em
      color darkgray
      align-items center
      .newCommunityForm
        width 25em
      .apply-btn
        float right
        margin 1em 1em 2em 0

  .el-footer
    text-align center
    line-height: 3em

</style>
