import type { RouterConfig } from '@nuxt/schema'
import { RouteRecordRaw } from 'vue-router'


// https://router.vuejs.org/api/interfaces/routeroptions.html
export default <RouterConfig> {
  routes: (_routes) => [  
    {
      name: 'index',
      path: '/',
      component: () => import('~/pages/index.vue').then(r => r.default || r),
      props: true,
    },
    
    {
      name: 'admin',
      path: '/admin',
      component: () => import('~/pages/admin.vue').then(r => r.default || r),
      props: true
    },
    {
      name: 'enter',
      path: '/enter',
      component: () => import('~/pages/enter.vue')
    },
    {
      name: 'register',
      path: '/register',
      component: () => import('~/pages/register.vue')
    },
    {
      name: 'tentang',
      path: '/tentang',
      component: () => import('~/pages/about.vue').then(r => r.default || r)
    },
    {
      name: 'new',
      path: '/new',
      component: () => import('~/pages/new.vue').then(r => r.default || r)
    },
    {
      name: 'notifications',
      path: '/notifications',
      component: () => import('~/pages/notifications.vue')
    },
    {
      name: 'settings',
      path: '/settings',
      component: () => import('~/pages/settings.vue')
    },
    {
      name: 'signout',
      path: '/signout',
      component: () => import('~/pages/signout.vue')
    },
    {
      name: 'dashboard',
      path: '/dashboard',
      component: () => import('~/pages/dashboard.vue')
    },
    {
      name: 'gallery',
      path: '/gallery',
      component: () => import('/pages/gallery.vue')
    },    
    {
      name: 'subgallery',
      path: '/gallery/:test',
      component: () => import('/pages/gallery.vue')
    },
    {
      name: 'settings',
      path: '/settings',
      component: () => import('/pages/settings.vue')
    },
    {
      name: 'onboard',
      path: '/onboard',
      component: () => import('/pages/onboard.vue')
    },
    {
      name: 'profile',
      path: '/@:username',
      component: () => import('~/pages/profile.vue').then(r => r.default || r),
      props: true
    },
    {
      name: 'post',
      path: '/@:username/:postid',
      component: () => import('~/pages/post.vue').then(r => r.default || r),
      props: true
    },
    {
      name: 'editpost',
      path: '/@:username/:postid/edit',
      component: () => import('~/pages/new.vue')
    },
    {
      name: 'page',
      path: '/p/:pageid',
      component: () => import('~/pages/p.vue')
    }
  ].map(route => withMeta(_routes, route)),
}

function withMeta(originalRoutes: Readonly<RouteRecordRaw[]>, route: RouteRecordRaw) {
  const originalRoute = originalRoutes.find(originalRoute => {

    if (route.name == "editpost"){
      return originalRoute.name == 'new';
    }else{
      return(originalRoute.path === route.path);
    }

  })  
  return mergeModels(originalRoute, route)
}