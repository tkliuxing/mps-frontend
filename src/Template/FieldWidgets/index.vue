<template>
  <div class="widget-choices">
    <el-row :gutter="10">
      <el-col :span="24">
        <fieldset>
          <legend>单行输入框</legend>
          <el-row :gutter="10">
            <el-col :span="6" v-for="item in inputs" :key="item.name">
              <div class="widget" @click="selectWidget(item)">
                <div class="name">{{ item.title }} ：{{ item.name }}</div>
                <div class="desc">{{ item.desc }}</div>
                <div class="img" v-if="item.image">
                  <img :src="item.image" alt="">
                </div>
              </div>
            </el-col>
          </el-row>
        </fieldset>
      </el-col>
      <el-col :span="24">
        <fieldset>
          <legend>数值输入框</legend>
          <el-row :gutter="10">
            <el-col :span="6" v-for="item in number" :key="item.name">
              <div class="widget" @click="selectWidget(item)">
                <div class="name">{{ item.title }} ：{{ item.name }}</div>
                <div class="desc">{{ item.desc }}</div>
                <div class="img" v-if="item.image">
                  <img :src="item.image" alt="">
                </div>
              </div>
            </el-col>
          </el-row>
        </fieldset>
      </el-col>
      <el-col :span="24">
        <fieldset>
          <legend>单选按钮</legend>
          <el-row :gutter="10">
            <el-col :span="6" v-for="item in radio" :key="item.name">
              <div class="widget" @click="selectWidget(item)">
                <div class="name">{{ item.title }} ：{{ item.name }}</div>
                <div class="desc">{{ item.desc }}</div>
                <div class="img" v-if="item.image">
                  <img :src="item.image" alt="">
                </div>
              </div>
            </el-col>
          </el-row>
        </fieldset>
      </el-col>
      <el-col :span="24">
        <fieldset>
          <legend>下拉单选</legend>
          <el-row :gutter="10">
            <el-col :span="6" v-for="item in select" :key="item.name">
              <div class="widget" @click="selectWidget(item)">
                <div class="name">{{ item.title }} ：{{ item.name }}</div>
                <div class="desc">{{ item.desc }}</div>
                <div class="img" v-if="item.image">
                  <img :src="item.image" alt="">
                </div>
              </div>
            </el-col>
          </el-row>
        </fieldset>
      </el-col>
      <el-col :span="24">
        <fieldset>
          <legend>级联选择器</legend>
          <el-row :gutter="10">
            <el-col :span="6" v-for="item in cascader" :key="item.name">
              <div class="widget" @click="selectWidget(item)">
                <div class="name">{{ item.title }} ：{{ item.name }}</div>
                <div class="desc">{{ item.desc }}</div>
                <div class="img" v-if="item.image">
                  <img :src="item.image" alt="">
                </div>
              </div>
            </el-col>
          </el-row>
        </fieldset>
      </el-col>
      <el-col :span="24">
        <fieldset>
          <legend>多选框</legend>
          <el-row :gutter="10">
            <el-col :span="6" v-for="item in checkbox" :key="item.name">
              <div class="widget" @click="selectWidget(item)">
                <div class="name">{{ item.title }} ：{{ item.name }}</div>
                <div class="desc">{{ item.desc }}</div>
                <div class="img" v-if="item.image">
                  <img :src="item.image" alt="">
                </div>
              </div>
            </el-col>
          </el-row>
        </fieldset>
      </el-col>
      <el-col :span="24">
        <fieldset>
          <legend>下拉多选</legend>
          <el-row :gutter="10">
            <el-col :span="6" v-for="item in multiple_select" :key="item.name">
              <div class="widget" @click="selectWidget(item)">
                <div class="name">{{ item.title }} ：{{ item.name }}</div>
                <div class="desc">{{ item.desc }}</div>
                <div class="img" v-if="item.image">
                  <img :src="item.image" alt="">
                </div>
              </div>
            </el-col>
          </el-row>
        </fieldset>
      </el-col>
      <el-col :span="24">
        <fieldset>
          <legend>日期</legend>
          <el-row :gutter="10">
            <el-col :span="6" v-for="item in date" :key="item.name">
              <div class="widget" @click="selectWidget(item)">
                <div class="name">{{ item.title }} ：{{ item.name }}</div>
                <div class="desc">{{ item.desc }}</div>
                <div class="img" v-if="item.image">
                  <img :src="item.image" alt="">
                </div>
              </div>
            </el-col>
          </el-row>
        </fieldset>
      </el-col>
      <el-col :span="24">
        <fieldset>
          <legend>文件上传</legend>
          <el-row :gutter="10">
            <el-col :span="6" v-for="item in upload" :key="item.name">
              <div class="widget" @click="selectWidget(item)">
                <div class="name">{{ item.title }} ：{{ item.name }}</div>
                <div class="desc">{{ item.desc }}</div>
                <div class="img" v-if="item.image">
                  <img :src="item.image" alt="">
                </div>
              </div>
            </el-col>
          </el-row>
        </fieldset>
      </el-col>
      <el-col :span="24">
        <fieldset>
          <legend>富文本</legend>
          <el-row :gutter="10">
            <el-col :span="6" v-for="item in richtext" :key="item.name">
              <div class="widget" @click="selectWidget(item)">
                <div class="name">{{ item.title }} ：{{ item.name }}</div>
                <div class="desc">{{ item.desc }}</div>
                <div class="img" v-if="item.image">
                  <img :src="item.image" alt="">
                </div>
              </div>
            </el-col>
          </el-row>
        </fieldset>
      </el-col>
      <el-col :span="24">
        <fieldset>
          <legend>颜色选择器</legend>
          <el-row :gutter="10">
            <el-col :span="6" v-for="item in color_picker" :key="item.name">
              <div class="widget" @click="selectWidget(item)">
                <div class="name">{{ item.title }} ：{{ item.name }}</div>
                <div class="desc">{{ item.desc }}</div>
              </div>
            </el-col>
          </el-row>
        </fieldset>
      </el-col>
    </el-row>

    <el-drawer
      :visible.sync="showDataSourceSelect"
      :append-to-body="true"
      :close-on-press-escape="false"
      :size="1000"
    >
      <div style="padding: 10px;">
        <select-base-tree v-if="showDataSourceSelect" :sys_id="sys_id" :biz_id="biz_id" @select="setJson"/>
      </div>
      <h2>可自由编辑以下内容</h2>
      <div
        class="jsonEditor"
        id="arguments"
      ></div>
      <div style="text-align: center;margin-top: 10px;">
        <el-button
          type="primary"
          @click="getAndClear"
        >确定</el-button>
      </div>
    </el-drawer>

  </div>
