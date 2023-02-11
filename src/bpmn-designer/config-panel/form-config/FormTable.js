import React from "react";
import { Table, Checkbox } from "antd";

/*
 * 表单列表
 */
export default function FormTable(props) {
  const { data = [], onChangeProperty } = props;

  const columns = [
    {
      title: "表单名称",
      dataIndex: "name",
      key: "name",
      width: 100,
    },
    {
      title: "版本",
      dataIndex: "version",
      key: "version",
      width: 100,
    },
    {
      title: "表单key",
      dataIndex: "id",
      key: "id",
      width: 100,
    },
  ];

  const expandedRowRender = (record) => {
    const columns = [
      {
        title: "字段名称",
        dataIndex: "name",
        key: "name",
        width: 137,
      },
      {
        title: "字段ID",
        dataIndex: "id",
        key: "id",
        width: 138,
      },
      {
        title: "可读",
        dataIndex: "readable",
        key: "readable",
        render: (value, record, index) => (
          <Checkbox
            onChange={(e) =>
              onChangeProperty(e.target.checked, "readable", record, index)
            }
            checked={value}
          />
        ),
      },
      {
        title: "可写",
        dataIndex: "writable",
        key: "writable",
        render: (value, record, index) => (
          <Checkbox
            onChange={(e) =>
              onChangeProperty(e.target.checked, "writable", record, index)
            }
            checked={value}
          />
        ),
      },
    ];
    const data = record.fields.map((item) => ({ ...item, key: item.id }));
    return <Table columns={columns} dataSource={data} pagination={false} />;
  };
  return (
    <div className="form-table">
      <Table
        dataSource={data.map((item) => ({ ...item, key: item.id }))}
        columns={columns}
        pagination={false}
        expandedRowRender={expandedRowRender}
        bordered
      />
    </div>
  );
}
