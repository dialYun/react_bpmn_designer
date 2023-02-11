import React, { useEffect, useState } from "react";
import { Table, Button, Input } from "antd";
import { getPostList } from "../../../services";
import { pagination } from "../../../utils";

/*
 * 岗位列表
 */
export default function PostTable(props) {
  const [dataSource, setDataSource] = useState([]);
  const [name, setName] = useState("");
  const [code, setCode] = useState("");
  const [pageSize, setPageSize] = useState(10);
  const [pageNo, setPageNo] = useState(1);
  const [orderBy, setOrderBy] = useState("");
  const [total, setTotal] = useState(0);
  const { setSelectPost, selectPost = [] } = props;

  // 监听查询条件变化查询数据
  useEffect(() => {
    updateDataSource();
  }, [pageNo, pageSize, orderBy]);

  // 更新列表数据源
  function updateDataSource() {
    const param = {
      name,
      code,
      pageNo,
      pageSize,
      orderBy,
    };
    getPostList(param).then((data) => {
      const { list, count } = data;
      setDataSource(list.map((item) => ({ ...item, key: item.id })));
      setTotal(count);
    });
  }

  // 监听选择行
  const onSelectChange = (selectedRowKeys) => {
    const list = [];
    for (const id of selectedRowKeys) {
      const arr = dataSource.filter((item) => item.id === id);
      if (arr.length) {
        list.push(arr[0]);
      }
    }

    //不在dataSource,但是在上次的选中行(selectUser)里的加到list里
    for (const user of selectPost) {
      if (!dataSource.filter((item) => item.id === user.id).length) {
        list.push(user);
      }
    }
    setSelectPost(list);
  };

  const rowSelection = {
    selectedRowKeys: selectPost.map((item) => item.id),
    onChange: onSelectChange,
  };

  // 监听表格页码或排序变化
  function handleTableChange(pagination, filters, sorter) {
    setPageSize(pagination.pageSize);
    setPageNo(pagination.current);
    setOrderBy(
      sorter.field && sorter.order ? sorter.field + " " + sorter.order : ""
    );
  }

  // 重置名称， 英文名查询条件
  function onReset() {
    setName("");
    setCode("");
  }

  const columns = [
    {
      title: "岗位名称",
      dataIndex: "name",
      key: "name",
      width: 258,
      sorter: true,
    },
    {
      title: "岗位编码",
      dataIndex: "code",
      key: "code",
      width: 258,
      sorter: true,
    },
  ];
  return (
    <div className="user-table">
      <div>
        <Input
          placeholder="岗位名称"
          value={name}
          onChange={(e) => setName(e.target.value)}
        />
        <Input
          placeholder="岗位编码"
          value={code}
          onChange={(e) => setCode(e.target.value)}
        />
        <Button type="primary" onClick={updateDataSource}>
          查询
        </Button>
        <Button onClick={onReset}>重置</Button>
      </div>
      <Table
        dataSource={dataSource}
        columns={columns}
        rowSelection={rowSelection}
        onChange={handleTableChange}
        pagination={pagination(total)}
      />
    </div>
  );
}
