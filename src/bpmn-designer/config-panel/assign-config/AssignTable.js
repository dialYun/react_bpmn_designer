import React from "react";
import { Table, Button } from "antd";

/*
 * 审核者列表
 */
export default function AssignTable(props) {
  const { assignList } = props;

  const columns = [
    {
      title: "用户类型",
      dataIndex: "typeName",
      key: "typeName",
      width: 130,
    },
    {
      title: "用户来自",
      dataIndex: "valueName",
      key: "valueName",
      width: 130,
    },
  ];
  return (
    <Table
      dataSource={assignList.map((item, index) => ({ ...item, key: index }))}
      columns={columns}
      pagination={false}
      bordered
    />
  );
}
