import React, { useEffect, useState } from "react";
import { Table, Button, Input } from "antd";
import { getConditionExpress } from "../../services";
import { pagination } from "../../utils";

/*
 * 表达式列表
 */
export default function ExpressTable(props) {
  const [dataSource, setDataSource] = useState([]);
  const [name, setName] = useState("");
  const [pageSize, setPageSize] = useState(10);
  const [pageNo, setPageNo] = useState(1);
  const [orderBy, setOrderBy] = useState("");
  const [total, setTotal] = useState(0);
  const { setExpress } = props;

  // 监听查询条件变化查询数据
  useEffect(() => {
    updateDataSource();
  }, [pageNo, pageSize, orderBy]);

  // 更新列表数据源
  function updateDataSource() {
    const param = {
      name,
      pageNo,
      pageSize,
      orderBy,
    };
    getConditionExpress(param).then((data) => {
      const { list, count } = data;
      setDataSource(list.map((item) => ({ ...item, key: item.id })));
      setTotal(count);
    });
  }

  // 监听表格页码或排序变化
  function handleTableChange(pagination, filters, sorter) {
    setPageSize(pagination.pageSize);
    setPageNo(pagination.current);
    setOrderBy(
      sorter.field && sorter.order ? sorter.field + " " + sorter.order : ""
    );
  }

  // 监听选择行
  const onSelectChange = (selectedRowKeys, row) => {
    setExpress(row[0].express);
  };

  const rowSelection = {
    type: "radio",
    onChange: onSelectChange,
  };

  const columns = [
    {
      title: "名称",
      dataIndex: "name",
      key: "name",
      width: 200,
      sorter: true,
    },
    {
      title: "表达式",
      dataIndex: "express",
      key: "express",
      width: 200,
      sorter: true,
    },
    {
      title: "备注",
      dataIndex: "note",
      key: "note",
      width: 200,
      sorter: true,
    },
  ];
  return (
    <div className="express-table">
      <div>
        <Input
          placeholder="名称"
          value={name}
          onChange={(e) => setName(e.target.value)}
        />
        <Button type="primary" onClick={updateDataSource}>
          查询
        </Button>
        <Button onClick={() => setName("")}>重置</Button>
      </div>
      <Table
        dataSource={dataSource}
        columns={columns}
        onChange={handleTableChange}
        rowSelection={rowSelection}
        borderd
        style={{ height: "100%" }}
        pagination={pagination(total)}
      />
    </div>
  );
}
