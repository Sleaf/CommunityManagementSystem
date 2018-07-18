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
        <el-card class="none-content"
                 v-else-if="myCommunity.status == null ||
                 myCommunity.status==='PADDING' ||
                 myCommunity.status==='DISABLED' ||
                 myCommunity.status==='REJECTED'">
          <div slot="header">{{myCommunity.status==='PADDING'?'你的社团申请已经提交成功！':'你名下还没有社团呢，填写以下信息马上申请！'}}</div>
          <div class="tips" v-if="myCommunity.old_name">
            <i class="el-icon-info"></i>
            你的上一个社团【{{myCommunity.old_name}}】
            {{ myCommunity.status==='DISABLED'?'已被禁用！':'申请已被拒绝！'}}
          </div>
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
          <!--社团信息-->
          <el-card>
            <span style="font-weight: bolder;font-size: 1.5em" slot="header">社团信息</span>
            <el-form class="communityInfo" ref="communityInfo" :rules="newCommunityRules" label-position="left"
                     :model="myCommunity">
              <el-form-item label="社团名称：" prop="name">
                <el-input class="name" placeholder="请输入社团名称..." v-model="myCommunity.name"
                          v-if="modMode"></el-input>
                <div v-else>
                  {{myCommunity.name}}
                  <span class="modTag" v-if="myModApplication&&myModApplication.new_name">
                  <i class="el-icon-d-arrow-right"></i>
                  {{myModApplication.new_name}}</span>
                </div>
              </el-form-item>
              <el-form-item label="社团描述：" prop="description">
                <el-input class="desc" placeholder="请输入社团描述..." type="textarea" resize="none" rows="4"
                          v-model="myCommunity.description"
                          v-if="modMode"></el-input>
                <div v-else>
                  {{myCommunity.description}}
                  <span class="modTag" v-if="myModApplication&&myModApplication.new_description">
                  <i class="el-icon-d-arrow-right"></i>
                  {{myModApplication.new_description}}</span>
                </div>
              </el-form-item>
              <el-form-item label="社团等级：" prop="rank">
                {{myCommunity.rank|rank}}
              </el-form-item>
              <div style="text-align: center">
                <el-button-group v-if="modMode">
                  <el-button type="primary" @click="subMod">提交修改信息</el-button>
                  <!--<el-button type="primary" @click="subMod">取消修改</el-button>-->
                </el-button-group>
                <el-button type="warning" disabled v-else-if="myModApplication&&myModApplication.new_name">修改申请正在审核
                </el-button>
                <el-button @click="modMode=true" :disabled="myModApplication==null" v-else>
                  修改社团信息
                </el-button>
              </div>
            </el-form>
          </el-card>
          <!--活动场地申请-->
          <activityCard :community_id="myCommunity.id" class="activity">
          </activityCard>
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
  import activityCard from './user/activityCard'

  export default {
    name      : 'layout_user',
    filters   : {
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
    components: {activityCard},
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
          rank       : [
            {required: true, message: '!!!', trigger: 'blur'},
          ],
        },
        myModApplication : null,
        modMode          : false,
      }
    },
    methods   : {
      applyCommunity() {
        this.$refs['myCommunity'].validate((valid) => {
          if (valid) {
            const loading = this.$loading({
              lock      : true,
              text      : '提交申请中...',
              spinner   : 'el-icon-loading',
              background: 'rgba(0, 0, 0, 0.7)'
            });
            this.$.ajax.post('/community', JSON.stringify({
              name       : this.myCommunity.name,
              description: this.myCommunity.description,
            })).then(res => {
              this.$router.go(0);
            }, err => {
              this.$message.error('提交申请失败：' + err.msg);
            })
          }
        });
      },
      subMod() {
        this.$refs['communityInfo'].validate((valid) => {
          if (valid) {
            const loading = this.$loading({
              lock      : true,
              text      : '提交申请中...',
              spinner   : 'el-icon-loading',
              background: 'rgba(0, 0, 0, 0.7)'
            });
            this.$.ajax.post('/community/mod', JSON.stringify({
              community_id: this.myCommunity.id,
              name        : this.myCommunity.name,
              description : this.myCommunity.description,
            })).then(res => {
              this.$router.go(0)
            }, err => {
              this.$message.error('提交信息修改申请失败：' + err.msg);
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
      const loading = this.$loading({
        lock      : true,
        text      : '初始化中...',
        spinner   : 'el-icon-loading',
        background: 'rgba(0, 0, 0, 0.7)'
      });
      this.$.ajax.get('/community').then(res => {
        console.log('社团信息：', res);
        this.myCommunity = res || {};
        if (this.myCommunity.status === 'DISABLED' || this.myCommunity.status === 'REJECTED') {
          this.myCommunity.old_name = this.myCommunity.name;
          this.myCommunity.name = '';
          this.myCommunity.description = '';
        }
        if (this.myCommunity.status === 'USABLE') {
          this.$.ajax.get('/community/mod').then(res => {
            console.log('社团申请信息：', res);
            this.myModApplication = res || {};
          })
        }
      }, err => {
        this.$message.error('初始化失败：', err.msg);
      }).finally(_ => {
        loading.close();
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
    justify-content center
    .none-content
      font-size 1.5em
      color darkgray
      align-items center
      height 18em
      position absolute
      top 50%
      transform translateY(-50%)
      .tips
        font-size .5em
        color darkgray
        font-style italic
      .newCommunityForm
        width 25em
      .apply-btn
        float right
        margin 1em 1em 2em 0

    .communityInfo
      width 45em
      .modTag
        font-size 1.25em
        margin 1em
        &:after
          content: 'new!';
          display inline-block
          line-height 2em
          color: red;
          font-size: .6em;
          vertical-align: top;

    .activity
      margin 2em 0 2em 0

  .el-footer
    text-align center
    line-height: 3em

</style>
