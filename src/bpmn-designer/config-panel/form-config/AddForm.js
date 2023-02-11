import React, { Component } from "react";
import { Select, Form } from "antd";
import { getFormList } from "../../services";

const { Option } = Select;

/*
 * 添加表单
 */
class AddForm extends Component {
  state = {
    formList: [],
  };

  componentDidMount() {
    getFormList().then((formList) => {
      this.setState({ formList });
      this.props.setFormList(formList);
    });
  }

  render() {
    const { form, selectForm = {} } = this.props;
    const { formList } = this.state;
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
        <Form.Item label="表单选择">
          {getFieldDecorator("id", {
            rules: [{ required: true }],
            initialValue: selectForm.id ? selectForm.id : "",
          })(
            <Select>
              {formList.map((item) => (
                <Option value={item.id} key={item.id}>
                  {item.name}
                </Option>
              ))}
            </Select>
          )}
        </Form.Item>
      </Form>
    );
  }
}

const WrappedAddForm = Form.create({})(AddForm);
export default WrappedAddForm;
