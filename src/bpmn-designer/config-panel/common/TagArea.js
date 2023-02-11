import React from "react";
import { Tag } from "antd";

/*
 * 展示已选择用户标签
 */
export default function TagArea(props) {
  const { tag = [], setTag } = props;

  // 删除用户
  function onClose(index) {
    tag.splice(index, 1);
    setTag(JSON.parse(JSON.stringify(tag)));
  }

  return (
    <div style={{ width: 150 }}>
      {tag.map((item, index) => (
        <Tag color="blue" closable onClose={() => onClose(index)} key={index}>
          {item.name}
        </Tag>
      ))}
    </div>
  );
}
