import React, { useState } from 'react';
import { Table, Input, Popconfirm, Form, Typography, Space, Button, Modal } from 'antd';
import { useSelector, useDispatch } from 'react-redux';
import {
  saveAsync,
  deleteItem,
  selectList,
  isLoading,
  openModel,
  closeModel,
  visible
} from '../redux/todos.reducer';


const EditableCell = ({
  editing,
  dataIndex,
  title,
  record,
  index,
  children,
  ...restProps
}) => {
  const inputNode = <Input />;
  return (
    <td {...restProps}>
      {editing ? (
        <Form.Item
          name={dataIndex}
          style={{
            margin: 0,
          }}
          rules={[
            {
              required: true,
              message: `Please Input ${title}!`,
            },
          ]}
        >
          {inputNode}
        </Form.Item>
      ) : (
        children
      )}
    </td>
  );
};

const Todos = () => {
  const data = useSelector(selectList);
  const isVisible = useSelector(visible);
  const loading = useSelector(isLoading)
  const dispatch = useDispatch();

  const [form] = Form.useForm();
  const [editingKey, setEditingKey] = useState('');
  const [newItem, setNewItem] = useState('');

  const showModal = () => {
    dispatch(openModel());
  };

  const handleOk =  () => {
    let newData = [...data]
    let lastIndex = newData[newData.length-1]
    newData.push({name: newItem, key: lastIndex.key + 1})
    dispatch(saveAsync(newData))
  };

  const handleCancel = () => {
    dispatch(closeModel());
  };

  const handleInputChange = (e)=> {
    setNewItem(e.target.value)
  }

  const isEditing = (record) => record.key === editingKey;

  const edit = (record) => {
    form.setFieldsValue({
      name: '',
      ...record,
    });
    setEditingKey(record.key);
  };

  const handleDelete = (key) => {
    dispatch(deleteItem(key))
  };

  const cancel = () => {
    setEditingKey('');
  };

  const saveData = async (key) => {
    try {
      const row = await form.validateFields();
      const newData = [...data];
      const index = newData.findIndex((item) => key === item.key);

      if (index > -1) {
        const item = newData[index];
        newData.splice(index, 1, { ...item, ...row });
        dispatch(saveAsync(newData))
        setEditingKey('');
      } else {
        newData.push(row);
        dispatch(saveAsync(newData))
        setEditingKey('');
      }
    } catch (errInfo) {
      console.log('Validate Failed:', errInfo);
    }
  };


  const columns = [
    {
      title: 'Name',
      dataIndex: 'name',
      width: '50%',
      editable: true,
    },
    {
      title: 'Actions',
      dataIndex: 'actions',
      render: (_, record) => {
        const editable = isEditing(record);
        return editable ? (
          <span>
            <a
              href="javascript:;"
              onClick={() => saveData(record.key)}
              style={{
                marginRight: 8,
              }}
            >
              Save
            </a>
            <Popconfirm title="Sure to cancel?" onConfirm={cancel}>
              <a>Cancel</a>
            </Popconfirm>
          </span>
        ) : (
          <Space size="middle">
            <Typography.Link disabled={editingKey !== ''} onClick={() => edit(record)}>
              Edit
            </Typography.Link>

            <Popconfirm title="Sure to delete?" onConfirm={() => handleDelete(record.key)}>
              <a>Delete</a>
            </Popconfirm>
          </Space>
        );
      },
    },
  ];
  const mergedColumns = columns.map((col) => {
    if (!col.editable) {
      return col;
    }

    return {
      ...col,
      onCell: (record) => ({
        record,
        dataIndex: col.dataIndex,
        title: col.title,
        editing: isEditing(record),
      }),
    };
  });
  return (
    <div>
      <Form form={form} component={false}>
        <Button onClick={showModal} type="primary" style={{ marginBottom: 16 }}>
          Create Todo
        </Button>
        <Table
          loading={loading}
          components={{
            body: {
              cell: EditableCell,
            },
          }}
          bordered
          dataSource={data}
          columns={mergedColumns}
          rowClassName="editable-row"
          pagination={{
            onChange: cancel,
          }}
        />
      </Form>
      <Modal
        title="Add New Todo"
        visible={isVisible}
        onOk={handleOk}
        confirmLoading={loading}
        onCancel={handleCancel}
      >
        <Input onChange={handleInputChange} value={newItem}  placeholder="Enter Todo name" />
      </Modal>
    </div>
  );
};

export default Todos;