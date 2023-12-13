import { isMobile } from 'react-device-detect';
// eslint-disable-next-line no-duplicate-imports
import { default as VChart } from '../../../../src/index';

const run = () => {
  const word3d = {
    type: 'wordCloud3d',
    maskShape: `https://lf9-dp-fe-cms-tos.byteorg.com/obj/bit-cloud/log.jpeg`,
    nameField: 'challenge_name',
    valueField: 'sum_count',
    seriesField: 'challenge_name',
    data: [
      {
        name: 'data',
        values: [
          {
            challenge_name: '刘浩存',
            sum_count: 957
          },
          {
            challenge_name: '刘昊然',
            sum_count: 942
          },
          {
            challenge_name: '喜欢',
            sum_count: 842
          },
          {
            challenge_name: '真的',
            sum_count: 828
          },
          {
            challenge_name: '四海',
            sum_count: 665
          },
          {
            challenge_name: '好看',
            sum_count: 627
          },
          {
            challenge_name: '评论',
            sum_count: 574
          },
          {
            challenge_name: '好像',
            sum_count: 564
          },
          {
            challenge_name: '沈腾',
            sum_count: 554
          },
          {
            challenge_name: '不像',
            sum_count: 540
          },
          {
            challenge_name: '多少钱',
            sum_count: 513
          },
          {
            challenge_name: '韩寒',
            sum_count: 513
          },
          {
            challenge_name: '不知道',
            sum_count: 499
          },
          {
            challenge_name: '感觉',
            sum_count: 499
          },
          {
            challenge_name: '尹正',
            sum_count: 495
          },
          {
            challenge_name: '不看',
            sum_count: 487
          },
          {
            challenge_name: '奥特之父',
            sum_count: 484
          },
          {
            challenge_name: '阿姨',
            sum_count: 482
          },
          {
            challenge_name: '支持',
            sum_count: 482
          },
          {
            challenge_name: '父母',
            sum_count: 479
          },
          {
            challenge_name: '一条',
            sum_count: 462
          },
          {
            challenge_name: '女主',
            sum_count: 456
          },
          {
            challenge_name: '确实',
            sum_count: 456
          },
          {
            challenge_name: '票房',
            sum_count: 456
          },
          {
            challenge_name: '无语',
            sum_count: 443
          },
          {
            challenge_name: '干干净净',
            sum_count: 443
          },
          {
            challenge_name: '为啥',
            sum_count: 426
          },
          {
            challenge_name: '爱情',
            sum_count: 425
          },
          {
            challenge_name: '喜剧',
            sum_count: 422
          },
          {
            challenge_name: '春节',
            sum_count: 414
          },
          {
            challenge_name: '剧情',
            sum_count: 414
          },
          {
            challenge_name: '人生',
            sum_count: 409
          },
          {
            challenge_name: '风格',
            sum_count: 408
          },
          {
            challenge_name: '演员',
            sum_count: 403
          },
          {
            challenge_name: '成长',
            sum_count: 403
          },
          {
            challenge_name: '玩意',
            sum_count: 402
          },
          {
            challenge_name: '文学',
            sum_count: 397
          }
        ]
      }
    ],
    word: {
      style: {
        keepDirIn3d: false
      }
    },
    fillingWord: {
      style: {
        keepDirIn3d: false
      }
    },
    depth_3d: 1000
  };

  const pie3d = {
    type: 'pie3d',
    data: [
      {
        id: 'id0',
        values: [
          { type: 'oxygen', value: '46.60' },
          { type: 'silicon', value: '27.72' },
          { type: 'aluminum', value: '8.13' },
          { type: 'iron', value: '5' },
          { type: 'calcium', value: '3.63' },
          { type: 'sodium', value: '2.83' },
          { type: 'potassium', value: '2.59' },
          { type: 'others', value: '3.5' }
        ]
      }
    ],
    outerRadius: 0.8,
    valueField: 'value',
    categoryField: 'type',
    title: {
      visible: true,
      text: 'Surface element content statistics'
    },
    legends: {
      visible: true,
      orient: 'left'
    },
    label: {
      visible: false,
      position: 'inside',
      support3d: true,
      style: {
        stroke: '#fff',
        keepDirIn3d: false,
        fontSize: 12
      }
    },
    tooltip: {
      mark: {
        content: [
          {
            key: datum => datum['type'],
            value: datum => datum['value'] + '%'
          }
        ]
      }
    }
  };

  const cs = new VChart(word3d, {
    dom: document.getElementById('chart') as HTMLElement,
    disableDirtyBounds: true,
    options3d: {
      enable: true
    }
  });

  console.time('renderTime');
  cs.renderAsync().then(() => {
    console.timeEnd('renderTime');
  });
  window['vchart'] = cs;
  console.log(cs);
};
run();
