import React from "react";
import { Table, Button } from "antd";

/*
 * 按钮列表
 */
export default function ButtonTable(props) {
  const { editButton, deleteButton, buttonList } = props;

  const columns = [
    {
      title: "名称",
      dataIndex: "name",
      key: "name",
      width: 80,
    },
    {
      title: "编码",
      dataIndex: "code",
      key: "code",
      width: 80,
    },
    {
      title: "排序",
      dataIndex: "sort",
      key: "sort",
      width: 80,
    },
    {
      title: "是否隐藏",
      dataIndex: "isHide",
      key: "isHide",
      width: 80,
      render: (value) => <span>{value === "0" ? "否" : "是"}</span>,
    },
    {
      title: "操作",
      key: "action",
      width: 80,
      render: (value, record, index) => (
        <div className="table-btn">
          <Button type="link" onClick={() => editButton(record, index)}>
            修改
          </Button>
          <Button
            type="link"
            style={{ marginLeft: 10 }}
            onClick={() => deleteButton(index)}
          >
            删除
          </Button>
        </div>
      ),
    },
  ];
  return (
    <Table
      dataSource={buttonList.map((item, index) => ({ ...item, key: index }))}
      columns={columns}
      pagination={false}
      bordered
    />
  );
}
