import React, { useEffect, useState } from "react";
import { Table, Button, Select, Input } from "antd";
import { getConditionField } from "../../services";

const { Option } = Select;

/*
 * 表单字段列表
 */
export default function FieldTable(props) {
  const { fieldList = [], setFieldList } = props;
  const [fieldOption, setFieldOption] = useState([]);

  // 获取字段选项
  useEffect(() => {
    getConditionField().then((data) => setFieldOption(data));
  }, []);

  // 字段改变
  function onChange(value, index, key) {
    fieldList[index][key] = value;
    setFieldList(JSON.parse(JSON.stringify(fieldList)));
  }

  // 删除
  function deleteField(index) {
    fieldList.splice(index, 1);
    setFieldList(JSON.parse(JSON.stringify(fieldList)));
  }

  const columns = [
    {
      title: "字段",
      dataIndex: "field",
      key: "field",
      width: 100,
      render: (rowValue, record, index) => (
        <Select
          style={{ width: 90 }}
          value={rowValue}
          onChange={(value) => onChange(value, index, "field")}
        >
          {fieldOption.map((item) => (
            <Option value={item.id} key={item.id}>
              {item.name}
            </Option>
          ))}
        </Select>
      ),
    },
    {
      title: "条件",
      dataIndex: "compare",
      key: "compare",
      width: 100,
      render: (rowValue, record, index) => (
        <Select
          style={{ width: 90 }}
          value={rowValue}
          onChange={(value) => onChange(value, index, "compare")}
        >
          <Option value="<">小于</Option>
          <Option value=">">大于</Option>
          <Option value="<;=">小于等于</Option>
          <Option value="=">等于</Option>
          <Option value=">=">大于等于</Option>
        </Select>
      ),
    },
    {
      title: "值",
      dataIndex: "value",
      key: "value",
      width: 100,
      render: (rowValue, record, index) => (
        <Input
          value={rowValue}
          style={{ width: 90 }}
          onChange={(e) => onChange(e.target.value, index, "value")}
        />
      ),
    },
    {
      title: "逻辑",
      dataIndex: "logic",
      key: "logic",
      width: 80,
      render: (rowValue, record, index) => (
        <Select
          style={{ width: 70 }}
          value={rowValue}
          onChange={(value) => onChange(value, index, "logic")}
        >
          <Option value="and">且</Option>
          <Option value="or">或</Option>
        </Select>
      ),
    },
    {
      title: "操作",
      key: "action",
      width: 60,
      render: (value, record, index) => (
        <div className="table-btn" style={{ width: 50 }}>
          <Button type="link" onClick={() => deleteField(index)}>
            删除
          </Button>
        </div>
      ),
    },
  ];

  return (
    <Table
      dataSource={fieldList.map((item, index) => ({ ...item, key: index }))}
      columns={columns}
      pagination={false}
      bordered
    />
  );
}
