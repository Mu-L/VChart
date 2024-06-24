# v1.11.5

2024-06-21


**🆕 New feature**

- **@visactor/vchart**: add option `style.align` of Tooltip, support RTL tooltip
- 

**🐛 Bug fix**

  - **@visactor/vchart**: optimize discrete legend pager color in dark theme, related [#2654](https://github.com/VisActor/VChart/issues/2654)
  - **@visactor/vchart**: fix the issue issue with stacked waterfall charts where positive and negative values were not stacked separately when there were both positive and negative values in the same stack, fix [#2212](https://github.com/VisActor/VChart/issues/2212)





[more detail about v1.11.5](https://github.com/VisActor/VChart/releases/tag/v1.11.5)

# 1.11.4

## 🐛 fix 
  - **@visactor/vchart**: fix bug of `updateSpec` when has `scales`, close #2744
  - **@visactor/vchart**: gauge chart might throw error when the value is close to its maximum, fix #2783
  - **@visactor/vchart**: fix the behavior of the gauge pointer when it exceeds the axis range, fix #2780
  - **@visactor/vchart**: normal animation not work when appear animation is disabled, fix #2807
  - **@visactor/vchart**: upgrade vrender to 0.19.10, vgrammar to 0.13.9

# 1.11.3
## 🆕 feat
@visactor/vchart: add option showBackgroundChart of DataZoom

## 🐛 fix
@visactor/vchart: bar chart should work normally when x-axis is linear, fix #2758
@visactor/vchart: fix issue of continuous legend filter in treemap
@visactor/vchart: fixed the issue that the newly added component type could not take effect when updateSpec
@visactor/vchart: fixed setSelected of sankey chart, fix #2757 , fix #2765


# 1.11.2
- 正式版发布
- @visactor/vchart: fix the bug that animationThreshold not work, close #2745
- @visactor/vchart: fix the issue of update animation in area chart is not work
- common: bar series support auto band size in common chart. fix#2704
- @visactor/vchart: corsshair should hide when pointer out view, fix #2726
- @visactor/vchart: close animation cause by datazoom/scrollbar
- @visactor/vchart: `type-step` markLine's label should consider the refX/refY/dx/dy set by user, fixed#2739
- react-vchart: fix the issue of <Axis /> that the props id not work
- @visactor/vchart: polarAxis.grid.smooth not work in theme configuratio
  🔧 chore
- @visactor/vchart: when build es5 , targets of @babel/preset-env should be defaults, fix #2702

# 1.11.0-alpha.3
- 更新README

# 1.11.0-alpha.2
- VChart组件支持InitOptions参数

# 1.11.0-alpha.1
- VChart支持HarmonyOS的StageTS架构
