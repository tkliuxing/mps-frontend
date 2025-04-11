<template>
  <div id="bpmns">
<!--    <my-process-palette :title="workflowdefine.name || null" />-->
    <my-process-designer
      :key="`designer-${reloadIndex}`"
      :options="{
        taskResizingEnabled: true,
        eventResizingEnabled: true,
        minimap: {
          open: true
        }
      }"
      v-model="xmlString"
      v-bind="controlForm"
      :remote-file="onlineFileURL"
      keyboard
      ref="processDesigner"
      @element-click="elementClick"
      @element-contextmenu="elementContextmenu"
      @init-finished="initModeler"
      @upload-bpmn="uploadBpmn"
      :title="workflowdefine.name || null"
      style="min-height: 800px"
    >
    </my-process-designer>
    <my-properties-panel :key="`penal-${reloadIndex}`" :bpmn-modeler="modeler" :prefix="controlForm.prefix" class="process-panel" :formtemplate="formtemplate" />

    <!-- demo config -->
    <div class="demo-control-bar">
      <div class="open-model-button" @click="controlDrawerVisible = true"><i class="el-icon-setting"></i></div>
    </div>
    <el-drawer :visible.sync="controlDrawerVisible" size="400px" title="偏好设置" append-to-body destroy-on-close>
      <el-form :model="controlForm" size="small" label-width="100px" class="control-form" @submit.native.prevent>
        <el-form-item label="流程ID">
          <el-input v-model="controlForm.processId" @change="reloadProcessDesigner(true)" />
        </el-form-item>
        <el-form-item label="流程名称">
          <el-input v-model="controlForm.processName" @change="reloadProcessDesigner(true)" />
        </el-form-item>
        <el-form-item label="流转模拟">
          <el-switch v-model="controlForm.simulation" inactive-text="停用" active-text="启用" @change="reloadProcessDesigner()" />
        </el-form-item>
        <el-form-item label="禁用双击">
          <el-switch v-model="controlForm.labelEditing" inactive-text="停用" active-text="启用" @change="changeLabelEditingStatus" />
        </el-form-item>
      </el-form>
    </el-drawer>

  </div>
</template>

<script>
import "highlight.js/styles/atom-one-dark-reasonable.css";
import "bpmn-js/dist/assets/diagram-js.css";
import "bpmn-js/dist/assets/bpmn-font/css/bpmn.css";
import "bpmn-js/dist/assets/bpmn-font/css/bpmn-codes.css";
import "./package/theme/index.scss";

import translations from "./translations";
import MyProcessDesigner from "./package/designer";
import MyProcessPalette from "./package/palette";
import MyPropertiesPanel from "./package/penal";
// 自定义元素选中时的弹出菜单（修改 默认任务 为 用户任务）
import CustomContentPadProvider from "./package/designer/plugins/content-pad";
// 自定义左侧菜单（修改 默认任务 为 用户任务）
import CustomPaletteProvider from "./package/designer/plugins/palette";
import Log from "./package/Log";
// 任务resize
import resizeTask from "bpmn-js-task-resize/lib";
// bpmn theme plugin
import sketchyRendererModule from "bpmn-js-sketchy";
// 小地图
import minimapModule from "diagram-js-minimap";


// clickoutside
import clickoutside from "element-ui/lib/utils/clickoutside";
import RewriteAutoPlace from "./auto-place/rewriteAutoPlace";
import resource, {patchObj} from "@/resource";

