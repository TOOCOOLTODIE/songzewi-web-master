<template>
  <div>
    <h1>欢迎登录系统</h1>
    <el-container>
      <el-header style="padding: 10px;width: 100%;alignment: center">
        <div class="demo-input-suffix">
          <!--搜索框-->
          <el-input class="inline-input;"
                    v-model="keyWords"
                    @change="keywordschange"
                    placeholder="请输入员工姓名或身份证后四位，记得回车！"
                    prefix-icon="el-icon-search"
                    @keyup.enter.native="searchstaffs"
                    style="width: 650px;">

          </el-input>
        </div>
      </el-header>
      <el-main>
        <!--人员列表-->
        <template>
          <el-table :data="staffs"
                    style="width:76%;margin-left:170px;alignment: center"
                    stripe
                    border
                    size="mini"
                    v-loading="tableLoading">
            <el-table-column prop="name" label="姓名" width="90"/>
            <el-table-column prop="sex" label="性别" width="70"/>
            <el-table-column prop="birthday" label="出生日期" width="90"/>
            <el-table-column prop="idCard" label="身份证号" width="120"/>
            <el-table-column prop="isMerried" label="婚姻状况" width="80"/>
            <el-table-column prop="nation" label="民族" width="60"/>
            <el-table-column prop="nativePlace" label="籍贯" width="115"/>
            <el-table-column prop="politialStatus" label="政治面貌" width="90"/>
            <el-table-column prop="email" label="邮箱" width="140"/>
            <el-table-column prop="updateTime" label="更新时间" width="140"/>a
          </el-table>
        </template>
        <el-pagination
          background
          :page-size="size"
          :current-page="currentPage"
          @current-change="currentChange"
          layout="prev, pager, next"
          :total="totalCount">
        </el-pagination>

      </el-main>
    </el-container>

  </div>
</template>

<script>
  export default {
    name: "Staff",
    data() {
      return {
        input: '',
        staffs: [],
        totalCount:-1,
        currentPage:1,
        size:5,
        keyWords:'',
        tableLoading:false,
      }
    },
    mounted:function(){
      this.loadStaff();
    },
    methods: {
      loadStaff() {
        var _this = this;
        this.getRequest("/api/staff/list?page="+this.currentPage+"&size="+this.size+"&keywords="+this.keyWords).then(resp => {
          if (resp && resp.status == 200) {

            var data = resp.data;
            _this.totalCount = data.count;
            _this.staffs = data.users;
          }
        })
      },
     currentChange(currentChange){
        this.currentPage = currentChange;
        this.loadStaff();

      },
      searchstaffs(){
        this.currentPage = 1;
        this.size = 5;
        this.loadStaff();
      },
      keywordschange(val){
        if(val == ''){
          this.loadStaff();
        }
      },
    }
  }
</script>

<style scoped>

</style>
