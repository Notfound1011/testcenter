<template>
  <el-card>
    <el-tabs class="system-setting" v-model="activeName">

      <el-tab-pane :label="$t('system_config.base_config')" name="base">
        <base-setting/>
      </el-tab-pane>
      <el-tab-pane :label="$t('system_parameter_setting.mailbox_service_settings')" name="email">
        <email-setting/>
      </el-tab-pane>
      <el-tab-pane :label="$t('system_parameter_setting.ldap_setting')" name="ldap">
        <ldap-setting/>
      </el-tab-pane>
      <el-tab-pane :label="$t('system_parameter_setting.third_party_auth_setting')" name="thirdPartyAuth">
        <third-party-auth-setting/>
      </el-tab-pane>
      <el-tab-pane v-if="hasLicense()" :label="$t('display.title')" name="display">
        <ms-display/>
      </el-tab-pane>
      <el-tab-pane v-if="hasLicense()" :label="$t('auth_source.title')" name="auth">
        <ms-auth/>
      </el-tab-pane>
      <el-tab-pane v-if="hasLicense()" :label="$t('module.title')" name="module">
        <ms-module/>
      </el-tab-pane>
    </el-tabs>
  </el-card>
</template>

<script>
import EmailSetting from "./EmailSetting";
import LdapSetting from "./LdapSetting";
import BaseSetting from "./BaseSetting";
import {hasLicense} from '@/common/js/utils';
import ThirdPartyAuthSetting from "@/business/components/settings/system/ThirdPartyAuthSetting";

const requireComponent = require.context('@/business/components/xpack/', true, /\.vue$/);
const display = requireComponent.keys().length > 0 ? requireComponent("./display/Display.vue") : {};
const auth = requireComponent.keys().length > 0 ? requireComponent("./auth/Auth.vue") : {};
const module = requireComponent.keys().length > 0 ? requireComponent("./module/Module.vue") : {};

export default {
  name: "SystemParameterSetting",
  components: {
    ThirdPartyAuthSetting,
    BaseSetting,
    EmailSetting,
    LdapSetting,
    "MsDisplay": display.default,
    "MsAuth": auth.default,
    "MsModule": module.default,
  },
  data() {
    return {
      activeName: 'base',
    };
  },
  methods: {
    hasLicense,
  }
};
</script>

<style scoped>

</style>
