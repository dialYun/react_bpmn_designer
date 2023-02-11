import React from "react";
import RoleTable from "./RoleTable";
import TagArea from "../TagArea";

/*
 * 角色选择组件
 */
export default function SelectRole(props) {
  const { selectRole, setSelectRole } = props;

  return (
    <div className="select-user" style={{ height: 500 }}>
      <RoleTable selectRole={selectRole} setSelectRole={setSelectRole} />
      <TagArea tag={selectRole} setTag={setSelectRole} />
    </div>
  );
}
