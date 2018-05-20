/**
 * @description - webpack-plugin-network-hints fixture
 * @author - huang.jian <hjj491229492@hotmail.com>
 */

/* eslint-disable */
import _ from 'lodash';
import $ from 'jquery';

$('document').ready(() => {
  const text = document.querySelector('.text');

  _.range(1, 9).forEach((value) => {
    text.textContent = `Current Counter: ${value}`;
  });
});
