<template>
  <div v-loading="result.loading">
    <el-card class="box-card">
      <el-form :model="form" size="small" :rules="rules" :disabled="show" ref="form">
        <el-form-item :label="$t('commons.listing.account.bitbucket.bitbucket_username')" prop="jira_username">
          <el-input v-model="form.bitbucket_username"
                    :placeholder="$t('commons.listing.account.bitbucket.input_bitbucket_username_placeholder')"/>
        </el-form-item>
        <el-form-item :label="$t('commons.listing.account.bitbucket.bitbucket_password')" prop="jira_password">
          <el-input v-model="form.bitbucket_password"
                    :placeholder="$t('commons.listing.account.bitbucket.input_bitbucket_password_placeholder')"
                    show-password type="password" auto-complete="new-password"/>
        </el-form-item>
        <el-form-item :label="$t('commons.listing.account.admin.admin_username')" prop="jenkins_username">
          <el-input v-model="form.admin_username"
                    :placeholder="$t('commons.listing.account.admin.input_admin_username_placeholder')"/>
        </el-form-item>
        <el-form-item :label="$t('commons.listing.account.admin.admin_password')" prop="jenkins_password">
          <el-input v-model="form.admin_password"
                    :placeholder="$t('commons.listing.account.admin.input_admin_password_placeholder')"
                    show-password type="password" auto-complete="new-password"/>
        </el-form-item>
      </el-form>

      <div>
        <el-button v-if="showEdit" size="small" @click="edit">
          {{ $t('commons.edit') }}
        </el-button>
        <el-button type="success" v-if="showSave" size="small" @click="save()">{{ $t('commons.save') }}
        </el-button>
        <el-button type="info" v-if="showCancel" size="small" @click="cancel">{{ $t('commons.cancel') }}</el-button>
      </div>
    </el-card>
  </div>
</template>

<script>
// 引入jsencrypt库
import JSEncrypt from 'jsencrypt';
import CryptoJS from 'crypto-js'

