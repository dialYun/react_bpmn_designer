import React, { useState, useEffect } from "react";
import { getListenerList } from "../../services";
import { Table } from "antd";
import { pagination } from "../../utils";

/*
 * 选择监听器列表
 */
export default function SelectListenerTable(props) {
  const [dataSource, setDataSource] = useState([]);
  const [total, setTotal] = useState(0);
  const { selectListener, type } = props;

  useEffect(() => {
    updateDataSource({ pageSize: 10, pageNo: 1 });
  }, []);

  // 更新列表数据源
  function updateDataSource(param) {
    getListenerList({
      ...param,
      listenerType: type === "Execution" ? 1 : 2,
    }).then((data) => {
      const { list, count } = data;
      setDataSource(list.map((item, index) => ({ ...item, key: index })));
      setTotal(count);
    });
  }

  // 监听选择行
  const onSelectChange = (selectedRowKeys) => {
    const list = [];
    for (const index of selectedRowKeys) {
      list.push(dataSource[index]);
    }
    selectListener(list);
  };

  const rowSelection = {
    onChange: onSelectChange,
  };

  // 监听表格页码或排序变化
  function handleTableChange(pagination, filters, sorter) {
    const param = {
      pageSize: pagination.pageSize,
      pageNo: pagination.current,
      orderBy:
        sorter.field && sorter.order ? sorter.field + " " + sorter.order : "",
    };
    updateDataSource(param);
  }

  const columns = [
    {
      title: "名称",
      dataIndex: "name",
      key: "name",
      width: 100,
      sorter: true,
    },
    {
      title: "监听器类型",
      dataIndex: "listenerType",
      key: "listenerType",
      width: 150,
      sorter: true,
    },
    {
      title: "事件",
      dataIndex: "event",
      key: "event",
      width: 100,
      sorter: true,
    },
    {
      title: "值类型",
      dataIndex: "valueType",
      key: "valueType",
      width: 150,
      sorter: true,
    },
    {
      title: "值",
      dataIndex: "implement",
      key: "implement",
      width: 100,
      sorter: true,
    },
  ];

  return (
    <Table
      dataSource={dataSource}
      columns={columns}
      bordered
      rowSelection={rowSelection}
      onChange={handleTableChange}
      pagination={pagination(total)}
    />
  );
}
