import React from "react";
import PostTable from "./PostTable";
import TagArea from "../TagArea";

/*
 * 岗位选择组件
 */
export default function SelectPost(props) {
  const { selectPost, setSelectPost } = props;

  return (
    <div className="select-user" style={{ height: 500 }}>
      <PostTable selectPost={selectPost} setSelectPost={setSelectPost} />
      <TagArea tag={selectPost} setTag={setSelectPost} />
    </div>
  );
}
