import React, { Component } from "react";
import { Select, Form, Input, InputNumber } from "antd";

const { Option } = Select;

/*
 * 添加按钮表单
 */
class ButtonForm extends Component {
  render() {
    const { form, record } = this.props;
    const { getFieldDecorator } = form;

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
      <Form {...formItemLayout}>
        <Form.Item label="名称">
          {getFieldDecorator("name", {
            initialValue: record.name || "",
            rules: [{ required: true, message: "名称不能为空" }],
          })(<Input />)}
        </Form.Item>
        <Form.Item label="编码">
          {getFieldDecorator("code", {
            initialValue: record.code || "",
            rules: [{ required: true, message: "编码不能为空" }],
          })(<Input />)}
          <div className="button-tip">
            <span>
              注意：按钮编码不能重复，系统按钮以_flow_开头，自定义按钮不能以_flow_开头。
              系统按钮和自定义按钮的区别是，系统按钮是绑定具体的action进行提交，如果你定义了系统按钮，必须在代码中实现对应的action方法。
              自定义按钮无需在代码中添加action方法，触发自定义按钮时调用的是【同意】按钮对应的action，并把该按钮对应的code设置为true、其他自定义按钮对应的code设置为false作为流程变量进行提交。
            </span>
          </div>
        </Form.Item>
        <Form.Item label="排序">
          {getFieldDecorator("sort", {
            initialValue: record.sort || 0,
            rules: [{ required: true, message: "排序不能为空" }],
          })(<InputNumber min={0} />)}
        </Form.Item>
        <Form.Item label="是否隐藏">
          {getFieldDecorator("isHide", {
            initialValue: record.isHide || "0",
            rules: [{ required: true, message: "是否隐藏不能为空" }],
          })(
            <Select>
              <Option value="0">否</Option>
              <Option value="1">是</Option>
            </Select>
          )}
        </Form.Item>
      </Form>
    );
  }
}

const WrappedButtonForm = Form.create({})(ButtonForm);
export default WrappedButtonForm;
