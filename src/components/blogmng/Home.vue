<template>
  <div>
    <el-container class="home-container">
      <!--布局的头-->
      <el-header style="height: 90px" class='header-container'>
        <div style="padding-top: 30px;margin-left: 50px;font-size: large;font-family: 黑体">
          <span >你还有什么话对这个世界说吗</span>
        </div>

        <div style="float: right;margin-right: 20px;padding-buttom: 25px">
          <span style="padding-right: 20px">hi,{{user.name}}</span>
        <el-dropdown>
          <span style="color: #f3f3f3;font-size: small">
            我的<i class="el-icon-arrow-down el-icon--right"></i>
          </span>
          <el-dropdown-menu slot="dropdown">
            <el-dropdown-item>个人中心</el-dropdown-item>
            <el-dropdown-item>设置</el-dropdown-item>
            <el-dropdown-item>退出</el-dropdown-item>
          </el-dropdown-menu>
        </el-dropdown>
        </div>
      </el-header>
      <el-container>
        <!--左布局-->
        <el-aside width="180px" class="aside-container">
          <el-menu
            style="font-family: 黑体;"
            default-active="2"
            @open="handleOpen"
            @close="handleClose"
            @select="handleSelect"
            background-color="#7a7374"
            text-color="#f3f3f3"
            active-text-color="#cdd1d3">
            <el-submenu index="1">
              <template slot="title">
                <i class="el-icon-location"></i>
                <span>还有话说</span>
              </template>
              <el-menu-item-group>
                <el-menu-item index="1-1">我要说</el-menu-item>
                <el-menu-item index="1-2">我说了</el-menu-item>
              </el-menu-item-group>
              <el-menu-item-group title="分组2">
                <el-menu-item index="1-3">选项3</el-menu-item>
              </el-menu-item-group>
              <el-submenu index="1-4">
                <template slot="title">选项4</template>
                <el-menu-item index="1-4-1">选项1</el-menu-item>
              </el-submenu>
            </el-submenu>
            <el-menu-item index="2">
              <i class="el-icon-menu"></i>
              <span slot="title">没话说了</span>
            </el-menu-item>
            <el-menu-item index="3" disabled>
              <i class="el-icon-document"></i>
              <span slot="title">导航三</span>
            </el-menu-item>
            <el-menu-item index="4">
              <i class="el-icon-setting"></i>
              <span slot="title">导航四</span>
            </el-menu-item>
          </el-menu>
        </el-aside>
        <!--主布局-->
        <el-main style="padding-right: 100px;padding-bottom: 30px">
          <el-breadcrumb separator="/">
            <el-breadcrumb-item :to="{path:'/blogmng/home'}">首页</el-breadcrumb-item>
            <el-breadcrumb-item v-for="item in breadcrumbs" :key="item.id">{{item}}</el-breadcrumb-item>
          </el-breadcrumb>
          <router-view></router-view>
        </el-main>
      </el-container>
    </el-container>
  </div>
</template>
<script>
  export default {
    data() {
      return {
        breadcrumbs: ['还有话说'],
        strf:true
      }
    },
    methods: {
      handleOpen(key, keyPath) {
        console.log(key, keyPath);
      },
      handleClose(key, keyPath) {
        console.log(key, keyPath);
      },
      handleCommand(cmd) {
      },
      handleSelect(index, indexPath) {
       /* this.$message({message:index,type:'info'});*/
        switch (index) {
          case '2':
            this.$router.push("/blogmng/home");
            this.breadcrumbs = ['没话说了'];
            break;
          case '1-1':
            this.$router.push("/editBlog");
            this.breadcrumbs = ['我要说'];
            break;
          case '1-2':
            this.$router.push("/staff");
            this.breadcrumbs = ['我说了'];
            break;
        }

      }
    },
    computed: {

      user(){
        return this.$store.state.user;
      }
    }
  }
</script>
<style>
  .home-container {
    height: 80%;
    position: absolute;
    top: 0px;
    left: 0px;
    width: 100%;
  }

  .header-container {
    background-color: #a6897c;
    color: #f3f3f3;
    padding-top: 10px;
  }

  .aside-container {
    background-color: #7a7374;
    height: 560px;
  }

  .el-submenu .el-menu-item {
    width: 180px;
  }

  .el-icon-arrow-down {
    font-size: 12px;
  }
  .home_title {
    color: #fff;
    font-size: 22px;
  }

</style>
