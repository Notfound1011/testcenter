// 新增此路由用于增加efficientTools页面
// 注意：这里增加后需要在管理后台添加相应路由后由接口返回页面渲染菜单
// http://3.1.250.199:7001/admin/#/admin/efficient_tools/efficientmenu/
export default {
  path: "/efficientTools",
  name: "efficientTools",
  components: {
    content: () => import('@/business/components/efficientTools/efficientTools')
  },
  children: [
    {
      path: '/efficientTools/mailCode',
      component: () => import('@/business/components/efficientTools/pages/efficientTools/phemexMailCode.vue'),
    },
    {
      path: '/efficientTools/quickRegister',
      component: () => import('@/business/components/efficientTools/pages/efficientTools/quickRegister.vue'),
    },
    {
      path: '/efficientTools/remoteCurl',
      component: () => import('@/business/components/efficientTools/pages/efficientTools/remoteCurl.vue'),
    },
    {
      path: '/efficientTools/spotFakeRecharge',
      component: () => import('@/business/components/efficientTools/pages/efficientTools/spotFakeRecharge.vue'),
    },
    {
      path: '/efficientTools/currencyConfig',
      component: () => import('@/business/components/efficientTools/pages/phemexProduct/currencyConfig.vue'),
    },
    {
      path: '/efficientTools/spotSymbol',
      component: () => import('@/business/components/efficientTools/pages/phemexProduct/spotSymbol.vue'),
    },
    {
      path: '/efficientTools/spotMarginSymbol',
      component: () => import('@/business/components/efficientTools/pages/phemexProduct/spotMarginSymbol.vue'),
    },
    {
      path: '/efficientTools/contractSymbol',
      component: () => import('@/business/components/efficientTools/pages/phemexProduct/contractSymbol.vue'),
    },
    {
      path: '/efficientTools/contractSymbolUsdt',
      component: () => import('@/business/components/efficientTools/pages/phemexProduct/contractSymbolUsdt.vue'),
    },
    {
      path: '/efficientTools/chainSettings',
      component: () => import('@/business/components/efficientTools/pages/phemexProduct/chainSettings.vue'),
    },
    {
      path: '/efficientTools/codeCoverage',
      component: () => import('@/business/components/efficientTools/pages/whiteBoxTesting/codeCoverage.vue'),
    }
  ]
}
