<template>
  <el-form ref="refForm" :model="configData" label-width="80px">
    <el-form-item label="item.label" v-for="item in configData">
      <el-input v-model="configData"></el-input>
    </el-form-item>
  </el-form>>
</template>

<script>
export default {
  name: "ConfigForm",
  props: {
    configData: {
      type: Array
    }
  },
  data() {
    return {
      configDefaults: {

      }
    }
  },
  methods: {

  }
}
</script>

<style scoped>

</style>
