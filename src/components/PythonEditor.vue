<template>
  <div class="cm-s-material-darker" style="min-width: 300px;min-height: 200px;">
    <codemirror class="codeinline" :value="value" @input="change" :options="cmOption" style="width: 100%; word-wrap: break-word; overflow: hidden" />
  </div>
</template>

<script>
import {codemirror} from "vue-codemirror";
import "codemirror/mode/python/python.js";
import "codemirror/lib/codemirror.css";
import "codemirror/theme/xq-light.css";

export default {
  name: "PythonEditor",
  components: {
    codemirror
  },
  props: {
    value: {
      type: String,
      default: ""
    }
  },
  model: {
    prop: "value",
    event: "change"
  },
  data() {
    return {
      cmOption: {
        tabSize: 4,
        indentUnit: 4,
        indentWithTabs: false,
        styleActiveLine: true,
        lineNumbers: true,
        line: true,
        mode: "text/x-python",
        theme: "xq-light",
        specialChars: /[\u0000-\u001f\u007f-\u009f\u00ad\u061c\u200b-\u200f\u2028\u2029\ufeff\ufff9-\ufffc\s]/g,
        specialCharPlaceholder: function (ch) {
          let token = document.createElement("span");
          let content = "\u2022"; // 小红点字符
          token.className = "cm-bracket";
          token.appendChild(document.createTextNode(content));
          token.title = "\\u" + ch.charCodeAt(0).toString(16);
          token.setAttribute("aria-label", token.title);
          return token;
        },
      },
    };
  },
  methods: {
    change(value) {
      this.$emit("change", value);
    }
  }
}

</script>
