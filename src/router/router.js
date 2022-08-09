/*
 * @module: 
 * @Author: qin.yin<qin.yin@zone-cloud.com>
 * @Date: 2022-03-13 11:12:03
 * @LastEditTime: 2022-07-29 11:14:51
 * @copyright: Copyright (c) 2020,Hand
 */
import ComponentOne from '../page/componentOne'
import ComponentTwo from '../page/componentTwo'
import HookTest from '../page/hookTest'
import App from '../App'
import GanttOne from '../page/gantt/demo1'
import GanttTwo from '../page/gantt/demo2'


const routers = [
  {
    path: "/",
    element: App,
    exact: true
  },
  {
    path: '/gantt-demo-one',
    element: GanttOne,
  },
  {
    path: '/gantt-demo-two',
    element: GanttTwo,
  },
  {
    path: "/compOne",
    element: ComponentOne,
  },
  {
    path: "/compTwo",
    element: ComponentTwo,
  },
  {
    path: "/hookTest",
    element: HookTest,
  }
]

export default routers