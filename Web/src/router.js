const RouterConfig = {
  // mode: 'history',
  routes: [
    {
      name: 'index_user',
      path: '/',
      component: resolve => require(['./views/index/layout_user'], resolve),
    },
    {
      name: 'index_admin',
      path: '/admin',
      component: resolve => require(['./views/index/layout_admin'], resolve),
      children: [
        {
          name: 'allCommunity',
          path: 'allCommunity',
          component: resolve => require(['./views/index/admin/allCommunity'], resolve),
        },
        {
          name: 'allCommunityCheck',
          path: 'allCommunityCheck',
          component: resolve => require(['./views/index/admin/allCommunityCheck'], resolve),
        },
        {
          name: 'allCommunityMod',
          path: 'allCommunityMod',
          component: resolve => require(['./views/index/admin/allCommunityMod'], resolve),
        },
        {
          name: 'allActivity',
          path: 'allActivity',
          component: resolve => require(['./views/index/admin/allActivity'], resolve),
        },
        {
          name: 'allActivityCheck',
          path: 'allActivityCheck',
          component: resolve => require(['./views/index/admin/allActivityCheck'], resolve),
        },
      ]
    },
    {
      name: 'login',
      path: '/login',
      component: resolve => require(['./views/entry/login'], resolve)
    },
    {
      name: 'register',
      path: '/register',
      component: resolve => require(['./views/entry/register'], resolve)
    },
    {
      path: '*',
      redirect: '/'
    }
  ]
};
export default RouterConfig;
