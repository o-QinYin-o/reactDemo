import React, { useRef, useState, useMemo, useEffect } from "react";
import Highcharts from "highcharts/highstock";
import highchartsGantt from "highcharts/modules/gantt";
import HighchartsReact from "highcharts-react-official";
import highchartsMore from "highcharts/highcharts-more";
import highchartsDraggable from "highcharts/modules/draggable-points";
import { Modal, Form, Input, Select, InputNumber } from "antd";
import "antd/dist/antd.css";

const { Option } = Select;

if (typeof Highcharts === "object") {
  highchartsGantt(Highcharts);
  highchartsMore(Highcharts);
  highchartsDraggable(Highcharts);
}

export default function GanttDEMO() {
  const [isModalVisible, setIsModalVisible] = useState(false);
  const ganttRef = useRef();
  const [form] = Form.useForm();
  const [ganttSeries, getGanttSeries] = useState([]);
  const [subPonit, setSubPonit] = useState([]);
  const [parPonit, setParPonit] = useState([]);

  var today = new Date();
  var day = 1000 * 60 * 60 * 24;

  today.setUTCHours(0);
  today.setUTCMinutes(0);
  today.setUTCSeconds(0);
  today.setUTCMilliseconds(0);
  today = today.getTime();

  useEffect(() => {
    const _data = [
      {
        name: "Offices",
        data: [
          {
            name: "New offices",
            id: "new_offices",
            owner: 'Peter',
            completed: {
              amount: 0.2
            },
          },
          // {
          //   color: "#395627",   
          //   dragDrop: {draggableStart: false, draggableEnd: false},
          //   end: 1659258358612,
          //   endLocation: undefined,
          //   indicator: undefined,
          //   name: "Contract 1",
          //   start: 1659162058612,
          //   startLocation: undefined,
          //   trip: "Contract 1",
          //   type: "loading",
          //   vessel: "Vessel 1",
          // },
          {
            name: "Prepare office building",
            id: "prepare_building",
            parent: "new_offices",
            start: today - 2 * day,
            end: today + 6 * day,
            completed: {
              amount: 0.2,
            },
            owner: "Linda",
          },
          {
            name: "Inspect building",
            id: "inspect_building",
            dependency: "prepare_building",
            parent: "new_offices",
            start: today + 6 * day,
            end: today + 8 * day,
            owner: "Ivy",
          },
          {
            name: "Passed inspection",
            id: "passed_inspection",
            dependency: "inspect_building",
            parent: "new_offices",
            start: today + 9.5 * day,
            milestone: true,
            owner: "Peter",
          },
          {
            name: "Relocate",
            id: "relocate",
            dependency: "passed_inspection",
            parent: "new_offices",
            owner: "Josh",
          },
          {
            name: "Relocate staff",
            id: "relocate_staff",
            parent: "relocate",
            start: today + 10 * day,
            end: today + 11 * day,
            owner: "Mark",
          },
          {
            name: "Relocate test facility",
            dependency: "relocate_staff",
            parent: "relocate",
            start: today + 11 * day,
            end: today + 13 * day,
            owner: "Anne",
          },
          {
            name: "Relocate cantina",
            dependency: "relocate_staff",
            parent: "relocate",
            start: today + 11 * day,
            end: today + 14 * day,
          },
        ],
      },
      {
        name: "Product",
        data: [
          {
            name: "New product launch",
            id: "new_product",
            owner: "Peter",
          },
          {
            name: "Development",
            id: "development",
            parent: "new_product",
            start: today - day,
            end: today + 11 * day,
            completed: {
              amount: 0.6,
              fill: "#e80",
            },
            owner: "Susan",
          },
          {
            name: "Beta",
            id: "beta",
            dependency: "development",
            parent: "new_product",
            start: today + 12.5 * day,
            milestone: true,
            owner: "Peter",
          },
          {
            name: "Final development",
            id: "finalize",
            dependency: "beta",
            parent: "new_product",
            start: today + 13 * day,
            end: today + 17 * day,
          },
          {
            name: "Launch",
            dependency: "finalize",
            parent: "new_product",
            start: today + 17.5 * day,
            milestone: true,
            owner: "Peter",
          },
        ],
      },
    ];
    getGanttSeries(_data);
  }, []);

  function updateRemoveButtonStatus(params) {
    // console.log('执行了~')
    setParPonit(ganttRef.current.chart.series);
    setIsModalVisible(true);
  }

  // Create the chart
  const options = {
    title: {
      text: "Interactive Gantt Chart",
    },
    navigator: {
      enabled: true,
      series: {
        type: "gantt",
        pointPlacement: 0.5,
        pointPadding: 0.25,
      },
      yAxis: {
        min: 0,
        max: 2,
        reversed: true,
        categories: [],
      },
    },
    scrollbar: {
      enabled: true,
      barBackgroundColor: "rgba(45, 45, 45, 0.05)",
      barBorderRadius: "0.5",
    },
    // rangeSelector: {
    //   enabled: true,
    //   selected: 0,
    // },
    plotOptions: {
      gantt: {
        animation: false, // Do not animate dependency connectors
        dragDrop: {
          draggableX: true, // 横向拖拽
          draggableY: true, // 纵向拖拽
          dragMinY: 0, // 纵向拖拽下限
          dragMaxY: 2, // 纵向拖拽上限
          dragPrecisionX: day / 3, // 横向拖拽精度，单位毫秒
        },
        dataLabels: {
          enabled: true,
          format: "{point.name}",
          style: {
            cursor: "default",
            pointerEvents: "none",
          },
        },
        events: {
          click: updateRemoveButtonStatus,
        },
      },
    },
    xAxis: {
      currentDateIndicator: false,
      min: today - 3 * day,
      max: today + 18 * day,
    },
    
    tooltip: {
      xDateFormat: "%a %b %d, %H:%M",
    },
    series: ganttSeries,
    exporting: {
      sourceWidth: 1000,
    },
    // 去掉右下角版权信息
    credits: {
      enabled: false,
    },
  };

  function handleOk() {
    console.log("form", form.getFieldsValue());

    let _ganttSeries = ganttSeries;
    const _data = ganttRef.current.chart.series;
    const _formData = form.getFieldsValue();
    const _seriesData = _data.filter(
      (point) => point.name === _formData.par_name
    );
    console.log("执行~ok");
    _ganttSeries.forEach((par) => {
      if (par.name === _formData.par_name) {
        par.data.push({
          name: _formData.task_name,
          id: _formData.task_name,
          parent: "new_offices",
          start: 1658793600000,
          end: 1660176000000,
          completed: {
            amount: 0.5,
          },
          owner: "ces",
        });
      }
    });
    _seriesData[0].addPoint({
      start: 1658793600000,
      end: 1660176000000,
      name: _formData.task_name,
      dependency: _formData.par_name,
    });
    console.log(
      "🚀 ~ file: index.js ~ line 268 ~ handleOk ~ _ganttSeries",
      _ganttSeries
    );
    getGanttSeries(_ganttSeries);
    setIsModalVisible(false);
  }
  function handleCancel() {
    setIsModalVisible(false);
  }
  function changeSelect(value) {
    const _data = ganttRef.current.chart.series;
    const _subData = _data.filter((point) => point.name === value);
    console.log("form_changeSelect", form, form.getFieldValue(), value);
    setSubPonit(_subData[0].points);
  }
  return (
    <>
      Gantt demo
      <div>
        <HighchartsReact
          highcharts={Highcharts}
          options={options}
          constructorType="ganttChart"
          ref={ganttRef}
        />
      </div>
      <Modal
        title="Basic Modal"
        visible={isModalVisible}
        onOk={handleOk}
        layout={"vertical"}
        onCancel={handleCancel}
      >
        <Form form={form} layout="vertical">
          <Form.Item label="Task name" name="task_name">
            <Input placeholder="Task name" />
          </Form.Item>
          <Form.Item label="Par name" name="par_name">
            <Select onChange={changeSelect}>
              {ganttRef?.current?.chart?.series?.length
                ? ganttRef.current.chart.series.map((point) => (
                    <Option value={point.name} key={point.name}>
                      {point.name}
                    </Option>
                  ))
                : null}
            </Select>
          </Form.Item>
          <Form.Item label="Sub name" name="sub_name">
            <Select>
              {subPonit.length
                ? subPonit.map((point) => (
                    <Option value={point.id} key={point.name}>
                      {point.name}
                    </Option>
                  ))
                : null}
            </Select>
          </Form.Item>
          <Form.Item label="Split num" name="split_num">
            <InputNumber placeholder="Split num" style={{ width: "100%" }} />
          </Form.Item>
        </Form>
      </Modal>
    </>
  );
}
