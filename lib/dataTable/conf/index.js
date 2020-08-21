"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;
var GlobalConfig = {
  pagerConfig: {
    pageSize: 20,
    layouts: ['PrevJump', 'PrevPage', 'Number', 'NextPage', 'NextJump', 'Sizes', 'FullJump', 'Total'],
    perfect: true,
    props: {
      pageSize: 'pageSize',
      currentPage: 'pageIndex'
    }
  }
};
var _default = GlobalConfig;
exports.default = _default;