/*
 * @module: 
 * @Author: qin.yin<qin.yin@zone-cloud.com>
 * @Date: 2022-03-13 11:12:03
 * @LastEditTime: 2022-04-26 12:08:03
 * @copyright: Copyright (c) 2020,Hand
 */
import ComponentOne from '../page/componentOne'
import ComponentTwo from '../page/componentTwo'
import HookTest from '../page/hookTest'
import App from '../App'


const routers = [
  {
    path: "/",
    element: App,
    exact: true
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