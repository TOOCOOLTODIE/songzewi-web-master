import Vue from 'vue'
import Router from 'vue-router'
import Login from '@/components/Login'
import Staff from '@/components/staff/Staff'
import BlogHome from '@/components/blogmng/Home'
import EditBlog from '@/components/blogmng/EditBlog'
import Blog from '@/components/blogmng/Blog'

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
          path: '/staff',
          name: 'Staff',
          component: Staff
        },
        {
          path:'/editBlog',
          name:'EditBlog',
          component:EditBlog
        },
        {
          path:'/blog',
          name:'Blog',
          component:Blog
        }
      ]
    }
  ]
})
