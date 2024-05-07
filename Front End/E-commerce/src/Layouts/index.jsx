import React, { useState } from "react";
import Container from "./Container";
import style from "./style.module.scss";
import { Layout, Image } from "antd";
const { Sider } = Layout;

const Index = () => {
  const [collapsed, setCollapsed] = useState(false);

  return (
    <Layout className={style.container}>
      <Layout>
        <Image
          width={77.5}
          height={50}
          src="https://upload.wikimedia.org/wikipedia/commons/2/20/Adalogonew.png"
        />
        <Container />
      </Layout>
    </Layout>
  );
};
export default Index;
