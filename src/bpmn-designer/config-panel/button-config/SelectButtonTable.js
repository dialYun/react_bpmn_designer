import React, { useState, useEffect } from "react";
import { getButtonList } from "../../services";
import { Table } from "antd";
import { pagination } from "../../utils";

/*
 * 选择按钮列表
 */
export default function SelectButtonTable(props) {
  const [dataSource, setDataSource] = useState([]);
  const [selectedRowKeys, setSelectedRowKeys] = useState([]);
  const [total, setTotal] = useState(0);
  const { selectButton, buttonList } = props;

  useEffect(() => {
    updateDataSource({ pageSize: 10, pageNo: 0 });
  }, []);

  useEffect(() => {
    const obj = {};
    for (const item of buttonList) {
      obj[item.id] = true;
    }
    setSelectedRowKeys(Object.keys(obj));
  }, buttonList);

  // 更新列表数据源
  function updateDataSource(param) {
    getButtonList({ ...param, listenerType: 1 }).then((data) => {
      const { list, count } = data;
      setDataSource(list.map((item, index) => ({ ...item, key: item.id })));
      setTotal(count);
    });
  }

  // 监听选择行
  const onSelectChange = (selectedRowKeys) => {
    const list = [];
    for (const id of selectedRowKeys) {
      for (const item of dataSource) {
        if (item.id === id) {
          list.push(item);
          break;
        }
      }
    }
    setSelectedRowKeys(selectedRowKeys);
    selectButton(list);
  };

  const rowSelection = {
    selectedRowKeys,
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
      title: "编码",
      dataIndex: "code",
      key: "code",
      width: 100,
      sorter: true,
    },
    {
      title: "排序",
      dataIndex: "sort",
      key: "sort",
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
