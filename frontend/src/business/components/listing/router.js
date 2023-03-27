export default {
  path: "/listing",
  name: "listing",
  redirect: "/listing/script",
  components: {
    content: () => import('@/business/components/listing/Listing.vue')
  },
  children: [
    {
      path: 'script',
      name: 'script',
      component: () => import('@/business/components/listing/listingscript/ListingScript.vue'),
      meta: {hideCard: true},
      children: [
        {
          path: 'common',
          component: () => import('@/business/components/listing/listingscript/common/Common.vue')
        },
        {
          path: 'spot',
          name: "spot",
          component: () => import('@/business/components/listing/listingscript/spot/Spot.vue'),
        },
        {
          path: 'contract',
          name: "contract",
          component: () => import('@/business/components/listing/listingscript/contract/Contract.vue'),
        }
      ]
    },
    {
      path: 'public-variable',
      name: 'public-variable',
      component: () => import('@/business/components/listing/publicvariable/PublicVariable.vue'),
    },
    {
      path: 'account',
      name: 'account',
      component: () => import('@/business/components/listing/account/Account.vue'),
    }
  ]
}
