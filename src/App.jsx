/*
 * @module: 
 * @Author: qin.yin<qin.yin@zone-cloud.com>
 * @Date: 2022-03-13 10:03:07
 * @LastEditTime: 2022-04-26 12:05:11
 * @copyright: Copyright (c) 2020,Hand
 */

import React, {Component} from 'react'
import { Link } from 'react-router-dom';


class App extends Component {
  render() {
    return (
      <div>项目-App

        <Link to="/hookTest">HookTest</Link>
      </div>
    );
  }
}

export default App;
