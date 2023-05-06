<template>
  <div>
`    <h3><i class="iconfont icon-authority"></i>{{ $t('commons.listing.listing_script.common.access_token.title') }}
    </h3>
    <el-button type="primary" @click="getAccessToken">{{
        $t('commons.listing.listing_script.common.access_token.get')
      }}
    </el-button>
  </div>
</template>

<script>

export default {
  name: 'GoogleLogin',
  methods: {
    async getAccessToken() {
      // todo: 调用后端接口，更新access_token
      this.$get('/xxx/xxx')
        .then(response => {
          this.$message({message: 'token获取成功', type: 'success'});
        })
        .catch(() => {
          this.$message({message: '接口返回值异常, 请联系开发者！！！', type: 'error'});
        });
    },
  }
}
</script>

<style>
/* 样式代码 */
</style>
