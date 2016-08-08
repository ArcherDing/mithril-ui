import {button} from "./../../src/components/button.js";
import m from "mithril";
import chai from "chai";
import classnames from "classnames";

let expect = chai.expect;


describe("button", () => {
	it("complains if label is not passed", () => {
		let aButton = m(button);
		expect(aButton.view.bind(aButton)).to.throw(Error);
	});

	it("wont complain if label is present", () => {
		let aButton = m(button, {label: "aLabel"});
		expect(aButton.view.bind(aButton)).not.to.throw(Error);
	});

	describe("getDefaultAttrs", () => {
		it("returns dom with tag name button.", () => {
			let got = button.getDefaultAttrs({});
			expect(got.dom.tagName).to.equal("button");
		});
	});

	describe("getClassList", () => {
		it("returns list with 'ii' and 'button'.", () => {
			let got = button.getClassList({});
			expect(got.indexOf('ui')).not.to.equal(-1);
			expect(got.indexOf('button')).not.to.equal(-1);
		});

		it("adds 'icon'.", () => {
			let got = classnames(button.getClassList({icon: m("i")}));
			expect(got).to.have.string("icon");
		});

		it("adds labeled.", () => {
			let got = classnames(button.getClassList({icon: m("i"), label: "A label"}));
			expect(got).to.have.string("labeled icon");
		});

		it("adds basic.", () => {
			let got = classnames(button.getClassList({basic: true}));
			expect(got).to.have.string("basic");
		});

		it("adds inverted.", () => {
			let got = classnames(button.getClassList({inverted: true}));
			expect(got).to.have.string("inverted");
		});

		it("adds active.", () => {
			let got = classnames(button.getClassList({active: true}));
			expect(got).to.have.string("active");
		});

		it("adds disabled.", () => {
			let got = classnames(button.getClassList({disabled: true}));
			expect(got).to.have.string("disabled");
		});

		it("adds loading.", () => {
			let got = classnames(button.getClassList({loading: true}));
			expect(got).to.have.string("loading");
		});

		it("adds size", () => {
			let got = classnames(button.getClassList({size: "mini"}));
			expect(got).to.have.string("mini");
		});

		it("adds floats", () => {
			var got = classnames(button.getClassList({float: "right"}));
			expect(got).to.have.string("right floated");

			got = classnames(button.getClassList({float: "left"}));
			expect(got).to.have.string("left floated");
		});

		it("adds color.", () => {
			let got = classnames(button.getClassList({color: "red"}));
			expect(got).to.have.string("red");
		});

		it("adds compact.", () => {
			let got = classnames(button.getClassList({compact: true}));
			expect(got).to.have.string("compact");
		});

		it("adds fluid.", () => {
			let got = classnames(button.getClassList({fluid: true}));
			expect(got).to.have.string("fluid");
		});

		it("adds circular.", () => {
			let got = classnames(button.getClassList({circular: true}));
			expect(got).to.have.string("circular");
		});
	});
});