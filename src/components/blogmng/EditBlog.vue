<template>
  <el-form :model="blog" :rules="rules">
  <el-container>
    <el-header>
      <div style="width: 800px;margin-top: 5px;margin-left: 140px">
        <el-form-item prop="title">
          <el-input placeholder="这里输入标题" clearable v-model="blog.title"></el-input>
        </el-form-item>
      </div>
      <div style="padding-top:5px;text-align:left;margin-left: 140px">
        <span><i class="el-icon-price-tag"></i></span>
        <el-tag
          type="info"
          size="medium"
          color="white"
          v-for="(tag,i) in dynamicTags"
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
        <el-button v-else size="small" v-bind:disabled="disableInput" class="button-new-tag" @click="showInput">添加标签</el-button>
      </div>
    </el-header>
    <el-main style="margin-top: 20px;margin-left: 140px">
      <el-form-item prop="content">
        <editor v-model="blog.content"
                :init="init"
                :disabled="disabled"
                @onClick="onClick">
        </editor>
      </el-form-item>

    </el-main>
    <el-footer>
      <el-form>
        <el-button @click="saveOn">保存并继续添加</el-button>
        <el-button @click="save">保存</el-button>
        <el-button @click="cancel">取消</el-button>
      </el-form>
    </el-footer>
  </el-container>
  </el-form>
</template>

<script>
  import tinymce from 'tinymce/tinymce'
  import Editor from '@tinymce/tinymce-vue'
  import 'tinymce/themes/modern/theme'
  import 'tinymce/plugins/image'
  import 'tinymce/plugins/media'
  import 'tinymce/plugins/table'
  import 'tinymce/plugins/lists'
  import 'tinymce/plugins/contextmenu'
  import 'tinymce/plugins/wordcount'
  import 'tinymce/plugins/colorpicker'
  import 'tinymce/plugins/textcolor'

  export default {
    components: {
      Editor
    },
    props: {
      //传入一个value，使组件支持v-model绑定
      value: {
        type: String,
        default: ''
      },
      disabled: {
        type: Boolean,
        default: false
      },
      plugins: {
        type: [String, Array],
        default: 'lists image media table textcolor wordcount contextmenu'
      },
      toolbar: {
        type: [String, Array],
        default: 'undo redo |  formatselect | bold italic | alignleft aligncenter alignright alignjustify | bullist numlist outdent indent | lists image media table | removeformat'
      }
    },
    data() {
      return {
        //初始化配置
        init: {
          language_url: '/static/tinymce/zh_CN.js',
          language: 'zh_CN',
          skin_url: '/static/tinymce/skins/lightgray',
          height: 310,
          width: 800,
          plugins: "autoresize",
          plugins: this.plugins,
          toolbar: this.toolbar,
          branding: false,
          menubar: false,
          //此处为图片上传处理函数，这个直接用了base64的图片形式上传图片，
          //如需ajax上传可参考https://www.tiny.cloud/docs/configure/file-image-upload/#images_upload_handler
          images_upload_handler: (blobInfo, success, failure) => {
            const img = 'data:image/jpeg;base64,' + blobInfo.base64()
            success(img)
          }
        },
        dynamicTags: [],
        inputVisible:false,
        inputValue:'',
        disableInput:false,
        blog:{
          title:'',
          content:this.value
        }
      }
    },
    mounted() {
      tinymce.init({})
    },
    methods: {
      //添加相关的事件，可用的事件参照文档=> https://github.com/tinymce/tinymce-vue => All available events
      //需要什么事件可以自己增加
      onClick(e) {
        this.$emit('onClick', e, tinymce)
      },
      //可以添加一些自己的自定义事件，如清空内容
      clear() {
        this.blog.content = ''
      },
      handleClose(tag) {
        //关闭标签时，便签中的元素分离掉。
        this.dynamicTags.splice(this.dynamicTags.indexOf(tag), 1);
      },
      handleInputConfirm(){
        let inputValue = this.inputValue;
        if (inputValue) {
          this.dynamicTags.push(inputValue);
        }
        this.inputVisible = false;
        this.inputValue = '';
      },
      showInput(){
        this.inputVisible = true;
        this.$nextTick(_ => {
          this.$refs.saveTagInput.$refs.input.focus();
        });
      }
    },
    watch: {
      value(newValue) {
        this.blog.content = newValue
      },
      myValue(newValue) {
        this.$emit('input', newValue)
      },
      'dynamicTags':{
        handler:function (newValue,oldValue) {
          console.info('dynamicTags changed:'+ newValue);
          console.info('size:'+this.dynamicTags.length)
          if(this.dynamicTags.length == 6){
            this.disableInput = true;
            this.$message({
              message:'最多6个标签哦',
              type:'info'
            });
          }else if(this.dynamicTags.length < 6){
            this.disableInput = false;
          }


        }
      },
    }
  }

</script>
<style scoped>
  .el-tag + .el-tag {
    margin-left: 10px;
  }
  .button-new-tag{
    margin-left: 10px;
    height: 32px;
    line-height: 30px;
    padding-top: 0;
    padding-bottom: 0;
  }
  .input-new-tag{
    width: 90px;
    margin-left: 10px;
    vertical-align: bottom;
  }

</style>

