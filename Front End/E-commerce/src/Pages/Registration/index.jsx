import { useState } from 'react';
import { Row, Col, Input, Typography, message, Button, Form, Select } from "antd";
import { Link, useNavigate  } from "react-router-dom";
import axios from "axios";
import { RightOutlined } from '@ant-design/icons'; 

const { Title } = Typography;
const { Option } = Select;

function App() {
  const [form] = Form.useForm();
  const navigate  = useNavigate();

  const handleRegister = async (values) => {
    const { name, surname, username, fatherName, email, password, repeatPassword, age, gender } = values;

    const ageValue = age === "" ? null : age;

    try {
      const response = await axios.post(`${import.meta.env.VITE_BASE_API}/users/`, {
        name,
        surname,
        username,
        fatherName,
        email,
        password,
        repeatPassword,
        age: ageValue,
        gender
      });

      console.log(response.data);

      message.success('Hesab Yaradıldı!');

      navigate('/login');
    } catch (error) {
      console.error('Hesab yaratmaq alinmadi!', error);

      if (error.response && error.response.data && error.response.data.message) {
        message.error(`Hesab yaratmaq alinmadi: ${error.response.data.message}`);
      } else {
        message.error('Hesab yaratmaq alinmadi. Yenidən yoxlayın');
      }
    }
  };


  return (
    <div style={{ height: "100vh", backgroundColor: "rgb(250, 250, 250)" }}>
      <Row justify="center" align="middle" style={{ height: "100%" }}>
        <Col span={16} style={{ height: "100%", backgroundColor: "#FFFFFF"}}>
          <div style={{ padding: "10% 25%", textAlign: "center" }}>
            <Title level={4}>Yeni Hesab Yarat</Title>
            <Form
              form={form}
              onFinish={handleRegister}
              layout="vertical"
            >
              <Row gutter={16}>
                <Col span={12}>
                  <Form.Item
                    label="Ad"
                    name="name"
                    rules={[
                      { required: true, message: 'Adı daxil edin!' }
                    ]}
                  >
                    <Input placeholder="Ad" />
                  </Form.Item>
                </Col>
                <Col span={12}>
                  <Form.Item
                    label="Soyad"
                    name="surname"
                    rules={[
                      { required: true, message: 'Soyadı daxil edin!' }
                    ]}
                  >
                    <Input placeholder="Soyad" />
                  </Form.Item>
                </Col>
              </Row>
              <Row gutter={16}>
                <Col span={12}>
                  <Form.Item
                    label="İstifadəçi adı"
                    name="username"
                    rules={[
                      { required: true, message: 'İstifadəçi adını daxil edin!' }
                    ]}
                  >
                    <Input placeholder="İstifadəçi adı" />
                  </Form.Item>
                </Col>
                <Col span={12}>
                  <Form.Item
                    label="Ata adı"
                    name="fatherName"
                  >
                    <Input placeholder="Ata adı" />
                  </Form.Item>
                </Col>
              </Row>
              <Row gutter={16}>
                <Col span={24}>
                  <Form.Item
                    label="E-mail"
                    name="email"
                    rules={[
                      { required: true, type: 'email', message: 'Düzgün e-mail daxil edin!' }
                    ]}
                  >
                    <Input placeholder="E-mail" />
                  </Form.Item>
                </Col>
              </Row>
              <Row gutter={16}>
                <Col span={12}>
                  <Form.Item
                    label="Şifrə"
                    name="password"
                    rules={[
                      { required: true, message: 'Şifrə daxil edin!' }
                    ]}
                  >
                    <Input.Password placeholder="Şifrə" />
                  </Form.Item>
                </Col>
                <Col span={12}>
                  <Form.Item
                    label="Şifrəni təsdiqlə"
                    name="repeatPassword"
                    dependencies={['password']}
                    rules={[
                      { required: true, message: 'Şifrəni təsdiqləyin!' },
                      ({ getFieldValue }) => ({
                        validator(_, value) {
                          if (!value || getFieldValue('password') === value) {
                            return Promise.resolve();
                          }
                          return Promise.reject(new Error('Şifrələr uyğun deyil!'));
                        },
                      }),
                    ]}
                  >
                    <Input.Password placeholder="Şifrəni təsdiqlə" />
                  </Form.Item>
                </Col>
              </Row>
              <Row gutter={16}>
                <Col span={12}>
                  <Form.Item
                    label="Yaş"
                    name="age"
                  >
                    <Input type="number" placeholder="Yaş" />
                  </Form.Item>
                </Col>
                <Col span={12}>
                  <Form.Item
                    label="Cins"
                    name="gender"
                  >
                    <Select placeholder="Cins">
                      <Option value="male">Kişi</Option>
                      <Option value="female">Qadın</Option>
                      <Option value="nonbinary">Non-binary</Option>
                    </Select>
                  </Form.Item>
                </Col>
              </Row>
              <Form.Item>
                <Button type="primary" htmlType="submit" style={{ backgroundColor: "limegreen", width: "100%", fontSize:"16px", height: "40px", marginTop:"50px" }}>
                  Qeydiyyatdan Keç
                </Button>
              </Form.Item>
              <Form.Item style={{ textAlign: 'right' }}>
                <Link
                  to="/login"
                  style={{
                    color: 'green',
                    fontSize: '16px',
                    display: 'inline-flex',
                    alignItems: 'center',
                    textDecoration: 'none', 
                  }}
                  onMouseEnter={(e) => e.target.style.color = 'limegreen'} 
                  onMouseLeave={(e) => e.target.style.color = 'green'}   
                >
                  Giriş <RightOutlined style={{ marginLeft: '5px' }} />
                </Link>
              </Form.Item>
            </Form>
          </div>
        </Col>
      </Row>
    </div>
  );
}

export default App;
