import React, { useState } from "react";
import OrganizeTree from "./OrganizeTree";
import UserTable from "./UserTable";
import TagArea from "../TagArea";

/*
 * 用户选择组件
 */
export default function SelectUser(props) {
  const { selectUser, setSelectUser } = props;
  const [companyId, setCompanyId] = useState("");
  const [officeId, setOfficeId] = useState("");

  return (
    <div className="select-user">
      <OrganizeTree
        setCompanyId={setCompanyId}
        setOfficeId={setOfficeId}
        companyId={companyId}
        officeId={officeId}
      />
      <UserTable
        selectUser={selectUser}
        setSelectUser={setSelectUser}
        companyId={companyId}
        officeId={officeId}
        setCompanyId={setCompanyId}
        setOfficeId={setOfficeId}
      />
      <TagArea tag={selectUser} setTag={setSelectUser} />
    </div>
  );
}
