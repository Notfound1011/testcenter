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
    }
  ]
}
