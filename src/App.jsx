/*
 * @module: 
 * @Author: qin.yin<qin.yin@zone-cloud.com>
 * @Date: 2022-03-13 10:03:07
 * @LastEditTime: 2022-07-29 11:15:02
 * @copyright: Copyright (c) 2020,Hand
 */

import React, {Component} from 'react'
import { Link } from 'react-router-dom';


class App extends Component {
  render() {
    return (
      <>
        <div style={{padding: '20px'}}>
          <h2>List</h2>
          <ul>
            <li><Link to="/hookTest">HookTest</Link></li>
            <li><Link to="/gantt-demo-one">gantt-demo-one</Link></li>
            <li><Link to="/gantt-demo-two">gantt-demo-two</Link></li>
          </ul>
        </div>
      </>
    );
  }
}

export default App;
