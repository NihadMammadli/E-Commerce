import { useState } from 'react';
import { Row, Col, Input, Typography, message, Button, Form } from "antd";
import { Link, useNavigate } from "react-router-dom";
import axios from "axios";
import { RightOutlined } from '@ant-design/icons'; 

const { Title } = Typography;

function App() {
  const [form] = Form.useForm();
  const navigate  = useNavigate();

  const handleLogin = async (values) => {
    const { email, password } = values;

    try {
      const response = await axios.post(`${import.meta.env.VITE_BASE_API}/login/`, {
        email,
        password
      });

      console.log(response.data);

      message.success('Uğurla Daxil Olundu!');

      navigate('/ecommerce/products');
    } catch (error) {
      console.error('Login error:', error);
      message.error('Daxil Olmaq Alınmadı, email yadaki parol səhvdir!');
    }
  };

  return (
    <div style={{ height: "100vh", backgroundColor: "rgb(250, 250, 250)" }}>
      <Row justify="center" align="middle" style={{ height: "100%" }}>
        <Col span={10} style={{ height: "100%", backgroundColor: "#FFFFFF"}}>
          <div style={{padding: "30% 25%", textAlign: "center" }}>
            <Title level={4}>Hesaba daxil olun</Title>
            <Form
              form={form}
              onFinish={handleLogin}
              layout="vertical"  
            >
              <Form.Item
                label="E-mail"
                name="email"
                rules={[
                  {
                    required: true,
                    message: 'Emaili Daxil Edin!',
                  },
                ]}
              >
                <Input placeholder="Email" />
              </Form.Item>
              <Form.Item
                label="Şifrə"
                name="password"
                rules={[
                  {
                    required: true,
                    message: 'Parolu Daxil Edin!',
                  },
                ]}
              >
                <Input.Password placeholder="Password" />
              </Form.Item>
              <Form.Item>
                <Button type="primary" htmlType="submit" style={{ backgroundColor: "limegreen", width: "100%", fontSize:"16px", height: "40px", marginTop:"50px" }}>
                  Daxil ol
                </Button>
              </Form.Item>
              <Form.Item style={{ textAlign: 'right' }}>
                <Link
                  to="/registration"
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
                  Qeydiyyatdan keçin <RightOutlined style={{ marginLeft: '5px' }} />
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
