import XLSX from "xlsx";
import FS from "file-saver";
import {BACKEND_URL} from "@/constvars";

export default class ExportExcel {
  constructor(project_name) {
    this.project_name = project_name;
    this.plans = [];
    this.loading = false;
    this.finished = false;
  }

  async asyncExportExcel() {
    await this.loadData();
    this.exportExcel();
  }

  async loadData() {
    this.loading = true;
    let project_name = this.project_name || this.$route.params.name;
    try {
      let backend_url = localStorage.getItem("backend_url");
      let resp = await fetch(
        `${backend_url}/permissionstree/?pm_name=${project_name}&level=0`
      );
      let data = await resp.json();
      this.plans = data;
      this.finished = true;
    } catch (e) {
      console.log(e);
    } finally {
      this.loading = false;
    }
  }

  flatData(datas, level = 0) {
    let data = [];
    let prepending = "　".repeat(level);
    for (let i = 0; i < datas.length; i++) {
      let item = datas[i];
      if (item.items) {
        data.push({ "名称": prepending + item.name, "说明": item.codename });
        data = data.concat(this.flatData(item.items, level + 1));
      } else {
        data.push({ "名称": prepending + item.name, "说明": item.codename });
      }
    }
    return data;
  }

  exportExcel() {
    let project_name = this.project_name || this.$route.params.name;
    let sheet_name = `${project_name}功能列表`;
    let data = this.flatData(this.plans);
    if (!data || data.length === 0) return;
    let wb = XLSX.utils.book_new();
    let ws = XLSX.utils.json_to_sheet(data);
    // 美化表格：设置列宽和行高，第二列文字较长需要自动换行并自动调整行高
    ws["!cols"] = [{ wch: 20 }, { wch: 100 }];
    ws["!rows"] = [{ hpx: 20 }];
    // 设置表头样式
    let header_style = {
      font: { bold: true },
      fill: { fgColor: { rgb: "FFC000" } },
      alignment: { horizontal: "center", vertical: "center" },
    };
    ws["A1"] = { v: "名称", s: header_style };
    ws["B1"] = { v: "说明", s: header_style };
    // 添加到工作簿
    wb.SheetNames.push(sheet_name);
    wb.Sheets[sheet_name] = ws;
    let wbout = XLSX.write(wb, {
      bookType: "xlsx",
      bookSST: false,
      type: "array",
    });
    try {
      FS.saveAs(
        new Blob([wbout], { type: "application/octet-stream;charset=utf-8" }),
        `${sheet_name}.xlsx`
      );
    } catch (e) {
      if (typeof console !== "undefined") console.log(e, wbout);
    }
  }
}
