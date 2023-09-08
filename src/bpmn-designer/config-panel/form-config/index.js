import React, { useState, useEffect, useRef } from "react";
import { Radio, Divider, Button, Modal, Input, Checkbox } from "antd";
import { updateElementExtensions } from "../../utils";
import AddForm from "./AddForm";
import FormTable from "./FormTable";
import { ExclamationCircleFilled } from "@ant-design/icons";

/**
 * 表单设置
 */
export default function FormConfig(props) {
  const { bpmnInstance } = props;
  const [formType, setFormType] = useState("1");
  const [addModalVisible, setAddModalVisible] = useState(false);
  const [deleteModalVisible, setDeleteModalVisible] = useState(false);
  const [formProperty, setFormProperty] = useState([]);
  const [eventListener, setEventListener] = useState([]);
  const [selectForm, setSelectForm] = useState({});
  const [extFormUrl, setExtFormUrl] = useState("");
  const [extFormReadable, setExtFormReadable] = useState(false);

  const formRef = useRef(null);
  const { bpmnElement = {}, modeling } = bpmnInstance;
  let formList = [];

  // 读取表单数据
  useEffect(() => {
    if (bpmnElement.businessObject) {
      const busObj = bpmnElement.businessObject;
      if (busObj.formType) {
        const { formKey, $attrs, formType, formReadOnly } = busObj;
        if (formType.toString() === "2") {
          // 外部表单
          setFormType("2");
        } else {
          // 动态表单
          setFormType("1");
        }

        // 读取外部表单属性
        setExtFormUrl($attrs["flowable:outFormKey"]);
        setExtFormReadable(formReadOnly);

        // 读取动态表单属性
        const listener = [];
        let list =
          (busObj.extensionElements &&
            busObj.extensionElements.values &&
            busObj.extensionElements.values.filter((ex) => {
              if (ex.$type.indexOf("FormProperty") !== -1) {
                return true;
              }
              listener.push(ex);
            })) ||
          [];
        list = list.map((item) => {
          item.readable = item.readable === "true";
          item.writable = item.writable === "true";
          return item;
        });
        setEventListener(listener);
        setFormProperty(list);
        setSelectForm({
          id: formKey,
          name: $attrs["flowable:formName"],
          version: $attrs["flowable:formVersion"],
          fields: list,
        });
      } else {
        setFormType("1");
        setEventListener([]);
        setFormProperty([]);
        setSelectForm({});
        setExtFormUrl("");
        setExtFormReadable(false);
      }
    }
  }, [bpmnElement.businessObject]);

  // 保存表单
  const handAddModalOk = () => {
    formRef.current
      .validateFields()
      .then((values) => {
        const form = formList.filter((item) => item.id === values.id)[0];

        // 更新列表
        setSelectForm(form);

        //更新bpmn数据
        modeling.updateProperties(bpmnElement, {
          "flowable:formKey": form.id,
          "flowable:formType": form.type,
          "flowable:formName": form.name,
          "flowable:formVersion": form.version,
        });

        // 更新扩展属性
        const property = [];
        for (const field of form.fields) {
          property.push(
            bpmnInstance.moddle.create("flowable:FormProperty", field)
          );
        }
        setFormProperty(property);
        updateElementExtensions([...property, ...eventListener], bpmnInstance);

        setAddModalVisible(false);
      })
      .catch((error) => {});
  };

  // 改变表单字段的可读/可写属性
  function onChangeProperty(value, key, record, index) {
    // 更新列表数据
    selectForm.fields[index][key] = value;
    setSelectForm(JSON.parse(JSON.stringify(selectForm)));

    // 更新bpmn数据
    for (const item of formProperty) {
      if (item.id === record.id) {
        item[key] = value;
        break;
      }
    }
    updateElementExtensions([...formProperty, ...eventListener], bpmnInstance);
  }

  // 删除表单
  function handDeleteModalOk() {
    // 删除列表
    setSelectForm({});
    setDeleteModalVisible(false);

    // 删除bpmn数据
    modeling.updateProperties(bpmnElement, {
      "flowable:formKey": null,
      "flowable:formType": "",
      "flowable:formName": "",
      "flowable:formVersion": "",
    });
    //删除扩展属性
    setFormProperty([]);
    updateElementExtensions([...eventListener], bpmnInstance);
  }

  // 设置外部表单地址
  function onChangeExtUrl(e) {
    const value = e.target.value;
    setExtFormUrl(value);
    modeling.updateProperties(bpmnElement, {
      "flowable:formType": 2,
      "flowable:outFormKey": value,
    });
  }

  // 设置外部表单只读
  function onChangeExtReadable(e) {
    const value = e.target.checked;
    setExtFormReadable(value);
    modeling.updateProperties(bpmnElement, {
      "flowable:formReadOnly": value,
    });
  }

  // 改变表单类型
  function changeFormType(e) {
    setFormType(e.target.value);
    modeling.updateProperties(bpmnElement, {
      "flowable:formType": e.target.value,
    });
  }

  return (
    <>
      <Radio.Group onChange={changeFormType} value={formType}>
        <Radio value="1">动态表单</Radio>
        <Radio value="2">外置表单</Radio>
      </Radio.Group>
      <Divider />
      {formType.toString() === "1" && (
        <>
          <div className="config-btn">
            <Button
              type="primary"
              onClick={() => setAddModalVisible(true)}
              disabled={selectForm.id}
            >
              添加
            </Button>
            <Button
              type="primary"
              onClick={() => setAddModalVisible(true)}
              disabled={!selectForm.id}
            >
              修改
            </Button>
            <Button
              type="primary"
              onClick={() => setDeleteModalVisible(true)}
              disabled={!selectForm.id}
            >
              删除
            </Button>
          </div>
          <FormTable
            data={selectForm.id ? [selectForm] : []}
            onChangeProperty={onChangeProperty}
          />
        </>
      )}
      {formType.toString() === "2" && (
        <div className="base-form">
          <div>
            <span>表单地址</span>
            <Input value={extFormUrl} onChange={onChangeExtUrl} />
          </div>
          <div>
            <span style={{ marginLeft: -16 }}>表单只读</span>
            <Checkbox
              onChange={onChangeExtReadable}
              checked={extFormReadable}
              style={{ lineHeight: "32px" }}
            >
              勾选执行此审批节点时表单不可以修改
            </Checkbox>
          </div>
        </div>
      )}
      <Modal
        title="选择动态表单"
        open={addModalVisible}
        onOk={handAddModalOk}
        onCancel={() => setAddModalVisible(false)}
        destroyOnClose
      >
        <AddForm
          ref={formRef}
          setFormList={(list) => (formList = list)}
          selectForm={selectForm}
        />
      </Modal>
      <Modal
        title="提示"
        open={deleteModalVisible}
        onOk={handDeleteModalOk}
        onCancel={() => setDeleteModalVisible(false)}
      >
        <ExclamationCircleFilled />
        确认删除动态表单吗？
      </Modal>
    </>
  );
}
