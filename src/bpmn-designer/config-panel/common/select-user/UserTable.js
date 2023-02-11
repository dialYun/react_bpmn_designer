import React, { useEffect, useState } from "react";
import { Table, Button, Icon, Input } from "antd";
import { getUserList } from "../../../services";
import { pagination } from "../../../utils";

/*
 * 用户列表
 */
export default function UserTable(props) {
  const [dataSource, setDataSource] = useState([]);
  const [loginName, setLoginName] = useState("");
  const [pageSize, setPageSize] = useState(10);
  const [pageNo, setPageNo] = useState(1);
  const [orderBy, setOrderBy] = useState("");
  const [total, setTotal] = useState(0);
  const {
    setSelectUser,
    companyId,
    officeId,
    setCompanyId,
    setOfficeId,
    selectUser,
  } = props;

  // 监听查询条件变化查询数据
  useEffect(() => {
    updateDataSource();
  }, [pageNo, pageSize, orderBy, companyId, officeId]);

  // 更新列表数据源
  function updateDataSource() {
    const param = {
      loginName,
      pageNo,
      pageSize,
      orderBy,
      "company.id": companyId,
      "office.id": officeId,
    };
    getUserList(param).then((data) => {
      const { list, count } = data;
      setTotal(count);
      setDataSource(
        list.map((item) => {
          const obj = { ...item, key: item.id };
          if (item.company && item.company.name)
            obj.companyName = item.company.name;
          if (item.office && item.office.name)
            obj.officeName = item.office.name;
          return obj;
        })
      );
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
    for (const user of selectUser) {
      if (!dataSource.filter((item) => item.id === user.id).length) {
        list.push(user);
      }
    }

    setSelectUser(list);
  };

  const rowSelection = {
    selectedRowKeys: selectUser.map((item) => item.id),
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

  // 重置公司，部门，登录名查询条件
  function onReset() {
    setLoginName("");
    setCompanyId("");
    setOfficeId("");
  }

  const columns = [
    {
      title: "头像",
      dataIndex: "image",
      key: "image",
      width: 100,
      render: () => <Icon type="user" />,
    },
    {
      title: "登录名",
      dataIndex: "loginName",
      key: "loginName",
      width: 100,
      sorter: true,
    },
    {
      title: "用户名",
      dataIndex: "name",
      key: "name",
      width: 100,
      sorter: true,
    },
    {
      title: "所属机构",
      dataIndex: "companyName",
      key: "companyName",
      width: 120,
      sorter: true,
    },
    {
      title: "所属部门",
      dataIndex: "officeName",
      key: "officeName",
      width: 120,
      sorter: true,
    },
  ];
  return (
    <div className="user-table">
      <div>
        <Input
          placeholder="登录名"
          value={loginName}
          onChange={(e) => setLoginName(e.target.value)}
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
