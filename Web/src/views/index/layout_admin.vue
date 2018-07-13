<template>
  <el-container>
    <!--title-->
    <el-header height="4em">
      <h1 class="title untouchable">NTM社团管理系统</h1>
    </el-header>
    <el-container>
      <!--nav-->
      <el-aside width="13em">
        <el-menu :default-openeds="['management']">
          <!--学校管理-->
          <el-submenu index="management">
            <template slot="title">
              <i class="el-icon-location"></i>
              <span>社团管理</span>
            </template>
            <router-link v-for="item of menuItems" :to="{name:item.label}" :key="item.label">
              <el-menu-item :index="item.label">
                {{item.name}}
              </el-menu-item>
            </router-link>
          </el-submenu>
        </el-menu>
        <el-button class="btn_logout" type="danger" @click="logout">
          <i class="el-icon-back"></i>
          &#12288;退出登录
        </el-button>
      </el-aside>
      <!--Main-->
      <el-main>
        <router-view/>
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
    name    : 'layout',
    data() {
      return {
        menuItems: [
          {
            label: 'allCommunity',
            name : '所有已成立社团'
          },
          {
            label: 'allCommunityCheck',
            name : '待审核所有社团'
          },
          {
            label: 'allCommunityMod',
            name : '待审核的社团信息修改'
          },
          {
            label: 'allActivity',
            name : '活动场地管理'
          },
          {
            label: 'allActivityCheck',
            name : '活动场地审核'
          },
        ]
      }
    },
    computed: {},
    methods : {
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
      if (sessionStorage.role !== 'ADMIN') this.$router.push('/login')
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

  .el-aside
    display flex
    flex-direction: column
    justify-content space-between
    color: #333
    text-align: left
    background-color: #E9EEF3
    .draftArticle
      margin-top 1.5em
      margin-bottom 1.5em
    .btn_logout
      margin 1em 2em 1em 2em
      width 10em

  .fullscreen-btn
    position fixed
    left 15em
    width 2em

  .el-main
    color: #333
    text-align left
    height 100% -7em

  .el-footer
    text-align center
    line-height: 3em

</style>
