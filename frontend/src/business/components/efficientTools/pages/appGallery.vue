<template>
  <ms-container>
    <ms-main-container>
      <div class="timeline-area">
        <div class="timeline-area-ios-block">
          <el-timeline>
            <div class="timeline-title-font">
              <el-button :loading="loading" size="mini" icon="el-icon-refresh-left" circle @click="getPrivilegesRecord"></el-button>
              Phemex App iOS
            </div>
            <el-timeline-item size="large" v-for="(items, date) in appGalleryDataIos" :key="date" :timestamp="date" placement="top">
              <el-card class="timeline-card" :body-style="cardBodyStyle" v-for="(item, index) in items" :key="index">
                <div class="timeline-card-text">
                  <p class="card-text-title">{{ item['version_desc'] }}</p>
                  <pre v-if="item['version_description'] != null">{{ item['version_description'] }}</pre>
                  <pre v-else>no change log.</pre>
                  <div>
                    <el-button style="font-weight: bold" @click="copyToClipboard(item['ipa_url'])"
                               icon="el-icon-document-copy" size="mini" type="text">Copy iPA Link</el-button>
                  </div>
                  <div>
                    <p>
                      @{{ item['builder'] }}
                      build <a target="_blank" style="font-style: italic;" :href="item['build_url']"> #{{ item['build_number'] }}</a>
                      at {{ item['build_time'] }}
                    </p>
                  </div>
                </div>
                <div class="timeline-card-image">
                  <button @click="toggleImage(date, index, 'ios')">
                    <img alt="click to see." :style="{ width: showImage[`${date}-${index}-ios`] ? '130px' : '130px', height: showImage[`${date}-${index}-ios`] ? '130px' : '130px', cursor: 'pointer' }"
                         :src="showImage[`${date}-${index}-ios`] ? item['ipa_image_url'] : require('../images/erweima.png')">
                  </button>
                </div>
              </el-card>
            </el-timeline-item>
          </el-timeline>
        </div>
        <div class="timeline-area-and-block">
          <el-timeline>
            <div class="timeline-title-font">
              <el-button :loading="loading" size="mini" icon="el-icon-refresh-left" circle @click="getPrivilegesRecord"></el-button>
              Phemex App Android
            </div>
            <el-timeline-item size="large" v-for="(itemsAnd, dateAnd) in appGalleryDataAnd" :key="dateAnd" :timestamp="dateAnd" placement="top">
              <el-card class="timeline-card" :body-style="cardBodyStyle" v-for="(itemAnd, indexAnd) in itemsAnd" :key="indexAnd">
                <div class="timeline-card-text">
                  <p class="card-text-title">{{ itemAnd['version_desc'] }}</p>
                  <pre v-if="itemAnd['version_description'] != null">{{ itemAnd['version_description'] }}</pre>
                  <pre v-else>no change log.</pre>
                  <div>
                    <el-button style="font-weight: bold" @click="copyToClipboard(itemAnd['apk_url'])"
                               icon="el-icon-document-copy" size="mini" type="text">Copy Apk Link</el-button>
                    <el-button style="font-weight: bold" @click="copyToClipboard(itemAnd['abb_url'])"
                               icon="el-icon-document-copy" size="mini" type="text">Copy Aab Link</el-button>
                  </div>
                  <div>
                    @{{ itemAnd['builder'] }}
                    build <a target="_blank" style="font-style: italic;" :href="itemAnd['build_url']"> #{{ itemAnd['build_number'] }}</a>
                    at {{ itemAnd['build_time'] }}
                  </div>
                </div>
                <div class="timeline-card-image">
                  <button @click="toggleImage(dateAnd, indexAnd, 'and')">
                    <img alt="click to see." :style="{ width: showImage[`${dateAnd}-${indexAnd}-and`] ? '130px' : '130px', height: showImage[`${dateAnd}-${indexAnd}-and`] ? '130px' : '130px', cursor: 'pointer' }"
                         :src="showImage[`${dateAnd}-${indexAnd}-and`] ? itemAnd['apk_image_url'] : require('../images/erweima.png')">
                  </button>
                </div>
              </el-card>
            </el-timeline-item>
          </el-timeline>
        </div>
        <!-- <div class="timeline-area-empty-block"></div> -->
      </div>
    </ms-main-container>
  </ms-container>
</template>

<script>
import MsMainContainer from "@/business/components/common/components/MsMainContainer.vue";
import MsContainer from "@/business/components/common/components/MsContainer.vue";
import * as commonOperator from "@/common/naguri/naguri";
import {fullScreenLoading, stopFullScreenLoading} from "@/common/js/utils";

export default {
  name: "appGallery.vue",
  computed: {
    commonOperator() {
      return commonOperator
    }
  },
  components: {MsMainContainer, MsContainer},
  inheritAttrs: false,
  props: [],
  inject: ["reload"],
  data () {
    return {
      loading: false,
      showImage: [],
      routerPath: this.$route.path.toString(),
      appGalleryDataIos: [],
      appGalleryDataAnd: [],
      cardBodyStyle : {
        display: 'flex',
        flexDirection: 'row'
      }
    }
  },
  created () {
    this.getPrivilegesRecord()
  },
  methods: {
    copyToClipboard(text) {
      const textarea = document.createElement('textarea');
      textarea.value = text;
      document.body.appendChild(textarea);
      textarea.select();
      document.execCommand('copy');
      document.body.removeChild(textarea);
      this.$message.success('Copied ' + text);
    },
    toggleImage(date, index, channel) {
      const key = `${date}-${index}-${channel}`;
      this.$set(this.showImage, key, !this.showImage[key]);
    },
    async getPrivilegesRecord () {
      this.loading = true
      const loading = fullScreenLoading(this, 'loading...');
      const headers = commonOperator.parseNaguriHeader()
      const { data: apiResponse } = await this.$axios.get(
        `naguri/ef_api/app_gallery_v2`,
        {headers, timeout: 5000}
      ).catch((error) => {
        commonOperator.messageTips('error', error)
      }).finally(() => {
        stopFullScreenLoading(loading,1);
        this.loading = false
      });
      this.appGalleryDataIos = apiResponse['data']['iOS']
      this.appGalleryDataAnd = apiResponse['data']['Android']
    }
  }
}
</script>

<style lang="less" scoped>
/deep/.el-timeline-item__timestamp.is-top {
  padding-top: 1px;
  font-size: 18px;
  color: #312f2f;
  font-weight: bold;
}
.timeline-card {
  margin: 10px;
  width: 82%;
  .timeline-card-text {
    flex: 1;
    min-width: 345px;
    .card-text-title {
      font-weight: bold;
      font-size: 16px;
    }
  }
  .timeline-card-image {
    flex: 1;
    display: flex;
    justify-content: center;
    align-items: center;
  }
}
.timeline-title-font {
  font-size: 20px;
  font-weight: bold;
  margin-bottom: 20px;
}
.timeline-area {
  display: flex;
  padding-top: 15px;
  padding-left: 50px;
  flex-direction: row;
  .timeline-area-ios-block {
    flex: 1;
  }
  .timeline-area-and-block {
    flex: 1;
  }
  .timeline-area-empty-block {
    flex: 1;
  }
}
</style>
