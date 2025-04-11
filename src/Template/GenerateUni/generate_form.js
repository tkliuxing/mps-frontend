import ejs from "ejs";
import Form from "./components/Form.tpl.ejs";
export default function (template){
  return ejs.render(Form, template);
}
