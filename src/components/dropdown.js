import {UI} from "./base.js";
import o from "mithril";
import {required, isArray} from "validatex";
import {icon} from "./icon";
import {firstMatch} from "./../helpers/misc.js";
import {range} from "lodash";


const SPACE = 32;
const ENTER = 13;
const ESC = 27;
const SELECTOR_RESET_INTERVAL = 500;
const UP_KEY = 38;
const DOWN_KEY = 40;


export class Dropdown extends UI {
	attrSchema = {
		text: required(false),
		options: [required(false), isArray()],
		placeholder: required(false),
		model: required(false),
		name: required(false),
		search: required(false),
	};

	oninit (vnode) {
		super.oninit(vnode);
		this.active = false;
		this.selector = "";

		let index;

		this.selectedIndex = -1;
	}

	toggleActive () {
		this.active = !this.active;
	}

	deactive () {
		this.active = false;
	}

	getDefaultAttrs (vnode) {
		let attrs = {
			rootAttrs: {
				tabindex: 0,
				onclick: this.toggleActive.bind(this),
				onblur: this.deactive.bind(this),
			}
		};

		if (vnode.attrs.model && !vnode.attrs.search) {
			attrs.onkeydown = this.captureKeyPress.bind(this, vnode.attrs);
		}

		return attrs;
	}

	getClassList ({attrs}) {
		return [
			"ui",
			this.active && "active visible",
			attrs.options && "selection",
			attrs.search && "search",
			"dropdown"
		];
	}

	isSelection(attrs) {
		return attrs.model? true: false;
	}

	isDefaultText (attrs, text) {
		return attrs.model && attrs.placeholder === text;
	}

	getText (attrs) {
		if (!attrs.model) return attrs.text;
		if (attrs.model && !attrs.model() && attrs.placeholder) return attrs.placeholder;

		let match = firstMatch((attrs.options), (option) => {
			return option.value === attrs.model();
		});

		if (match) return match.label;

		if (attrs.options.length > 0) return attrs.options[0].label;
	}

	clearSelector () {
		this.selector = "";
	}

	matchOptionLabel(label, selector) {
		return selector? label.toLowerCase().match("^" + selector): false;
	}

	setSelector (attrs, character) {
		let {options, search} = attrs;

		if (!this.active) return;

		this.clearSelectorTimmer && clearTimeout(this.clearSelectorTimmer);

		this.selector = attrs.search ? character: this.selector + character;

		for (let i = 0; i < options.length; i ++) {
			if (this.matchOptionLabel(options[i].label, this.selector)) {
				this.selectedIndex = i;
				break;
			}
		}

		this.clearSelectorTimmer =
			!attrs.search && setTimeout( this.clearSelector.bind(this), SELECTOR_RESET_INTERVAL);
	}

	incSelectedIndex (options) {
		this.selectedIndex ++;

		if (this.selectedIndex === options.length) {
			this.selectedIndex = 0;
		}
	}

	decSelectedIndex (options) {
		this.selectedIndex --;

		if (this.selectedIndex === -1) {
			this.selectedIndex = options.length - 1;
		}
	}

	captureKeyPress (attrs, e) {
		if ([SPACE, ENTER, ESC, UP_KEY, DOWN_KEY].indexOf(e.keyCode) !== -1 ||
				e.keyCode >= 65 && e.keyCode <= 90 ||
				e.keyCode >= 48 && e.keyCode <= 57) {

			if (!this.active && [ENTER, ESC, SPACE].indexOf(e.keyCode) === -1) {
				this.active = true;
				e.preventDefault();
				return;
			}

			if (e.keyCode === ESC) {
				this.deactive();
			}
			else if (e.keyCode == UP_KEY) {
				this.decSelectedIndex(attrs.options);
			}
			else if (e.keyCode == DOWN_KEY) {
				this.incSelectedIndex(attrs.options);
			}
			else if (e.keyCode === SPACE) {
				this.toggleActive();
			}
			else if (e.keyCode === ENTER) {
				let {options, model} = attrs;
				this.selectOption(this.selectedIndex, options[this.selectedIndex].value, model, e);
				this.deactive();
			}
			else {
				this.setSelector(attrs, e.key);
			}

			e.preventDefault();
			return;
		}
		e.redraw = false;
	}

	selectOption (index, value, model, e) {
		model.setAndValidate(value);
		this.selectedIndex = index;
		this.selector = "";
		e.preventDefault();
	}

	getFilteredOptions (attrs) {
		if (attrs.search && this.selector) {
			return attrs.options.filter((option) => {
				return this.matchOptionLabel(option.label, this.selector);
			});
		}

		return attrs.options;
	}

	getProcessedOptions (attrs) {
		let index = 0;

		// let filteredOptions = this.getFilteredOptions(attrs);

		return attrs.options.map((option) => {
			let itemAttrs =
				{ "data-value": option.value
				, onclick: this.selectOption.bind(this, index, option.value, attrs.model) };

			if (this.selectedIndex === index) {
				itemAttrs.selected = true;
			}

			if (attrs.model() === option.value) {
				itemAttrs.active = true;
			}

			if (attrs.search &&
					this.selector && 
					!this.matchOptionLabel(option.label, this.selector)) {
				itemAttrs.filtered = true;
			}

			index ++;
			return o(dropdownItem, itemAttrs, option.label);
		});
	}

	view ({attrs, children, state}) {
		const isSelection = this.isSelection(attrs);
		const text = this.getText(attrs);

		return o("div", attrs.rootAttrs,
				isSelection?
					o("input", {type: "hidden", name: attrs.name || "", value: attrs.model()})
					: null,

				o(dropdownText,
					{ default: this.isDefaultText(attrs, text)
					, filtered: attrs.search && this.selector? true: false },
					text),
				o(icon, {name: "dropdown"}),

				attrs.search
					? o("input.search[tabindex=0][autocomplete=off]",
							{ value: this.selector
							, oninput: o.withAttr("value", this.setSelector.bind(this, attrs)) })
					: null,

				o(dropdownMenu, {visible: this.active},
					isSelection
						? this.getProcessedOptions(attrs)
						: children));
	}
}


export const dropdown = new Dropdown();


export class DropdownText extends UI {
	getClassList ({attrs}) {
		return [
				attrs.default && "default",
				attrs.filtered && "filtered",
				"text"
			];
	}
}

export const dropdownText = new DropdownText();

export class DropdownMenu extends UI {
	attrSchema = {
		visible: required(true)
	};

	getDefaultAttrs (vnode) {
		let attrs = super.getDefaultAttrs(vnode);

		if (vnode.attrs.visible) {
			attrs.rootAttrs = {style: {display: "block"}};
		}

		return attrs;
	}

	getClassList ({attrs}) {
		return [
			attrs.visible? "visible": "hidden",
			"menu"
		];
	}
}

export const dropdownMenu = new DropdownMenu();


export class DropdownItem extends UI {
	getClassList ({attrs}) {
		return [
			attrs.active && "active",
			attrs.selected && "selected",
			attrs.filtered && "filtered",
			"item"
		];
	}
}

export const dropdownItem = new DropdownItem();
