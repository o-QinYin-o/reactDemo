/*
 * @module: 
 * @Author: qin.yin<qin.yin@zone-cloud.com>
 * @Date: 2022-03-13 11:07:47
 * @LastEditTime: 2022-05-22 14:46:33
 * @copyright: Copyright (c) 2020,Hand
 * @LastEditors: qin.yin<qin.yin@zone-cloud.com>
 */
import React, {Component} from 'react'
import './index.less'

class ComponentOne extends Component {
  test = (num) => {
    return new Promise((resolve, reject) => {
      if (num % 2 === 0) {
        resolve('数字是偶数')
      } else {
        reject('数字是奇数')
      }
      alert('The End ~')
    })
  }
  render () {
    return (
      <div>组件1
        <button onClick={() => this.test(3)}>测试</button>
      </div>
    )
  }
}

export default ComponentOne