</template>

<script>
import inputs from "./components/input";
import radio from "./components/radio";
import select from "./components/select";
import upload from "./components/upload";
import cascader from "./components/cascader";
import date from "./components/date";
import checkbox from "./components/checkbox";
import number from "./components/number";
import richtext from "./components/richtext";
import multiple_select from "./components/multiple_select";
import color_picker from "./components/color_picker";
import SelectBaseTree from "../SelectBaseTree.vue";
import ca from "element-ui/src/locale/lang/ca";

export default {
  name: "FieldWidgetSelect",
  computed: {
    ca() {
      return ca
    }
  },
  components: {SelectBaseTree},
  props: {
    sys_id: Number,
    biz_id: Number,
    data_source: '',
  },
  data() {
    return {
      widget: null,
      inputs,
      radio,
      multiple_select,
      select,
      upload,
      cascader,
      date,
      checkbox,
      number,
      showDataSourceSelect: false,
      editor: null,
      json: {},
      richtext,
      color_picker
    };
  },
  methods: {
    async selectWidget(widget) {
      this.widget = JSON.parse(JSON.stringify(widget));
      if(this.widget.needRelated){
        let {value} = await this.$prompt('此控件需要两个字段,先创建结束时间字段为隐藏字段,然后输入这个隐藏字段名,跟你现在创建的这个开始时间字段绑定(提示:输入的这个为结束字段)', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
        });
        this.widget.related_alias = value;
      }
      if(this.widget.needDataSource){
        console.log('需要数据源');
        this.showDataSourceSelect = true;
        this.$nextTick(() => {
          this.getJSONedit();
        });
        return
      }
      this.$emit('select', this.widget)
    },
    setJson(json) {
      this.json = json;
      this.editor.set(this.json);
    },
    getAndClear() {
      this.json = {};
      let value = this.editor.getText();
      this.showDataSourceSelect = false;
      this.$nextTick(() => {
        if(this.widget){
          let data = this.widget;
          data.data_source = value;
          this.$emit('select', data);
        }
      });
    },
    getJSONedit() {
      if (!this.editor) {
        const container = document.getElementById("arguments");
        const options = {
          modes: ["code", "tree", "form", "text", "view", "preview"],
          search: true,
        };
        this.editor = new this.$jsoneditor(container, options);
      }
      //set json
      this.editor.set(this.json ? this.json : {});
    },
  },
  mounted() {
    try{
      this.json = JSON.parse(this.data_source);
      // this.getJSONedit();
    } catch (e) {
      this.json = {};
      // this.getJSONedit();
    }
  }
}
</script>

<style scoped lang="scss">
.widget-choices {
  fieldset{
    padding: 0 10px;
    border-radius: 10px;
    margin-bottom: 20px;
    legend {
      font-size: 16px;
      font-weight: bold;
      margin: 0 10px;
      padding: 0 5px;
      box-sizing: border-box;
    }
    .widget{
      min-height: 100px;
      border: 1px solid #ebeef5;
      margin-bottom: 10px;
      padding: 10px;
      border-radius: 10px;
      &:hover{
        border-color: #0099d1;
        background: #f3fcff;
        cursor: pointer;
      }
      .name{
        color: #0099d1;
        margin-bottom: 5px;
      }
      .desc{
        color: #666666;
      }
    }
  }
}
</style>
