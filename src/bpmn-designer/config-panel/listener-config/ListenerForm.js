import React, { useEffect,forwardRef,useImperativeHandle,useState  } from "react";
import { Select, Form, Input } from "antd";

const { Option } = Select;
const { useForm } = Form;

const ListenerForm = forwardRef(({ record }, ref) => {
  const [form] = useForm();
  const { setFieldsValue } = form;

  const [listenerType, setListenerType] = useState((record && record.listenerType) || "class");

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

  const config = (name) => ({
    // initialValue: (record && record.implement) || "",
    rules: [{ required: true, message: name + "不能为空" }],
  });

  useImperativeHandle(ref, () => ({
    validateFields: form.validateFields,
    resetFields: form.resetFields,
  }));

   // 监听表单值的变化
   form.onValuesChange = (changedValues) => {
    if (changedValues.listenerType) {
      setListenerType(changedValues.listenerType);
      setFieldsValue({ implement: "" });
      if (record) {
        record.implement = "";
      }
    }
  };

  useEffect(() => {
    form.setFieldsValue({...record,[record.listenerType]:(record && record.implement) || ""})
  }, [record]);

  return (
    <Form {...formItemLayout} form={form}  onValuesChange={form.onValuesChange}>
      <Form.Item label="事件类型" name="event" initialValue="start">
        <Select>
          <Option value="start">start</Option>
          <Option value="take">take</Option>
          <Option value="end">end</Option>
        </Select>
      </Form.Item>
      <Form.Item label="监听类型" name="listenerType" initialValue="class">
        <Select>
          <Option value="class">类</Option>
          <Option value="expression">表达式</Option>
          <Option value="delegateExpression">委托表达式</Option>
        </Select>
      </Form.Item>
      {listenerType === "class" && (
        <Form.Item label="类" name="class" {...config("类")}>
          <Input />
        </Form.Item>
      )}
      {listenerType === "expression" && (
        <Form.Item label="表达式" name="expression" {...config("表达式")}>
          <Input />
        </Form.Item>
      )}
      {listenerType === "delegateExpression" && (
        <Form.Item label="委托表达式" name="delegateExpression" {...config("委托表达式")}>
          <Input />
        </Form.Item>
      )}
    </Form>
  );
});

export default ListenerForm;