export default {
  name: "AccountSetting",
  components: {},
  data() {
    return {
      form: {
        "bitbucket_username": "yuyu.shi",
        "bitbucket_password": "Shiyu@1234",
        "admin_username": "test",
        "admin_password": "123456",
        open: false
      },
      loginForm: {},
      result: {},
      show: true,
      showEdit: true,
      showSave: false,
      showCancel: false,
      rules: {
        bitbucket_username: {
          required: true,
          message: this.$t('commons.listing.account.bitbucket.input_bitbucket_username'),
          trigger: ['change', 'blur']
        },
        bitbucket_password: {
          required: true,
          message: this.$t('commons.listing.account.bitbucket.input_bitbucket_password'),
          trigger: ['change', 'blur']
        },
        admin_username: {
          required: true,
          message: this.$t('commons.listing.account.admin.input_admin_username'),
          trigger: ['change', 'blur']
        },
        admin_password: {
          required: true,
          message: this.$t('commons.listing.account.admin.input_admin_password'),
          trigger: ['change', 'blur']
        },
      }
    }
  },
  created() {
    this.init();
  },
  methods: {
    init() {

      // 创建JSEncrypt实例
      const encryptor = new JSEncrypt();

      // 设置公钥
      const publicKey = '-----BEGIN PUBLIC KEY-----\n' +
        'MIGfMA0GCSqGSIb3DQEBAQUAA4GNADCBiQKBgQDvVk8zQEA3Gwxpu9vRdOB3wU9i\n' +
        'pLNCeAmQQQ83HWmD8Udqx2T0o626k/NuSqBvUpCZb5P/dFADPyhpJJynuRFOj8w1\n' +
        'q6JOY/a7XIGPusazSvFn2LKq6ExDCMtMAJADJaG1KOBuJFmHaA/2vIPOAgLRmxow\n' +
        '3evKrMKoAHCUzR8QxwIDAQAB\n' +
        '-----END PUBLIC KEY-----'; // 从后端获取公钥
      encryptor.setPublicKey(publicKey);

      // 加密数据
      const plaintext = 'Hello World!';
      const ciphertext = encryptor.encrypt(plaintext);

      // 输出加密结果
      console.log('Plaintext: ' + plaintext);
      console.log('Ciphertext: ' + ciphertext);


      // const encryptor = new JSEncrypt();
      // 设置私钥
      const privateKey = '-----BEGIN RSA PRIVATE KEY-----\n' +
        'MIICXwIBAAKBgQDvVk8zQEA3Gwxpu9vRdOB3wU9ipLNCeAmQQQ83HWmD8Udqx2T0\n' +
        'o626k/NuSqBvUpCZb5P/dFADPyhpJJynuRFOj8w1q6JOY/a7XIGPusazSvFn2LKq\n' +
        '6ExDCMtMAJADJaG1KOBuJFmHaA/2vIPOAgLRmxow3evKrMKoAHCUzR8QxwIDAQAB\n' +
        'AoGBAJt3eiz1gIELLe4E3I5bmG/R/0o5aEQ2CyhMSqDnlyHg+h4vdbHAHNrEvm0X\n' +
        'Rs3pWQqCQyW+HTdusEZURPpiKg2Xd7qPOyU7DvrktAun7UkMTVPg/EJ0m3buboF7\n' +
        'CCq9sTUFrkDz+EbvUyMvwfXgx1bBtn3KjKR2QS76IU5G4QzpAkEA/3DqxWalx1zs\n' +
        'wVHLGHMXK1GJGm/ZCzkpQ1LzzkoWyTzRleWuu1Ree3aKhfJ/9BPbANIX36JjLZFF\n' +
        'gf77+r+S/QJBAO/cXzBnteyiC7qpWkF3wERdV4KWoIYT+bO71A8Sg/AIDGsbwgZW\n' +
        'ZxBd+Gf3rLPEFwbs/YYCKZg8NSZ+rgrQSBMCQQDbcjhe6fZVtYE3+3rNQGKRNnTg\n' +
        'n2IJAExwqB0IBiJZM8SiUDWyfaLF0mri9Bf0qfIlXFhiKXGmvfzG1zXGjzpJAkEA\n' +
        'uSBnP57sJMU1NE59YMYiWSGJ5zqGjrVgJj6z/yYVOu+bVhfIese5KEK+9M+ONfkE\n' +
        'pM3JJuMIY30ksJ9ZiPMUjQJBAMhY7QgTvuLXkDOUwZVQOv0weAuPgVDXbaKXLXke\n' +
        '+8fPvR6rdRTLtXDWZT8UdaXOQaotnOG0AX1UQiSU+MYK72s=\n' +
        '-----END RSA PRIVATE KEY-----'; // 从后端获取私钥
      encryptor.setPrivateKey(privateKey);

      // 签名数据
      const data = 'Hello World!';
      const signature = encryptor.sign(data, CryptoJS.SHA256, 'sha256');
      // 输出签名结果
      console.log('Data: ' + data);
      console.log('Signature: ' + signature);


      // 使用 SHA-256 算法对密码进行加密
      this.form.bitbucket_password = CryptoJS.SHA256(this.form.bitbucket_password)
      this.form.admin_password = CryptoJS.SHA256(this.form.admin_password)
      // console.log(this.form)

      // 将加密后的密码作为参数发送给服务器
      // axios.post('/login', {password: encryptedPassword})

      // this.result = this.$get("/system/thirdPartyAuth/info", response => {
      //   this.form = response.data;
      //   this.form.open = this.form.open === 'true';
      //   this.$nextTick(() => {
      //     this.$refs.form.clearValidate();
      //   })
      // })
    },
    edit() {
      this.show = false;
      this.showEdit = false;
      this.showSave = true;
      this.showCancel = true;
    },
    cancel() {
      this.showEdit = true;
      this.showCancel = false;
      this.showSave = false;
      this.show = true;
      this.init();
    },
    save() {

      let param = [
        {paramKey: "bitbucket_username", paramValue: this.form.bitbucket_username, type: "text", sort: 1},
        {paramKey: "bitbucket_password", paramValue: this.form.bitbucket_password, type: "password", sort: 2},
        {paramKey: "admin_username", paramValue: this.form.admin_username, type: "text", sort: 3},
        {paramKey: "admin_password", paramValue: this.form.admin_password, type: "password", sort: 4},
      ];
      console.log(param)
      // this.$refs[form].validate(valid => {
      //   if (valid) {
      //     this.result = this.$post("/system/save/thirdPartyAuth", param, () => {
      //       this.show = true;
      //       this.showEdit = true;
      //       this.showSave = false;
      //       this.showCancel = false;
      //       this.showLogin = false;
      //       this.$success(this.$t('commons.save_success'));
      //       this.init();
      //     });
      //   } else {
      //     return false;
      //   }
      // })
    },
  }
}
</script>

<style scoped>
.box-card {
  margin: 10px;
  width: 600px;
}
</style>
