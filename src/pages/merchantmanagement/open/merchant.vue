<template>
  <div class="app-container calendar-list-container">
    <el-steps :active="active" align-center>
      <el-step title="商户基本信息"></el-step>
      <el-step title="配置商户费率"></el-step>
      <el-step title="配置商户扣量"></el-step>
      <el-step title="配置商户支付渠道"></el-step>
    </el-steps>
    <transition name="fade">
      <router-view class="view"></router-view>
    </transition>

    <div class="but-group">
        <el-button @click.native.prevent="handlePreview" v-show="preview">预览</el-button>
        <el-button @click.native.prevent="handlePreStep" v-show="preStep">上一步</el-button>
        <el-button @click.native.prevent="handleNextStep" v-show="nextStep" type="primary">下一步</el-button>
        <el-button @click.native.prevent="handlePublish" v-show="publish" type="primary">发布活动</el-button>
      </div>
  </div>
</template>

<script>
export default {
  name: 'openMerchant',
  data() {
    return {
      active: 1,
      isRouter: false,
      preview: true,
      preStep: false,
      nextStep: true,
      publish: false,
      step: 1
    }
  },
  methods: {
    handlePreview: function() {
      console.log('预览')
    },
    handlePreStep: function() {
      this.$router.go(-1)
      this.step--
      this.goStep(this.step)
    },
    handleNextStep: function() {
      this.$router.push('/merchantmanagement/merchant/info')
      var _this = this
      setTimeout(function() {
        if (_this.isRouter) {
          _this.step++
          _this.goStep(_this.step)
        }
      })
    },
    handlePublish: function() {
      console.log('发布')
    },
    goStep: function(n) {
      switch (n) {
        case 1:
          this.preview = true; this.preStep = false; this.nextStep = true; this.publish = false
          break
        case 2:
          this.preview = false; this.preStep = true; this.nextStep = true; this.publish = false
          break
        case 3:
          this.preview = false; this.preStep = true; this.nextStep = true; this.publish = false
          break
        case 4:
          this.preview = false; this.preStep = true; this.nextStep = false; this.publish = true
          break
      }
    }
  },
  watch: {
    '$route': function(to, from) {
      this.isRouter = true
    }
  }
}
</script>
