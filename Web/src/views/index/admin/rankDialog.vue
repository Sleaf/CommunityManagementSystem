<template>
  <el-form class="rankList" ref="rankList" :rules="formRule" label-position="left" :model="formData">
    <el-form-item class="rankListForm" label="修改社团评级为：" prop="rankLevel">
      <el-select v-model="formData.rankLevel" placeholder="请选择评定星级">
        <el-option v-for="item in rankList" :key="item.value" :label="item.label" :value="item.value">
        </el-option>
      </el-select>
    </el-form-item>
    <el-button class="sub-btn" type="primary" @click="subRank">提交修改</el-button>
  </el-form>
</template>

<script>
  export default {
    name   : "rankDialog",
    props  : {
      rankLevelOrigin: {
        type   : Number,
        default: 0
      },
      community_id   : {
        type   : Number,
        default: -1
      }
    },
    data() {
      const formValidator = (rule, value, callback) => {
        if (!value || value === '未评级') callback(new Error('请选择社团星级'));
      };

      return {
        rankList: [
          {
            label: '一星社团',
            value: 1
          },
          {
            label: '二星社团',
            value: 2
          },
          {
            label: '三星社团',
            value: 3
          },
          {
            label: '四星社团',
            value: 4
          },
          {
            label: '五星社团',
            value: 5
          },
        ],
        formData: {
          rankLevel: this.rankLevelOrigin || '未评级',
        },
        formRule: {
          rankLevel: [
            {validator: formValidator, trigger: 'change'},
          ],
        }
      }
    },
    methods: {
      subRank() {
        if (this.formData.rankLevel === '未评级') {
          this.$message.error('请选择社团星级');
          return;
        }
        this.$.ajax.post('/allCommunity/rank', JSON.stringify({
          community_id: this.community_id,
          rank        : this.formData.rankLevel
        })).then(res => {
          this.$message.success('修改成功');
        }, err => {
          this.$message.error('修改失败：' + err.msg);
        })
      }
    },
  }
</script>

<style lang="stylus" scoped>
  .rankList
    text-align center
    .rankListForm
      margin .5em
    .sub-btn
      margin 1.5em 0 -1em 0
</style>
