import React from "react";

import { createRoot } from 'react-dom/client';
import React from 'react';
import { Button, Input, Layout } from 'antd';

import ClustersManager from "./clusters_manager"


import { Layout } from 'antd';

import logo from "./assets/logo-AIGYRE_icon-blue.png"

import "./app.css";

const { Header, Footer, Sider, Content } = Layout;

const contentStyle = {
  minHeight: 120,
  lineHeight: '120px',
  marginTop: "100px"
};
const siderStyle = {
  textAlign: 'center',
  lineHeight: '120px',
  color: '#fff',
};
const footerStyle = {
  textAlign: 'center',
};
const layoutStyle = {
  borderRadius: 8,
  overflow: 'hidden',
};

const App = () =>  {
  return (
    
        <Layout style={layoutStyle}>
          <Header className="header">
            <img src={logo} alt="Logo"/>
            <div id="search-container">
              <Input
                placeholder="Search ..."
                id="search-container"
                defaultValue=""
                style={{ marginBottom: "0.5rem" }}
              />
              <Button className="button">🔍</Button>
            </div>
          </Header>
          <Content style={contentStyle}>
              <ClustersManager/>
          </Content>
          <Footer style={footerStyle}>Footer</Footer>
        </Layout>
  );
}


// Assurez-vous que cet élément existe dans votre fichier HTML
const container = document.getElementById("app");
const root = createRoot(container);
root.render(<App />); // Montez votre composant App
