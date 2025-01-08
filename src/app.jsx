import React from "react";

import { createRoot } from 'react-dom/client';
import React from 'react';
import { Button, Flex, Input, Layout } from 'antd';

import ClustersView from "./clusters_view";
import ClusterView from "./cluster_view";

import { useFetchClusters } from "./utils";
import { Flex, Layout } from 'antd';

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
  const [clusterToEdit, setClustersToEdit] = React.useState();
  const [loading, clusters, reloadCluster] = useFetchClusters();

  const handleEditCluster = (cluster_id) => {
    setClustersToEdit(cluster_id);
  };

  if (loading) {
    return <p>Chargement des clusters...</p>;
  }

  const updateCluster = (data) => {
    
      const updatedCluster = { 
        ...clusters[data.cluster_id], // Garder les autres propriétés du cluster
        continent: data.continentr,
        country: data.country,
        region: data.region,
        place: data.place
      };

      const apiURL = window.location + "api/cluster/" + data.cluster_id

      fetch(apiURL, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json'
          },
          body: JSON.stringify(updatedCluster)
      })
      .then(response => {
        if (!response.ok) {
          throw new Error('Erreur lors de la sauvegarde des modifications');
        }
        return response.json();
      })
      .then(data => {
        reloadCluster(Date.now());
      })
      .catch(error => {
        console.error('Erreur:', error);
        alert('Une erreur est survenue lors de la sauvegarde des modifications.');
      });

  };

  return (
    
        <Layout style={layoutStyle}>
          <Header className="header">
            <a href="/">
              <img src="assets/logo-AIGYRE_icon-blue.png" alt="Logo" />
            </a>
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
            {clusterToEdit && clusters[clusterToEdit]? 
              <ClusterView
                cluster={{...clusters[clusterToEdit], cluster_id: clusterToEdit}}
                setEditCluster_={handleEditCluster}
                updateCluster={updateCluster}
              />
             : 
              <ClustersView
                clusters={clusters}
                setEditCluster_={handleEditCluster}
              />
            }
          </Content>
          <Footer style={footerStyle}>Footer</Footer>
        </Layout>
  );
}


// Assurez-vous que cet élément existe dans votre fichier HTML
const container = document.getElementById("app");
const root = createRoot(container);
root.render(<App />); // Montez votre composant App
