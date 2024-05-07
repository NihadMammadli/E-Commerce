import React, { useEffect, useState } from 'react';
import { Modal, Form, Input, Select, Button, message, Tag } from 'antd';
import axios from 'axios';

const { Option } = Select;

const Insert = ({ open, close }) => {
  const [form] = Form.useForm();
  const [productTypes, setProductTypes] = useState([]);
  const [loading, setLoading] = useState(false);
  const [imageBase64, setImageBase64] = useState(null);

  const colorOptions = [
    { value: 'black', label: 'Black', color: '#000000' },
    { value: 'red', label: 'Red', color: '#ff0000' },
    { value: 'blue', label: 'Blue', color: '#0000ff' },
    { value: 'green', label: 'Green', color: '#008000' },
    { value: 'yellow', label: 'Yellow', color: '#ffff00' },
    { value: 'white', label: 'White', color: '#ffffff' },
    { value: 'gray', label: 'Gray', color: '#808080' },
    { value: 'brown', label: 'Brown', color: '#a52a2a' },
    { value: 'orange', label: 'Orange', color: '#ff7f00' },
    { value: 'purple', label: 'Purple', color: '#800080' },
    { value: 'pink', label: 'Pink', color: '#ffc0cb' },
    { value: 'cyan', label: 'Cyan', color: '#00ffff' },
    { value: 'magenta', label: 'Magenta', color: '#ff00ff' },
    { value: 'turquoise', label: 'Turquoise', color: '#40e0d0' },
    { value: 'teal', label: 'Teal', color: '#008080' },
    { value: 'lime', label: 'Lime', color: '#00ff00' },
    { value: 'olive', label: 'Olive', color: '#808000' },
    { value: 'gold', label: 'Gold', color: '#ffd700' },
    { value: 'silver', label: 'Silver', color: '#c0c0c0' },
    { value: 'navy', label: 'Navy', color: '#000080' },
    { value: 'maroon', label: 'Maroon', color: '#800000' },
    { value: 'indigo', label: 'Indigo', color: '#4b0082' },
    { value: 'lavender', label: 'Lavender', color: '#e6e6fa' },
    { value: 'beige', label: 'Beige', color: '#f5f5dc' },
    { value: 'coral', label: 'Coral', color: '#ff7f50' },
    { value: 'ivory', label: 'Ivory', color: '#fffff0' },
    { value: 'khaki', label: 'Khaki', color: '#f0e68c' },
    { value: 'salmon', label: 'Salmon', color: '#fa8072' },
    { value: 'tan', label: 'Tan', color: '#d2b48c' },
    { value: 'violet', label: 'Violet', color: '#ee82ee' },
    { value: 'mint', label: 'Mint', color: '#98ff98' },
  ];

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
      console.log('Məhsul əlavə olundu:', response.data);

      message.success('Məhsul əlavə olundu');
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
      title="Yeni Məhsul Yarat"
      visible={open}
      onCancel={close}
      footer={[
        <Button key="cancel" onClick={close}>
          Ləğv et
        </Button>,
        <Button key="submit" type="primary" onClick={handleSubmit} loading={loading}>
          Məhsul Əlavə Edin
        </Button>,
      ]}
    >
      <Form form={form} layout="vertical" onFinish={handleSubmit}>
        <Form.Item name="product_name" label="Məhsulun Adı" rules={[{ required: true, message: 'Zəhmət olmasa adı daxil edin' }]}>
          <Input />
        </Form.Item>
        <Form.Item name="description" label="Məhsul Haqqında Məlumatlar" rules={[{ required: true, message: 'Zəhmət olmasa məlumatları daxil edin' }]}>
          <Input.TextArea />
        </Form.Item>
        <Form.Item name="product_type_id" label="Məhsulun Növü" rules={[{ required: true, message: 'Zəhmət olmasa növü seçin' }]}>
          <Select>
            {productTypes.map(type => (
              <Option key={type.id} value={type.id}>
                {type.product_type}
              </Option>
            ))}
          </Select>
        </Form.Item>
        <Form.Item name="color" label="Rəng" rules={[{ required: true, message: 'Zəhmət olmasa rəngi seçin' }]}>
          <Select>
            {colorOptions.map((option) => (
              <Select.Option key={option.value} value={option.value}>
                <Tag color={option.color} style={{ height:"10px", marginRight: "10px"}}></Tag>
                {option.label}
              </Select.Option>
            ))}
          </Select>
        </Form.Item>

        <Form.Item name="price" label="Qiymət" rules={[{ required: true, message: 'Zəhmət olmasa qiyməti daxil edin' }]}>
          <Input type="number" min={0} step={0.01} />
        </Form.Item>
        <Form.Item name="rating" label="Keyfiyyət" rules={[{ required: true, message: 'Zəhmət olmasa keyfiyyəti daxil edin' }]}>
          <Input type="number" min={0} step={0.01} />
        </Form.Item>
        <Form.Item name="quantity" label="Say" rules={[{ required: true, message: 'Zəhmət olmasa sayı daxil edin' }]}>
          <Input type="number" min={0} step={0.01} />
        </Form.Item>
        <input type="file" accept="image/*" onChange={handleImageChange} style={{ marginBottom: '16px' }} />
        {imageBase64 && <img src={imageBase64} alt="Selected" style={{ maxWidth: '100%', marginBottom: '16px' }} />}
      </Form>
    </Modal>
  );
};

export default Insert;
