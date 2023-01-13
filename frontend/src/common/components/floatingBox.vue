<template>
  <div class="floating-box" :style="localStyle">
    <div class="floating-box-inner-layer">
      <slot></slot>
    </div>
  </div>
</template>

<script>
export default {
  name: "floatingBox",
  data() {
    return {
      minPX: 50,
      localStyle: {}
    }
  },
  props: {
    boxWidth: {
      type: String,
      default: '50px'
    },
    boxHeight: {
      type: String,
      default: '50px'
    }
  },
  created(){
    let width = parseInt(this.boxWidth);
    let height = parseInt(this.boxHeight);
    // 这里限制最小值, 如果不满足, 则用默认的最小值
    width = width >= this.minPX ? width : this.minPX
    height = height >= this.minPX ? height : this.minPX
    let min = Math.min(width, height)
    let mclFactor;
    // 最小值是100, 分成4份, 这里挺奇怪的, 如果是 100 < min < 150 满足单边就是 true
    if (min <= this.minPX) {
      mclFactor = 1
    } else if (this.minPX < min && min < 125) {
      mclFactor = 2
    } else if (125 <= min && min < 200) {
      mclFactor = 3
    } else {
      mclFactor = 4
    }
    this.localStyle = {'--customize-width': `${width}px`, '--customize-height': `${height}px`, '--mcl-factor': mclFactor}
  }
}
</script>

<style scoped>

.floating-box {
/*备用色, 依次是: 文本颜色, 阴影颜色, 背景色(最前面的那个)*/
  --self-color: var(--color, #774f38);
  --self-shadow-color: var(--primary_color, #83af9b);
  --self-background-color: var(--count_number_shallow, #ece5ce);
  /*由props动态设置的, 这里设置一个防止报错*/
  --customize-width: 0;
  --customize-height: 0;
  /*乘算系数*/
  --mcl-factor: 1;
  /*这个相对于上面来讲的话, 要设置一个较小值*/
  --inner-layer-mcl-factor: clamp(1.5, var(--mcl-factor), 4);
  width: calc(var(--customize-width) - (5px * var(--mcl-factor)));
  height: calc(var(--customize-height) - (25px * var(--mcl-factor)));
  padding-top: calc(5px * var(--mcl-factor));
  padding-bottom: calc(25px * var(--mcl-factor));
  /*display: grid;*/
  /*place-items: center;*/
  /*background-color: var(--count_number_shallow);*/
  /*鼠标hover上去是个小手*/
  cursor: pointer;

}

.floating-box .floating-box-inner-layer {
  /*高度100顶满外部空间高度*/
  height: 100%;
  margin-right: calc(5px * var(--mcl-factor));
  text-align: center;
  /*文案无需全大写*/
  /*text-transform: uppercase;*/
  font-weight: bold;
  /*原值15px*/
  font-size: calc(4px * var(--mcl-factor));
  color: var(--self-color);
  background-color: var(--self-background-color);
  /*原值是10px*/
  padding: calc(3px * var(--mcl-factor));
  box-shadow: calc(5px * var(--mcl-factor)) calc(5px * var(--mcl-factor)) var(--self-shadow-color);
  border-radius: 11px;
  mix-blend-mode: multiply;
  animation: float 5s ease-in-out infinite;
}

.floating-box .floating-box-inner-layer::after {
  /*text-shadow: 22px 22px var(--self-shadow-color);*/
  /*font-size: 55px;*/
  /*width: 55px;*/
  /*height: 11px;*/
  /*line-height: 30px;*/
  /*bottom: -30px;*/
  /*box-shadow: 22px 22px var(--self-shadow-color);*/

  text-shadow: calc(8px * var(--inner-layer-mcl-factor)) calc(8px * var(--inner-layer-mcl-factor)) var(--self-shadow-color);
  font-size: calc(14px * var(--inner-layer-mcl-factor));
  width: calc(14px * var(--inner-layer-mcl-factor));
  height: calc(3px * var(--inner-layer-mcl-factor));
  line-height: calc(8px * var(--inner-layer-mcl-factor));
  bottom: calc(-8px * var(--inner-layer-mcl-factor));
  box-shadow: calc(8px * var(--inner-layer-mcl-factor)) calc(8px * var(--inner-layer-mcl-factor)) var(--self-shadow-color);

  content: '·';
  border-radius: 11px;
  font-weight: bold;
  -webkit-text-fill-color: var(--self-background-color);
  text-align: left;
  background-color: var(--self-background-color);
  position: absolute;
  left: 0;
  z-index: -2;
  animation: float2 5s ease-in-out infinite;
}

@keyframes float {
  0% {
    transform: translateY(0px);
  }
  50% {
    transform: translateY(calc(-5px * var(--mcl-factor)));
  }
  100% {
    transform: translateY(0px);
  }
}

@keyframes float2 {
  0% {
    line-height: calc(8px * var(--inner-layer-mcl-factor));
    transform: translateY(0px);
  }
  50% {
    transform: translateY(calc(-5px * var(--mcl-factor)));
  }
  60% {
    line-height: calc(3px * var(--inner-layer-mcl-factor));
  }
  100% {
    line-height: calc(8px * var(--inner-layer-mcl-factor));
    transform: translateY(0px);
  }
}
</style>
