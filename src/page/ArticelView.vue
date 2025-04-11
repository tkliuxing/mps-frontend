<template>
  <div>
    <el-card class="box-card" v-if="article.pk">
      <el-card class="box-card">
        <div slot="header" class="clearfix">
          <el-breadcrumb separator-class="el-icon-arrow-right">
            <el-breadcrumb-item>{{ article.category_info.name }}</el-breadcrumb-item>
            <el-breadcrumb-item>{{ article.title }}</el-breadcrumb-item>
          </el-breadcrumb>
          <el-button style="float: right; padding: 3px 10px; color:#111111;" type="text">{{ article.create_user_name }}
            ({{ article.create_time_display }})
          </el-button>
        </div>
        <p>本文链接:
          <router-link :to="{name: 'ArticelView', params:{pk:article.pk}}" custom v-slot="{href}">
            <a class="el-link el-link--primary is-underline" :href="href" target="_blank">右键复制此链接</a>
          </router-link>
        </p>
        <el-divider></el-divider>
        <div class="article-content" v-html="article.content"></div>
      </el-card>
    </el-card>
  </div>
</template>

<script>
import resource from "@/resource";

export default {
  name: "ArticelView",
  data() {
    return {
      article: {
        pk: null,
        title: '',
        create_user_name: '',
        create_time_display: '',
        content: '',
        category_info: {
          name: '',
        },
      },
    }
  },
  async mounted(){
    try{
      this.article = await resource.getObj('article', this.$route.params.pk);
    } catch (e) {
      console.error(e);
    }
  },
}
</script>

<style scoped>

</style>
