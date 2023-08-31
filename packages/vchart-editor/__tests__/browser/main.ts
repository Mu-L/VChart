/**
 * !important: 本地调试应该修改 local 文件内容
 */
// import './index.local';
import { VChartEditor } from './../../src/core/vchart-editor';
const editor = new VChartEditor({
  dom: 'chart'
});
window.editor = editor;
const clipBoardData = `State,Age,Population
WY,Under 5 Years,25635
WY,5 to 13 Years,1890
WY,14 to 17 Years,9314
DC,Under 5 Years,30352
DC,5 to 13 Years,20439
DC,14 to 17 Years,10225
VT,Under 5 Years,38253
VT,5 to 13 Years,42538
VT,14 to 17 Years,15757
ND,Under 5 Years,51896
ND,5 to 13 Years,67358
ND,14 to 17 Years,18794
AK,Under 5 Years,72083
AK,5 to 13 Years,85640
AK,14 to 17 Years,22153`;
editor.addElements('chart', {
  dataSource: {
    type: 'clipBoard',
    value: clipBoardData
  },
  temp: 'bar',
  rect: {
    x: 20,
    y: 20,
    width: 300,
    height: 300
  }
});

editor.addElements('chart', {
  dataSource: {
    type: 'clipBoard',
    value: clipBoardData
  },
  temp: 'bar',
  rect: {
    x: 200,
    y: 200,
    width: 300,
    height: 300
  }
});
