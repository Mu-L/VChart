import { isMobile } from 'react-device-detect';
import { default as VChart } from '../../../../src/index';
import { DataSet, DataView, csvParser } from '@visactor/vdataset';

const run = () => {
  const dataSet = new DataSet();
  dataSet.registerParser('csv', csvParser);
  const dataView = new DataView(dataSet);
  const type1 = ['A', 'B'];
  const type2 = ['A', 'B'];
  const color = {
    A: {
      A: 'A',
      B: 'B'
    },
    B: {
      A: 'C',
      B: 'D'
    }
  };

  const spec = {
    type: 'waterfall',
    data: {
      id: 'id0',
      values: [
        { x: 'Feb.4', total: true, value: 45 },
        { x: 'Feb.11', y: -5 },
        { x: 'Feb.20', y: 2 },
        { x: 'Feb.25', y: -2 },
        { x: 'Mar.4', y: 2 },
        { x: 'Mar.11', y: 2 },
        { x: 'Mar.19', y: -2 },
        { x: 'Mar.26', y: 1 },
        { x: 'Apr.1', y: 1 },
        { x: 'Apr.8', y: 1 },
        { x: 'Apr.15', y: 2 },
        { x: 'Apr.22', y: 1 },
        { x: 'Apr.29', y: -2 },
        { x: 'May.6', y: -1 },
        { x: 'total', total: true }
      ]
    },
    legends: { visible: true, orient: 'bottom' },
    xField: 'x',
    yField: 'y',
    stackLabel: {
      valueType: 'absolute',
      formatMethod: text => {
        return text + '%';
      }
    },
    seriesFieldName: {
      total: 'total',
      increase: 'increase',
      decrease: 'reduce'
    },
    total: {
      type: 'field',
      tagField: 'total',
      valueField: 'value'
    },
    axes: [
      {
        orient: 'left',
        range: { min: 30, max: 50 },
        title: { visible: true, text: 'favorability' },
        label: {
          formatMethod: v => {
            return v + '%';
          }
        }
      },
      {
        orient: 'bottom',
        label: { visible: true },
        type: 'band',
        paddingInner: 0.4,
        title: { visible: true, text: 'date' }
      }
    ],
    dataZoom: [
      {
        orient: 'bottom',
        filterMode: 'axis'
      }
    ]
  };

  const cs = new VChart(spec, {
    dataSet,
    dom: document.getElementById('chart') as HTMLElement,
    mode: isMobile ? 'mobile-browser' : 'desktop-browser'
  });
  console.time('renderTime');
  cs.renderAsync().then(() => {
    setTimeout(() => {
      // cs.updateSpec(spec2)
    }, 1000);
  });
  window['vchart'] = cs;
  console.log(cs);
};
run();
