import React, { Suspense } from "react";
import { Routes, Route, BrowserRouter } from "react-router-dom";
import { Result, Button, Spin } from "antd";
import Layout from "../Layouts";
import { Login, Products, Registration } from "../Pages";

const Index = () => {
    return (
        <BrowserRouter>
            <Suspense fallback={<Spin size="large" />}>
                <Routes>
                    <Route path="/">
                        <Route path="login" element={<Login />} />
                        <Route path="Registration" element={<Registration />} />
                        
                        <Route path="/ecommerce" element={<Layout />}>
                            <Route path="products" element={<Products />} />
                        </Route>

                    </Route>

                    {/* <Route
            path="*"
            element={
              <Result
                status="404"
                title="404"
                subTitle="Sorry, the page you visited does not exist."
                extra={<Button type="primary"><Link to="/">Back Home</Link></Button>}
              />
            }
          /> */}
                </Routes>
            </Suspense>
        </BrowserRouter>
    );
};

export default Index;
