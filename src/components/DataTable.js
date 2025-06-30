import React, { useState } from 'react';
import { Table, Button, Input, Modal, Form, DatePicker, InputNumber } from 'antd';
import { SearchOutlined, PlusOutlined, EditOutlined, DeleteOutlined } from '@ant-design/icons';
import { debounce } from 'lodash';
import dayjs from 'dayjs';

const { Column } = Table;

const DataTable = () => {
  const [data, setData] = useState([]);
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [editingKey, setEditingKey] = useState('');
  const [searchText, setSearchText] = useState('');
  const [form] = Form.useForm();

  const showModal = () => {
    form.resetFields();
    setEditingKey('');
    setIsModalVisible(true);
  };

  const handleEdit = (record) => {
    form.setFieldsValue({
      ...record,
      date: dayjs(record.date),
    });
    setEditingKey(record.key);
    setIsModalVisible(true);
  };

  const handleDelete = (key) => {
    setData(data.filter(item => item.key !== key));
  };

  const handleSearch = debounce((value) => {
    setSearchText(value.toLowerCase());
  }, 300);

const filteredData = searchText
  ? data.filter(item => 
      Object.values(item).some(val => 
        String(val).toLowerCase().includes(searchText)
      )
    )
  : data;

  const handleOk = () => {
    form.validateFields()
      .then(values => {
        const newRecord = {
          ...values,
          date: values.date.format('YYYY-MM-DD'),
          key: editingKey || Date.now().toString(),
        };

        if (editingKey) {
          setData(data.map(item => item.key === editingKey ? newRecord : item));
        } else {
          setData([...data, newRecord]);
        }

        setIsModalVisible(false);
      })
      .catch(info => {
        console.log('Validate Failed:', info);
      });
  };

  return (
    <div style={{ padding: '20px' }}>
      <div style={{ marginBottom: '16px', display: 'flex', justifyContent: 'space-between' }}>
        <Input
          placeholder="Поиск по таблице"
          prefix={<SearchOutlined />}
          onChange={(e) => handleSearch(e.target.value)}
          style={{ width: '300px' }}
        />
        <Button type="primary" icon={<PlusOutlined />} onClick={showModal}>
          Добавить
        </Button>
      </div>

      <Table dataSource={filteredData} bordered>
        <Column
          title="Имя"
          dataIndex="name"
          key="name"
          sorter={(a, b) => a.name.localeCompare(b.name)}
        />
        <Column
          title="Дата"
          dataIndex="date"
          key="date"
          sorter={(a, b) => new Date(a.date) - new Date(b.date)}
        />
        <Column
          title="Числовое значение"
          dataIndex="value"
          key="value"
          sorter={(a, b) => a.value - b.value}
        />
        <Column
          title="Действия"
          key="action"
          render={(_, record) => (
            <div>
              <Button
                type="link"
                icon={<EditOutlined />}
                onClick={() => handleEdit(record)}
              />
              <Button
                type="link"
                danger
                icon={<DeleteOutlined />}
                onClick={() => handleDelete(record.key)}
              />
            </div>
          )}
        />
      </Table>

      <Modal
        title={editingKey ? "Редактирование записи" : "Добавление записи"}
        visible={isModalVisible}
        onOk={handleOk}
        onCancel={() => setIsModalVisible(false)}
      >
        <Form form={form} layout="vertical">
          <Form.Item
            name="name"
            label="Имя"
            rules={[{ required: true, message: 'Пожалуйста, введите имя' }]}
          >
            <Input />
          </Form.Item>
          <Form.Item
            name="date"
            label="Дата"
            rules={[{ required: true, message: 'Пожалуйста, выберите дату' }]}
          >
            <DatePicker style={{ width: '100%' }} />
          </Form.Item>
          <Form.Item
            name="value"
            label="Числовое значение"
            rules={[{ required: true, message: 'Пожалуйста, введите число' }]}
          >
            <InputNumber style={{ width: '100%' }} />
          </Form.Item>
        </Form>
      </Modal>
    </div>
  );
};

export default DataTable;