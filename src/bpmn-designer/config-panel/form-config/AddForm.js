import React, { useState, useEffect, useImperativeHandle, forwardRef } from "react";
import { Form, Select } from "antd";
import { getFormList } from "../../services";

const { Option } = Select;
const { useForm } = Form;

/*
 * 添加表单
 */
const AddForm = forwardRef(({ selectForm = {}, setFormList }, ref) => {

  const [form] = useForm();  
  const [formList, setFormListState] = useState([]);

  
  useEffect(() => {
    getFormList().then((formList) => {
      setFormListState(formList);
      setFormList(formList);
    });
  }, [setFormList]);

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
        label="表单选择"
        name="id"
        rules={[{ required: true }]}
        initialValue={selectForm.id ? selectForm.id : ""}
      >
        <Select>
          {formList.map((item) => (
            <Option value={item.id} key={item.id}>
              {item.name}
            </Option>
          ))}
        </Select>
      </Form.Item>
    </Form>
  );
});

export default AddForm;
