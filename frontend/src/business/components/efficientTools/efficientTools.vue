<template>
  <ms-container>
    <ms-main-container>
      <div class="container">
        <div class="item">Item 1</div>
        <div class="item">Item 2</div>
        <div class="item">Item 3</div>
      </div>
    </ms-main-container>
  </ms-container>
</template>

<script>
import MsMainContainer from "@/business/components/common/components/MsMainContainer";
import MsContainer from "@/business/components/common/components/MsContainer";
export default {
  inheritAttrs: false,
  props: [],
  inject: ["reload"],
  name: "efficientTools",
  components: {MsMainContainer, MsContainer},
}
</script>

<style lang="less" scoped>
//简单布局
//.container {
//  display: flex;
//  justify-content: center;
//  align-items: center;
//}
//.item {
//  flex: 1;
//  text-align: center;
//  padding: 20px;
//  background: #1E9FFB;
//}

//水平居中
.container {
  display: flex;
  justify-content: center;
  align-items: center;
  height: 200px;
}
.item {
  text-align: center;
  padding: 20px;
  margin-left: 2px;
  background-color: #ccc;
}


</style>
