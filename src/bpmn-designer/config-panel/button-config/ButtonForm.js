import React, { forwardRef, useImperativeHandle } from "react";
import { Select, Form, Input, InputNumber } from "antd";

const { Option } = Select;
const { useForm } = Form;

/*
 * 添加按钮表单
 */
const ButtonForm = forwardRef(({ record }, ref) => {
  const [form] = useForm();

  useImperativeHandle(ref, () => ({
    validateFields: form.validateFields,
  }));

  const formItemLayout = {
    labelCol: {
      xs: { span: 24 },
      sm: { span: 6 },
    },
    wrapperCol: {
      xs: { span: 24 },
      sm: { span: 16 },
    },
  };

  return (
    <Form {...formItemLayout} form={form}>
      <Form.Item
        label="名称"
        name="name"
        initialValue={record.name || ""}
        rules={[{ required: true, message: "名称不能为空" }]}
      >
        <Input />
      </Form.Item>
      <Form.Item
        label="编码"
        name="code"
        initialValue={record.code || ""}
        rules={[{ required: true, message: "编码不能为空" }]}
      >
        <Input />
      </Form.Item>
      <Form.Item
        label="排序"
        name="sort"
        initialValue={record.sort || 0}
        rules={[{ required: true, message: "排序不能为空" }]}
      >
        <InputNumber min={0} />
      </Form.Item>
      <Form.Item
        label="是否隐藏"
        name="isHide"
        initialValue={record.isHide || "0"}
        rules={[{ required: true, message: "是否隐藏不能为空" }]}
      >
        <Select>
          <Option value="0">否</Option>
          <Option value="1">是</Option>
        </Select>
      </Form.Item>
    </Form>
  );
});

export default ButtonForm;