export default {
  name: "BPMNS",
  props: {
    "pk": {type: String},
  },
  directives: {
    clickoutside: clickoutside
  },
  components:{
    MyProcessDesigner,
    MyProcessPalette,
    MyPropertiesPanel
  },
  data() {
    return {
      workflowdefine: null,
      formtemplate: null,
      onlineFileURL: null,
      xmlString: "",
      modeler: null,
      reloadIndex: 0,
      controlDrawerVisible: false,
      infoTipVisible: false,
      pageMode: false,
      translationsSelf: translations,
      controlForm: {
        processId: "",
        processName: "",
        simulation: true,
        labelEditing: false,
        labelVisible: false,
        prefix: "camunda",
        headerButtonSize: "mini",
        events: ["element.click", "element.contextmenu"],
        // additionalModel: []
        // moddleExtension: { user: UserSql },
        additionalModel: [
          CustomContentPadProvider,
          CustomPaletteProvider,
          minimapModule,
          {
            __init__: ["autoPlaceSelectionBehavior"],
            autoPlace: ["type", RewriteAutoPlace]
          }
        ]
      },
      addis: {
        CustomContentPadProvider,
        CustomPaletteProvider
      }
    };
  },
  mounted(){
    this.loadWorkflowdefine();
  },
  methods: {
    async loadWorkflowdefine(){
      this.workflowdefine = await resource.getObj('workflowdefinecontent', this.pk);
      this.formtemplate = await resource.getObj('formtemplate', this.workflowdefine.formtemplate);
      if(this.workflowdefine.bpmn_file){
        this.onlineFileURL = this.workflowdefine.bpmn_content;
      }
    },
    initModeler(modeler) {
      setTimeout(() => {
        this.modeler = modeler;
        const canvas = modeler.get("canvas");

        const rootElement = canvas.getRootElement();
        Log.prettyPrimary("Process Id:", rootElement.id);
        Log.prettyPrimary("Process Name:", rootElement.businessObject.name);
      }, 10);
    },
    reloadProcessDesigner(notDeep) {
      this.controlForm.additionalModel = [];
      for (let key in this.addis) {
        if (this.addis[key]) {
          this.controlForm.additionalModel.push(this.addis[key]);
        }
      }
      !notDeep && (this.xmlString = undefined);
      this.reloadIndex += 1;
      this.modeler = null; // 避免 panel 异常
    },
    changeLabelEditingStatus(status) {
      this.addis.labelEditing = status ? { labelEditingProvider: ["value", ""] } : false;
      this.reloadProcessDesigner();
    },
    elementClick(element) {
      console.log(element);
      this.element = element;
    },
    elementContextmenu(element) {
      console.log("elementContextmenu:", element);
    },
    async uploadBpmn({filename, file}){
      let form = new FormData();
      if(!filename){
        filename = 'workflow.bpmn'
      }
      let bb = new Blob([file], {type:'text/xml'})
      form.append('bpmn_file', bb, filename);
      form.append('pk', this.workflowdefine.pk);
      await resource.patchObj('workflowdefine', this.workflowdefine.pk, form);
      this.$message.success('保存成功！');
    }
  }
};
</script>

<style lang="scss" scoped>
.content{
  padding:0;
}
#bpmns {
  width: 100%;
  height: calc(100vh - 100px);
  box-sizing: border-box;
  display: inline-grid;
  grid-template-columns: auto max-content;
  background: #fff;
}
.demo-info-bar {
  position: fixed;
  right: 8px;
  bottom: 108px;
  z-index: 1;
}
.demo-control-bar {
  position: fixed;
  right: 8px;
  bottom: 48px;
  z-index: 1;
}
.open-model-button {
  width: 48px;
  height: 48px;
  display: flex;
  align-items: center;
  justify-content: center;
  border-radius: 4px;
  font-size: 32px;
  background: rgba(64, 158, 255, 1);
  color: #ffffff;
  cursor: pointer;
}
.zoom-in-right-enter-active,
.zoom-in-right-leave-active {
  opacity: 1;
  transform: scaleY(1) translateY(-48px);
  transition: all 300ms cubic-bezier(0.23, 1, 0.32, 1);
  transform-origin: right center;
}
.zoom-in-right-enter,
.zoom-in-right-leave-active {
  opacity: 0;
  transform: scaleX(0) translateY(-48px);
}
.info-tip {
  position: absolute;
  width: 480px;
  top: 0;
  right: 64px;
  z-index: 10;
  box-sizing: border-box;
  padding: 0 16px;
  color: #333333;
  background: #f2f6fc;
  transform: translateY(-48px);
  border: 1px solid #ebeef5;
  border-radius: 4px;
  &::before,
  &::after {
    content: "";
    width: 0;
    height: 0;
    border-width: 8px;
    border-style: solid;
    position: absolute;
    right: -15px;
    top: 50%;
  }
  &::before {
    border-color: transparent transparent transparent #f2f6fc;
    z-index: 10;
  }
  &::after {
    right: -16px;
    border-color: transparent transparent transparent #ebeef5;
    z-index: 1;
  }
}
.control-form {
  .el-radio {
    width: 100%;
    line-height: 32px;
  }
}
.element-overlays {
  box-sizing: border-box;
  padding: 8px;
  background: rgba(0, 0, 0, 0.6);
  border-radius: 4px;
  color: #fafafa;
}
</style>
