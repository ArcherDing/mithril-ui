'use strict';

require('semantic-ui-css/semantic.css!');
require('animate.css');
require('test/style.css!');

const sm = require('../index.js');
const m = require('mithril');
const _ = require('lodash');
const $ = require('jquery');

const map = function (collection, callback) {
  let output = [];
  _.forEach(collection, (item, index) => {
    output.push(callback(item, index));
  });
  return output;
};

const armc = function (data, index) {
  return function (el, initialized, ctx) {
    let dom = $(el);
    let addClass = 'animation add';
    let changeClass = 'animation change';
    // for addition of element
    if(!initialized) {
      dom.addClass(addClass)
        .one('animationend', () => dom.removeClass(addClass));
    }
    // for element move
    if (!ctx.index) ctx.index = index;
    if (ctx.index) {
      if (ctx.index < index) {
        dom.addClass('animation move low')
          .one('animationend', () => dom.removeClass('animation move low'));
      }
      else if (ctx.index > index) {
        dom.addClass('animation move high')
          .one('animationend', () => dom.removeClass('animation move high'));
      }
    }
    // // if change in data
    // if (!ctx.data) ctx.data = data;
    // if (ctx.data) {
    //   dom.addClass(changeClass)
    //     .one('animationend', () => dom.removeClass(moveClass));
    // }
  };
};

let ARMC = {
  controller: function (pl) {
    const self = this;
    self.model = m.prop('');
    self.data = [
      {id: 1, text: '1. This is awesome'},
      {id: 2, text: '2. This is double awesome'},
      {id: 3, text: '3. This is triple awesome'}];

    self.addData = (data) => {
      self.model(data);
      self.data.unshift({id:4, text: data});
    };
  },
  view: function (c, pl) {
    return m('.ui.segment',
        m('.ui.segment',
          m('.ui.input.fluid',
            m('input[type=text]', {
              placeholder: 'Add Card',
              onchange: m.withAttr('value', c.addData),
              value: c.model()
            }))
          ),
        map(c.data, (adata, index) => m('.ui.segment', {config: armc(adata, index), key: adata.id}, adata.text)));
  }
};

m.mount(document.getElementById('app'), {
  view: function () {
    var model = {model: {sex: ''}};
    return m('.ui.container',
      m('h1', 'Selection'),
      m('hr'),

      // Selection
      m.component(sm.Selection,
        {
          model: model,
          field: 'sex',
          label: 'Sex',
          options: [
            {value: '', alias: '-- Sex --'},
            {value: 'male', alias: 'Male', html: m('i.comment.icon')},
            {value: 'female', alias: 'Female', html: m('i.conversation.icon')}
          ]
        }),

      // add, remove, move, change test
      m('h1', 'Add, Remove, Move, Change'),
      m('hr'),
      m.component(ARMC));
  }
});
