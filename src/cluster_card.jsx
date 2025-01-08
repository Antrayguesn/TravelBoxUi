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
  console.log(cluster)

  return (
    cluster && Object.keys(cluster).length ? <Card
      hoverable
      style={{ width: 500 }}
      onClick={() => setEditCluster(cluster.cluster_id)}
    >
      <Meta title={cluster.location} description={cluster.location || "Localisation inconnue"} />
    </Card> : undefined
  );
};

export default ClusterCard;
