import React from "react";
import { Button, Input } from "antd";

import CarouselPhotoCluster from "./carousel_photo_cluster";
import { Col, Row } from 'antd';

import "./app.css";

const ClusterView = ({cluster, setEditCluster_, updateCluster}) => {
  const [continentCluster, setContinentCluster] = React.useState(cluster.continent)
  const [countryCluster, setCountryCluster] = React.useState(cluster.country)
  const [regionCluster, setRegionCluster] = React.useState(cluster.region)
  const [placeCluster, setPlaceCluster] = React.useState(cluster.place)

  if (!cluster || !cluster.centroid) {
    console.error("Cluster ou centroid invalide :", cluster);
    return <p>Erreur : Cluster invalide.</p>;
  }

  const url = `https://www.openstreetmap.org/export/embed.html?bbox=${
    cluster.centroid[1] - 1
  }%2C${cluster.centroid[0] - 1}%2C${cluster.centroid[1] + 1}%2C${
    cluster.centroid[0] + 1
  }&layer=mapnik&marker=${cluster.centroid[0]}%2C${cluster.centroid[1]}`;

  return (
    <>
    <Row >
      <Col span={24} style={{textAlign: "center"}}>
      <h2>{cluster.location || "Localisation inconnue"}</h2>
      </Col>
    </Row>
    <Row style={{marginBottom: 50}}>
      <Col span={24} style={{textAlign: "center"}}>
        <CarouselPhotoCluster
          photos={cluster.photos}
        />
      </Col>
    </Row>
    <Row>
      <Col span={12}>
        <div style={{ marginBottom: "1rem" }}>
          <Input
            placeholder="Continent"
            value={continentCluster}
            onChange={(e) => setContinentCluster(e.target.value)}
          />
          <Input
            placeholder="Country"
            value={countryCluster}
            onChange={(e) => setCountryCluster(e.target.value)}
          />
          <Input
            placeholder="Region"
            value={regionCluster}
            onChange={(e) => setRegionCluster(e.target.value)}
            style={{ marginBottom: "0.5rem" }}
          />
          <Input
            placeholder="Place"
            value={placeCluster}
            onChange={(e) => setPlaceCluster(e.target.value)}
            style={{ marginBottom: "0.5rem" }}
          />
          <Button onClick={() => setEditCluster_(undefined)}>Back</Button>
          <Button
            type="primary"
            onClick={() => {
              updateCluster({cluster_id: cluster.cluster_id, contient: continentCluster, country: countryCluster, region: regionCluster, place: placeCluster});
              setEditCluster_(undefined);
            }}
            style={{ marginLeft: "1rem" }}
          >
          Save
          </Button>
          </div>
      </Col>
      <Col span={12}>
        <div style={{ marginTop: "1rem" }}>
          <iframe
            src={url}
            width="100%"
            height="300"
            style={{ border: "1px solid #ccc" }}
            title="Cluster Location"
          ></iframe>
          <small>
            <a
              href={`https://www.openstreetmap.org/?mlat=${cluster.centroid[0]}&mlon=${cluster.centroid[1]}#map=11/${cluster.centroid[0]}/${cluster.centroid[1]}`}
              target="_blank"
              rel="noopener noreferrer"
            >
              Afficher une carte plus grande
            </a>
          </small>
            </div>
      </Col>
    </Row>
    </>
  );
};

export default ClusterView;
