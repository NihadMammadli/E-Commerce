import React, { useEffect, useState } from 'react';
import { Row, Col, Input, Typography, Button, Card, Image } from 'antd';
import { UserOutlined, ShoppingCartOutlined, StarFilled, StarOutlined, PlusOutlined } from '@ant-design/icons';
import axios from 'axios';
import Insert from './Insert';

const { Title } = Typography;
const { Search } = Input;

const App = () => {
  const [products, setProducts] = useState([]);
  const [insertModal, setInsertModal] = useState(false);

  const showModal = () => {
    setInsertModal(true);
  };

  const closeModal = () => {
    setInsertModal(false);
    fetchProducts()
  };

  const renderStars = (rating) => {
    const fullStars = Math.floor(rating);
    const hasHalfStar = rating % 1 !== 0;

    const stars = [];
    for (let i = 0; i < fullStars; i++) {
      stars.push(<StarFilled key={`star${i}`} style={{ color: '#ffc107' }} />);
    }
    if (hasHalfStar) {
      stars.push(<StarOutlined key="halfStar" style={{ color: '#ffc107' }} />);
    }

    return stars;
  };

  const fetchProducts = async () => {
    try {
      const response = await axios.get(`${import.meta.env.VITE_BASE_URL}/products`);
      setProducts(response.data);
    } catch (error) {
      console.error('Error fetching products:', error);
    }
  };

  useEffect(() => {
    fetchProducts();
  }, []);

  return (
    <>
      <div style={{ height: '100vh', backgroundColor: 'rgb(250, 250, 250)', padding: '20px', justifyContent: "center", display: "flex" }}>
        <Col span={20} style={{ height: "100%", backgroundColor: "#FFFFFF" }}>
          <div style={{ padding: '10px 20px', display: 'flex', alignItems: 'center' }}>
            <Image
              width={77.5}
              height={50}
              src="https://upload.wikimedia.org/wikipedia/commons/2/20/Adalogonew.png"
            />
            <Search placeholder="Ne axtarirsiniz?" style={{ flex: 1, paddingLeft: "30px", marginRight: '10px' }} />
            <Button type="text" icon={<UserOutlined /> } style={{ marginRight: '10px' }}  onClick={goToLoginPage}>Daxil ol</Button>
            <Button type="text" icon={<ShoppingCartOutlined />}>Sebetim</Button>
            <Button type="text" icon={<PlusOutlined />}  onClick={showModal} >Produkt Əlavə et</Button>
          </div>

          <div style={{ paddingLeft: "20px", marginTop: '20px' }}>
            <Title level={3}>Produktlar</Title>
            <Row gutter={[16, 16]}>
              {products.map((product) => (
                <Col key={product.id} xs={12} sm={8} md={6} lg={4} xl={4}>
                  <Card hoverable>
                    <div style={{ textAlign: 'center' }}>
                      <img src={product.image_url} alt={product.product_name} style={{ width: '70%' }} />
                    </div>
                    <Card.Meta
                      title={product.product_name.trim()}
                      description={
                        <>
                          <div style={{ display: 'flex', justifyContent: 'center', marginBottom: '5px' }}>
                            {renderStars(parseFloat(product.rating))}
                          </div>
                          <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', marginBottom: '5px' }}>
                            <span style={{ color: 'gold', fontWeight: 'bold', marginRight: '5px' }}>{product.price} ₼</span>
                            <span style={{ textTransform: 'capitalize' }}>{product.color}</span>
                          </div>
                        </>
                      }
                    />
                  </Card>
                </Col>
              ))}
            </Row>
          </div>
        </Col>
      </div>
      <Insert open={insertModal} close={closeModal}/>
    </>
  );
};

export default App;
