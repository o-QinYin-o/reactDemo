import React from 'react';
import ReactDOM from 'react-dom';
import { BrowserRouter as Router, Route, Routes, Navigate } from 'react-router-dom';
import routers from './router/router'


ReactDOM.render(
  <Router>
      <Routes>
        {
          routers.map((item, index) => {
            const C = item.element
            if (item.exact) {
              return (
                <Route exact key={index} path={item.path} element={<C/>}></Route>
              )
            } else {
              return (
                <Route key={index} path={item.path} element={<C/>}></Route>
              )
            }
          })
        }
        <Route path="*" element={<Navigate to="/" />}></Route>
      </Routes>
  </Router>,
  document.getElementById('root')
);

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
// reportWebVitals();
