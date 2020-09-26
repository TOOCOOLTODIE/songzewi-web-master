import Vue from 'vue'
import Router from 'vue-router'
import Login from '@/components/Login'
import BlogHome from '@/components/blogmng/Home'
import EditBlog from '@/components/blogmng/EditBlog'
import Blog from '@/components/blogmng/Blog'
import ListBlog from '@/components/blogmng/ListBlog'

Vue.use(Router)
const originalPush = Router.prototype.push
Router.prototype.push = function push (location) {
  return originalPush.call(this, location).catch(err => err)
}
export default new Router({
  routes: [
    {
      path: '/',
      name: 'Login',
      component: Login
    },
    {
      path:'/blogmng/home',
      name:'博客首页',
      component:BlogHome,
      children:[

        {
          path:'/editBlog',
          name:'EditBlog',
          component:EditBlog
        },
        {
          path:'/listBlog',
          name:'ListBlog',
          component:ListBlog
        }
      ]
    }
  ]
})
