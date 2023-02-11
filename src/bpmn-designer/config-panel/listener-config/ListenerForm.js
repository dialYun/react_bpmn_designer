import React, { Component } from "react";
import { Select, Form, Input } from "antd";

const { Option } = Select;

/*
 * 添加执行监听器表单
 */
class ListenerForm extends Component {
  render() {
    const { form, record } = this.props;
    const { getFieldDecorator, getFieldValue } = form;

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
      initialValue: (record && record.implement) || "",
      rules: [{ required: true, message: name + "不能为空" }],
    });

    return (
      <Form {...formItemLayout}>
        <Form.Item label="事件类型">
          {getFieldDecorator("event", {
            initialValue: (record && record.event) || "start",
          })(
            <Select>
              <Option value="start">start</Option>
              <Option value="take">take</Option>
              <Option value="end">end</Option>
            </Select>
          )}
        </Form.Item>
        <Form.Item label="监听类型">
          {getFieldDecorator("listenerType", {
            initialValue: (record && record.listenerType) || "class",
          })(
            <Select onChange={() => (record.implement = "")}>
              <Option value="class">类</Option>
              <Option value="expression">表达式</Option>
              <Option value="delegateExpression">委托表达式</Option>
            </Select>
          )}
        </Form.Item>
        {getFieldValue("listenerType") === "class" && (
          <Form.Item label="类">
            {getFieldDecorator("class", config("类"))(<Input />)}
          </Form.Item>
        )}
        {getFieldValue("listenerType") === "expression" && (
          <Form.Item label="表达式">
            {getFieldDecorator("expression", config("表达式"))(<Input />)}
          </Form.Item>
        )}
        {getFieldValue("listenerType") === "delegateExpression" && (
          <Form.Item label="委托表达式">
            {getFieldDecorator(
              "delegateExpression",
              config("委托表达式")
            )(<Input />)}
          </Form.Item>
        )}
      </Form>
    );
  }
}

const WrappedListenerForm = Form.create({})(ListenerForm);
export default WrappedListenerForm;
