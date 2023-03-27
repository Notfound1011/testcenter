<template>
  <div>
    <h3><i class="iconfont icon-authority"></i>{{ $t('commons.listing.listing_script.common.gis_auth_token.title') }}
    </h3>
    <div id="google-signin-button"></div>
  </div>
</template>

<script>
const CLIENT_ID = "460223557409-0jl3olg4nrgap53vc0jq9uq7aimpbpkq.apps.googleusercontent.com";
const SCOPE = "https://www.googleapis.com/auth/spreadsheets.readonly";
const CLIENT_SECRET = "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";
const GoogleOAuth2 = window.google.accounts.oauth2;

export default {
  name: 'googleLogin',
  data() {
    return {
      client: null,
      access_token: null,
    }
  },
  mounted() {
    this.initClient();
  },
  methods: {
    async initClient() {
      window.google.accounts.id.initialize({
        client_id: CLIENT_ID,
        auto_select: false,
        callback: () => {
          this.getToken()
        },
      });
      window.google.accounts.id.renderButton(
        document.getElementById("google-signin-button"),
        {
          theme: "filled_blue",
          type: "standard",
          text: "signin_with",
        }
      );
      this.client = GoogleOAuth2.initTokenClient({
        client_id: CLIENT_ID,
        scope: SCOPE,
        client_secret: CLIENT_SECRET,
        callback: (tokenResponse) => {
          this.access_token = tokenResponse.access_token;
          // todo: 完成接口调用，将token传到服务端存储下来
          // this.$axios.post("/pyServer/token", this.access_token).then(res => {
          //   if (res.data.code === 0) {
          //     this.$message({
          //       message: '恭喜你, 获取GIS Auth Token成功!',
          //       type: 'success'
          //     });
          //   }
          // }).catch((error) => {
          //   this.$notify.error({
          //     title: "抱歉, 获取GIS Auth Token失败!",
          //     message: error
          //   });
          // })
        },
      });
    },
    getToken() {
      this.client.requestAccessToken().catch(error => {
        this.$message({
          message: '抱歉, 获取GIS Auth Token失败!' + error,
          type: 'error'
        });
      });
    },
  }
}
</script>

<style>
/* 样式代码 */
</style>
