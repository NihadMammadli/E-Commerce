import React, { useEffect, useState } from 'react';
import { Modal, Form, Input, Select, Button, message } from 'antd';
import axios from 'axios';

const { Option } = Select;

const Insert = ({ open, close }) => {
  const [form] = Form.useForm();
  const [productTypes, setProductTypes] = useState([]);
  const [loading, setLoading] = useState(false);
  const [imageBase64, setImageBase64] = useState(null);

  useEffect(() => {
    axios.get(`${import.meta.env.VITE_BASE_API}/products_list`)
      .then(response => {
        setProductTypes(response.data);
      })
      .catch(error => {
        console.error('Error fetching product types:', error);
      });
  }, []);

  const handleImageChange = e => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = () => {
        setImageBase64(reader.result); 
      };
      reader.readAsDataURL(file); 
    }
  };

  const handleSubmit = async () => {
    try {
      setLoading(true);
      const formData = await form.validateFields();

      if (imageBase64) {
        formData.image_url = imageBase64;
      }

      const response = await axios.post(`${import.meta.env.VITE_BASE_API}/products`, formData);
      console.log('Product added:', response.data);

      message.success('Product added successfully');
      form.resetFields();
      setImageBase64(null);
      close();
    } catch (error) {
      console.error('Error adding product:', error);
      message.error('Failed to add product');
    } finally {
      setLoading(false);
    }
  };

  return (
    <Modal
      title="Add New Product"
      visible={open}
      onCancel={close}
      footer={[
        <Button key="cancel" onClick={close}>
          Cancel
        </Button>,
        <Button key="submit" type="primary" onClick={handleSubmit} loading={loading}>
          Add Product
        </Button>,
      ]}
    >
      <Form form={form} layout="vertical" onFinish={handleSubmit}>
        <Form.Item name="product_name" label="Product Name" rules={[{ required: true, message: 'Please enter product name' }]}>
          <Input />
        </Form.Item>
        <Form.Item name="description" label="Description" rules={[{ required: true, message: 'Please enter description' }]}>
          <Input.TextArea />
        </Form.Item>
        <Form.Item name="product_type_id" label="Product Type" rules={[{ required: true, message: 'Please select product type' }]}>
          <Select>
            {productTypes.map(type => (
              <Option key={type.id} value={type.id}>
                {type.product_type}
              </Option>
            ))}
          </Select>
        </Form.Item>
        <Form.Item name="color" label="Color" rules={[{ required: true, message: 'Please select color' }]}>
          <Select>
            <Option value="black">Black</Option>
            <Option value="red">Red</Option>
            <Option value="blue">Blue</Option>
            <Option value="green">Green</Option>
            {/* Add more color options as needed */}
          </Select>
        </Form.Item>
        <Form.Item name="price" label="Price" rules={[{ required: true, message: 'Please enter price' }]}>
          <Input type="number" min={0} step={0.01} />
        </Form.Item>
        <Form.Item name="rating" label="Rating" rules={[{ required: true, message: 'Please enter rating' }]}>
          <Input type="number" min={0} step={0.01} />
        </Form.Item>
        <input type="file" accept="image/*" onChange={handleImageChange} style={{ marginBottom: '16px' }} />
        {imageBase64 && <img src={imageBase64} alt="Selected" style={{ maxWidth: '100%', marginBottom: '16px' }} />}
      </Form>
    </Modal>
  );
};

export default Insert;
