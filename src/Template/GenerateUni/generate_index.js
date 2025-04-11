import ejs from "ejs";
import Container from "./components/Container.tpl.ejs";
export default function (template){
  return ejs.render(Container, template);
}
