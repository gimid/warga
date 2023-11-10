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
      cors: true
    },    
    {
      name: 'admin',
      path: '/admin',
      component: () => import('~/pages/admin.vue').then(r => r.default || r),
      props: true,
      cors: true
    },
    {
      name: 'enter',
      path: '/enter',
      component: () => import('~/pages/enter.vue')
    },    
    {
      name: 'enterm',
      path: '/enterm',
      component: () => import('~/pages/enterm.vue'),
      cors: true
    },
    {
      name: 'register',
      path: '/register',
      component: () => import('~/pages/register.vue'),
      cors: true
    },
    {
      name: 'tentang',
      path: '/tentang',
      component: () => import('~/pages/about.vue').then(r => r.default || r),
      cors: true
    },
    {
      name: 'new',
      path: '/new',
      component: () => import('~/pages/new.vue').then(r => r.default || r),
      cors: true
    },
    {
      name: 'notifications',
      path: '/notifications',
      component: () => import('~/pages/notifications.vue'),
      cors: true
    },
    {
      name: 'settings',
      path: '/settings',
      component: () => import('~/pages/settings.vue'),
      cors: true
    },
    {
      name: 'signout',
      path: '/signout',
      component: () => import('~/pages/signout.vue'),
      cors: true
    },
    {
      name: 'dashboard',
      path: '/dashboard',
      component: () => import('~/pages/dashboard.vue'),
      cors: true
    },
    {
      name: 'gallery',
      path: '/gallery',
      component: () => import('/pages/gallery.vue'),
      cors: true
    },    
    {
      name: 'subgallery',
      path: '/gallery/:test',
      component: () => import('/pages/gallery.vue'),
      cors: true
    },
    {
      name: 'settings',
      path: '/settings',
      component: () => import('/pages/settings.vue'),
      cors: true
    },
    {
      name: 'onboard',
      path: '/onboard',
      component: () => import('/pages/onboard.vue'),
      cors: true
    },
    {
      name: 'profile',
      path: '/@:username',
      component: () => import('~/pages/profile.vue').then(r => r.default || r),
      props: true,
      cors: true
    },
    {
      name: 'post',
      path: '/@:username/:postid',
      component: () => import('~/pages/post.vue').then(r => r.default || r),
      props: true,
      cors: true
    },
    {
      name: 'editpost',
      path: '/@:username/:postid/edit',
      component: () => import('~/pages/new.vue'),
      cors: true
    },
    {
      name: 'page',
      path: '/p/:pageid',
      component: () => import('~/pages/p.vue'),
      cors: true
    },
    {
      path: "/:pathMatch(.*)*",
      component: () => import('~/pages/404.vue'),
      cors: true
    },
    {
      name: 'comment',
      path: '/comment/:commentid',
      component: () => import('~/pages/comment.vue'),
      cors: true
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