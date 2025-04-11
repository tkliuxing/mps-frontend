import ejs from "ejs";
import Form from "./components/Form.tpl.ejs";
import Container from "./components/Container.tpl.ejs";
import Detail from "./components/Detail.tpl.ejs";
import Table from "./components/Table.tpl.ejs";
import ImportData from "./components/ImportData.tpl.ejs";
import Mixin from "./components/Mixin.tpl.ejs";
import Model from "./components/Model.tpl.ejs";

export function generate_form(template){
  return ejs.render(Form, template);
}

export function generate_index(template){
  return ejs.render(Container, template);
}

export function generate_detail(template){
  return ejs.render(Detail, template);
}

export function generate_table(template){
  return ejs.render(Table, template);
}

export function generate_import(template){
  return ejs.render(ImportData, template);
}

export function generate_mixin(template){
  return ejs.render(Mixin, template);
}

export function generate_model(template){
  return ejs.render(Model, template);
}

