import input from './input';
import select from './select';
import multipleSelect from './multiple_select';
import radio from './radio';
import date from './date';
import checkbox from './checkbox';
import upload from './upload';
import number from './number';
import cascader from './cascader';
import richtext from './richtext';
import colorPicker from "./color_picker";

const widgets = [].concat(input, select, multipleSelect, radio, date, checkbox, upload, number,cascader, richtext, colorPicker);

const names = (list) => list.map(item => item.name);

export const in_input = (name) => names(input).includes(name);

export default widgets;

export const widgetsMap = widgets.reduce((map, widget) => {
  map[widget.name] = widget;
  return map;
}, {});
