import React, { useState } from "react";
import { Card } from "antd";
import "./app.css";

const { Meta } = Card;

const API_BASE_URL = "/api";

const ClusterCard = ({ setEditCluster, location }) => {
  const [cluster, setCluster] = useState();
  const photos = cluster && Object.values(cluster.photos || {});
  const randomPhoto = photos && photos[Math.floor(Math.random() * photos.length)];

  React.useEffect(() => {
    const utf8Bytes = new TextEncoder().encode(location);

    fetch(`${API_BASE_URL}/get_cluster_by_location/${btoa(String.fromCharCode(...utf8Bytes))}`)
      .then((response) => {
        if (!response.ok) {
          throw new Error(`HTTP error! Status: ${response.status}`);
        }
        return response.json();
      })
      .then((data) => {
        if (data && typeof data === "object") {
          setCluster(data)
        } else {
          console.error("Les données reçues ne sont pas valides:", data);
        }
      })
      .catch((error) => {
        console.error("Erreur de récupération des clusters", error);
      });
  }, []);

  return (
    cluster && <Card
      hoverable
      style={{ width: 500 }}
      cover={
        randomPhoto ? (
          <img style={{paddingBottom: "56.25%", overflow: "hidden", height: "100%"}} src={`api/${randomPhoto.path}`} alt="Photo aléatoire du cluster" />
        ) : (
          <div style={{ height: 150, backgroundColor: "#f0f0f0", display: "flex", alignItems: "center", justifyContent: "center" }}>
            Aucune photo
          </div>
        )
      }
      onClick={() => setEditCluster(cluster.cluster_id)}
    >
      <Meta title={cluster.location} description={cluster.location || "Localisation inconnue"} />
    </Card>
  );
};

export default ClusterCard;
