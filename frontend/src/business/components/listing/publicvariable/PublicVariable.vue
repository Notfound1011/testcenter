<template>
  <ms-container>
    <ms-main-container class="container_main">
      <template>
        <div>
          GoogleLoginButton
        </div>
      </template>
    </ms-main-container>
  </ms-container>
</template>

<script>
import GoogleLogin from '../listingscript/common/components/GoogleLogin.vue';
import MsContainer from "@/business/components/common/components/MsContainer.vue";
import MsMainContainer from "@/business/components/common/components/MsMainContainer.vue";

export default {
  name: 'App',
  components: {
    MsMainContainer,
    MsContainer,
    GoogleLogin,
  },
};
</script>
