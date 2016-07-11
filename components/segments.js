var base = require("./base.js");
var component = require("./../helpers/component.js");

var struct = {
  extend: base,
  controller: function (attrs) {
    return {
      getClassList: function (attrs) {
        return ["ui",
                "segments"];
      }
    };
  }
};

module.exports = component(struct);
