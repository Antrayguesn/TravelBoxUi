import React from "react";
import { Button, Input } from "antd";

import CarouselPhotoCluster from "./carousel_photo_cluster";
import { Col, Row } from 'antd';

import "./app.css";

const ClusterView = ({cluster, setClusterLocation, updateCluster, deletePhoto}) => {
  const [continentCluster, setContinentCluster] = React.useState(cluster.continent)
  const [countryCluster, setCountryCluster] = React.useState(cluster.country)
  const [regionCluster, setRegionCluster] = React.useState(cluster.region)
  const [placeCluster, setPlaceCluster] = React.useState(cluster.place)

  const buildOpenStreetMapUrl = (coord) => (
        <div style={{ marginTop: "1rem" }}>
          <iframe
            src={
  `https://www.openstreetmap.org/export/embed.html?bbox=${
    coord[1] - 1
  }%2C${coord[0] - 1}%2C${coord[1] + 1}%2C${
    coord[0] + 1
  }&layer=mapnik&marker=${coord[0]}%2C${coord[1]}`
}
            width="100%"
            height="300"
            style={{ border: "1px solid #ccc" }}
            title="Cluster Location"
          ></iframe>
          <small>
            <a
              href={`https://www.openstreetmap.org/?mlat=${coord[0]}&mlon=${coord[1]}#map=11/${coord[0]}/${coord[1]}`}
              target="_blank"
              rel="noopener noreferrer"
            >
              Afficher une carte plus grande
            </a>
          </small>
            </div>
   
)


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
          deletePhoto={deletePhoto}
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
          <Button onClick={() => setClusterLocation(undefined)}>Back</Button>
          <Button
            type="primary"
            onClick={() => {
              updateCluster({cluster_id: cluster.cluster_id, continent: continentCluster, country: countryCluster, region: regionCluster, place: placeCluster});
              setClusterLocation(undefined);
            }}
            style={{ marginLeft: "1rem" }}
          >
          Save
          </Button>
          </div>
      </Col>
      { cluster.centroid &&
      <Col span={12}>
        { buildOpenStreetMapUrl(cluster.centroid) }
      </Col>}
    </Row>
    </>
  );
};

export default ClusterView;
