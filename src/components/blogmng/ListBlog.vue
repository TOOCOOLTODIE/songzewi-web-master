<template>
  <div>
    <h1>我对世界说过的</h1>
    <el-container>
      <el-header style="padding: 10px;width: 100%;alignment: center">
        <div class="demo-input-suffix">
          <!--搜索框-->
          <el-input class="inline-input;"
                    v-model="keyWords"
                    @change="keywordschange"
                    placeholder="请输入标题/标签后按回车"
                    prefix-icon="el-icon-search"
                    style="width: 650px;"
                    @keyup.enter.native="searchblogs">

          </el-input>
        </div>
      </el-header>
      <el-main>
        <!--博客列表-->
        <template>
          <el-table :data="blogs"
                    style="width:76%;margin-left:170px;alignment: center"
                    stripe
                    border
                    size="mini"
                    v-loading="tableLoading">
            <el-table-column label="标题" width="145">
              <template slot-scope="scope">
                <span>{{scope.row.title}}</span>
              </template>
            </el-table-column>
            <el-table-column label="标签" width="90">
              <template slot-scope="scope">
                <span>{{scope.row.tags}}</span>
              </template>
            </el-table-column>
            <el-table-column label="更新时间" width="120">
              <template slot-scope="scope">
                <span>{{scope.row.updateTime}}</span>
              </template>
            </el-table-column>
            <el-table-column label="发表时间" width="120">
              <template slot-scope="scope">
                <span>{{scope.row.publicTime}}</span>
              </template>
            </el-table-column>
            <el-table-column label="私密" width="50">
              <template slot-scope="scope">
                <span>{{scope.row.isPrivate}}</span>
              </template>
            </el-table-column>
            <el-table-column label="说明" width="100">
              <template slot-scope="scope">
                <span>{{scope.row.note}}</span>
              </template>
            </el-table-column>

            <el-table-column label="操作" width="70">
              <template slot-scope="scope">
                <el-link @click="handleEdit(scope.$index,scope.row)" icon="el-icon-edit">编辑</el-link>
              </template>
            </el-table-column>
            <el-table-column label="操作" width="70">
              <template slot-scope="scope">
                <el-link @click="handleView(scope.$index,scope.row)">查看<i class="el-icon-view el-icon--right"></i>
                </el-link>
              </template>
            </el-table-column>
          </el-table>
          <el-dialog  width="60%" title="简单点，说话的方式简单点" :visible.sync="dialogTableVisible">
            <el-form :data="blog">
              <div style="margin-top: 0px;">
                <el-form-item prop="title">
                  <el-input placeholder="先说个主题吧" clearable v-model="blog.title"></el-input>
                </el-form-item>
              </div>
              <div style="padding-top:2px;text-align:left;">
                <el-form-item prop="tags">
                  <i class="el-icon-price-tag"></i>
                  <el-tag
                    type="info"
                    size="medium"
                    color="white"
                    v-for="(tag,i) in blog.tags"
                    :key="'tag'+i"
                    :disable-transitions="false"
                    @close="handleClose(tag)" closable>
                    {{tag}}
                  </el-tag>

                  <el-input class="input-new-tag"
                            v-if="inputVisible"
                            v-model="inputValue"
                            size="small"
                            ref="saveTagInput"
                            @key.enter.native="handleInputConfirm"
                            @blur="handleInputConfirm">

                  </el-input>
                  <el-button v-else size="small" v-bind:disabled="disableInput" class="button-new-tag"
                             @click="showInput">
                    关于啥的
                  </el-button>
                </el-form-item>
              </div>
              <tinymce-editor :setting="editorSetting" :value="value" ref="editor" :disabled="disabled">

              </tinymce-editor>

            <el-button type="warning" @click="handleUpdateBlog">提交</el-button>
            <el-button type="info" @click="dialogTableVisible = false">关闭</el-button>
            </el-form>

          </el-dialog>
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
  import TinymceEditor from './Editor'
  import HeadEditor from './HeadEditor'
  export default {
    name: "ListBlog",
    components:{
      TinymceEditor,
      HeadEditor
    },
  /*  props: {
      //传入一个value，使组件支持v-model绑定
      value: {
        type: String,
        default: ''
      },
    },*/
    data() {
      return {
        inputVisible: false,
        inputValue: '',
        disableInput: false,
        disabled:false,
        dialogTableVisible:false,
        input: '',
        blogs: [],
        blog: {
          id:'',
          title: '',
          content: this.value,
          tags: [],
          userId: '',
          note:'',
          isPrivate:''
        },
        totalCount: -1,
        currentPage: 1,
        size: 5,
        keyWords: '',
        tableLoading: false,
        value:'',
        title:'',
        editorSetting:{
          height:80
        },
      }
    },
    mounted: function () {
      this.loadBlogs();
    },
    watch:{
      'blog.tags': {
        handler: function (newValue, oldValue) {
          if (this.blog.tags.length == 6) {
            this.disableInput = true;
            this.$message({
              message: '最多6个标签哦',
              type: 'info'
            });
          } else if (this.blog.tags.length < 6) {
            this.disableInput = false;
          }
        }
      },
    },
    methods: {
      handleUpdateBlog(){
        if(this.blog.title == ''){
          this.$message({message: '你要先说个主题啥的吧', type: 'warning'});
          return;
        }
        if(this.blog.content == ''){
          this.$message({message: '你要先说个内容啥的吧', type: 'warning'});
          return;
        }
        var _this = this;
        this.blog.userId = this.$store.state.user.id;
        this.blog.content=this.$refs.editor.myValue;
        this.postRequest('/blogMng/updateBlog', this.blog).then(resp => {
          var status = resp.status;
          if (status == 200) {
            this.dialogTableVisible = false;
            this.loadBlogs();

          } else {
            this.$message({message: '更新失败！', type: 'warning'});
          }

        });
      },
      handleClose(tag) {
        //关闭标签时，便签中的元素分离掉。
        this.blog.tags.splice(this.blog.tags.indexOf(tag), 1);
      },
      handleInputConfirm() {
        let inputValue = this.inputValue;
        if (inputValue) {
          this.blog.tags.push(inputValue);
        }
        this.inputVisible = false;
        this.inputValue = '';
      },
      showInput() {
        this.inputVisible = true;
        this.$nextTick(_ => {
          this.$refs.saveTagInput.$refs.input.focus();
        });
      },
      handleEdit(index, row) {
        var _this = this;
        this.value = row.content
        console.log("value=",this.value)
        _this.blog.title = row.title
        _this.blog.id = row.id
        if(row.tags && row.tags.length > 0){
          this.blog.tags = row.tags.split(',')
        }

        this.dialogTableVisible = true;
      },
      handleView(index, row) {
        var id = row.id
        this.$router.push({path:'/blogDetail/'+id})
      },
      loadBlogs() {
        var _this = this;
        this.getRequest("/blogMng/listBlog?page=" +
          this.currentPage + "&size=" +
          this.size + "&keywords=" +
          this.keyWords + "&userId=" +
          this.$store.state.user.id
        ).then(resp => {
          if (resp && resp.status == 200) {
            var data = resp.data;
            _this.totalCount = data.totalCount;
            _this.blogs = data.blogs;
          }
        })
      },
      currentChange(currentChange) {
        this.currentPage = currentChange;
        this.loadBlogs();
      },
      searchblogs() {
        this.currentPage = 1;
        this.size = 5;
        this.loadBlogs();
      },
      keywordschange(val) {
        if (val == '') {
          this.loadBlogs();
        }
      },
    }
  }
</script>

<style scoped>

</style>
