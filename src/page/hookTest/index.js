/*
 * @module: 
 * @Author: qin.yin<qin.yin@zone-cloud.com>
 * @Date: 2022-04-26 12:03:07
 * @LastEditTime: 2022-05-09 10:13:23
 * @copyright: Copyright (c) 2020,Hand
 */
import React, {useState, useCallback, memo, useRef, useEffect, useImperativeHandle, forwardRef} from 'react'

const Child = (props) => {
  console.log('我是个子组件')
  const {name, eventName} = props
  return (
    <>
      <div>我是个子组件, 父组件传过来的name值：{name}</div>
      <button onClick={eventName.bind(this, '子组件新的Name')}>改变name</button>
    </>
  )
}

const ChildMemo = memo(Child)

const Page = () => {
  const [count, setCount] = useState(0)
  const [name, setName] = useState('hello world')
  const inputEl = useRef(null)
  console.log(inputEl)
  return (
    <>
      <div>我是主页面 {count} </div>
      <button onClick={() => setCount(count + 1)}>+1</button>
      <button onClick={() => setCount(count - 1)} style={{marginLeft: '10px'}}>-1</button>
      <ChildMemo name = { name } eventName={useCallback((newName) => setName(newName),[])}/>
    </>
  )
}

function MeasureExample() {
  const [height, setHeight] = useState(0);

  const measuredRef = useCallback(node => {
    console.log('node', node)
    if (node !== null) {
      setHeight(node.getBoundingClientRect().height);
    }
  }, []);

  return (
    <>
      <h1 ref={measuredRef}>Hello, world</h1>
      <h2>The above header is {Math.round(height)}px tall</h2>
    </>
  );
}

function Counter() {
  const [count, setCount] = useState(0);

  useEffect(() => {
    const id = setInterval(() => {
      setCount(c => c + 1); // ✅ 在这不依赖于外部的 `count` 变量
    }, 1000);
    return () => clearInterval(id);
  }, []); // ✅ 我们的 effect 不使用组件作用域中的任何变量

  return <h1>{count}</h1>;
}

function FancyInput(props, ref) {
  const inputRef = useRef();
  useImperativeHandle(ref, () => ({
    focus: () => {
      inputRef.current.focus();
    }
  }));
  return <input ref={ref} />;
}
FancyInput = forwardRef(FancyInput);

// function TestUseImperativeHandleRef () {
//   const ref = useRef(null)
//   function testCurrentRef () {
//     console.log(ref)
//   }
//   return (
//     <>
//       <FancyInput ref={ref}>Click me!</FancyInput>
//       <button onClick={testCurrentRef} style={{marginLeft: '20px'}}>test</button>
//     </>
//   )
// }

function  TestPreCounter() {
  const [count, setCount] = useState(0);
  const prevCount = usePrevious(count);
  return <>
    <h1>Now: {count}, before: {prevCount}</h1>
    <button onClick={() => setCount(count + 1)}>count+1</button>
  </>
}

function usePrevious(value) {
  const ref = useRef()
  console.log('start', ref.current)
  useEffect(() => {
    console.log('content1', ref.current)
    ref.current = value
    console.log('content2', ref.current)
  })
  console.log('end', ref.current)
  return ref.current
}

export default TestPreCounter