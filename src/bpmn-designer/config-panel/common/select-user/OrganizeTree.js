import React, { useEffect, useState } from "react";
import { Tree, Icon, Input, Divider } from "antd";
import { getDepartList } from "../../../services";

const { TreeNode } = Tree;

/*
 * 组织树
 */
export default function OrganizeTree(props) {
  const { setCompanyId, setOfficeId, companyId, officeId } = props;
  const [dataSource, setDataSource] = useState({});
  const [selectKey, setSelectKey] = useState([]);
  const { id, name, children } = dataSource;

  //获取数据源
  useEffect(() => {
    getDepartList().then((data) => {
      setDataSource(data);
    });
  }, []);

  // 当公司id或部门id被重置时取消树节点选择
  useEffect(() => {
    if (!companyId && !officeId) setSelectKey([]);
  }, [companyId, officeId]);

  // 点击树节点,向父组件传参数
  function onSelect(key, e) {
    setSelectKey(key);
    const type = key[0].substring(0, 4);
    const id = key[0].substring(4);
    if (type === "com_") {
      setCompanyId(id);
      setOfficeId("");
    } else {
      setOfficeId(id);
      setCompanyId("");
    }
  }

  return (
    <div className="user-tree">
      <Input placeholder="请输入组织机构过滤" />
      <Divider />
      <Tree
        showIcon
        defaultExpandAll
        onSelect={onSelect}
        selectedKeys={selectKey}
      >
        <TreeNode
          icon={<Icon type="apartment" />}
          title={name}
          key={"com_" + id}
        >
          {children &&
            children.map((item) => (
              <TreeNode
                icon={<Icon type="team" />}
                title={item.name}
                key={"off_" + item.id}
              />
            ))}
        </TreeNode>
      </Tree>
    </div>
  );
}
