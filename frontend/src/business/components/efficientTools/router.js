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
      component: () => import('@/business/components/efficientTools/pages/phemexMailCode'),
    },
    {
      path: '/efficientTools/quickRegister',
      component: () => import('@/business/components/efficientTools/pages/quickRegister'),
    },
    {
      path: '/efficientTools/remoteCurl',
      component: () => import('@/business/components/efficientTools/pages/remoteCurl'),
    },
    {
      path: '/efficientTools/spotFakeRecharge',
      component: () => import('@/business/components/efficientTools/pages/spotFakeRecharge.vue'),
    },
  ]
}
