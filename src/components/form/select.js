import m from "mithril";
import map from "lodash/map";
import {field} from "./field.js";
import component from "mithril-componentx";
import {required} from "validatex";


export const select = component({
	name: "select",
	base: field,
	attrSchema: {
		model: required(true),
		options: required(true),
		multiple: required(false)
	},
	menuVisible: false,
	toggleMenu () {
		this.menuVisible = !this.menuVisible;
	},
	hideMenu () {
		this.menuVisible = false;
	},
  view (vdom)  {
		let attrs = vdom.attrs;
    return m("div", attrs.rootAttrs,
             this.getLabelPrepend(attrs),
             m("select", {value: attrs.model(),
													onchange: m.withAttr("value", attrs.model.setAndValidate)},
               map(attrs.options, (option) => {
                 return m("option",
                          {value: option.value},
                          option.label);
               })),
             this.getLabelAppend(attrs));
  }
});