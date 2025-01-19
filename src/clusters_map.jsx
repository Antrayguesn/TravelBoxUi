import React, { useState, useEffect } from "react";
import { MapContainer, TileLayer, Marker, Popup } from "react-leaflet";
import L from "leaflet";
import "leaflet/dist/leaflet.css";
import { gpx } from "@tmcw/togeojson"; // Bibliothèque pour convertir GPX en GeoJSON
import { Card } from "antd";

import { DeleteOutlined, EditOutlined, PushpinOutlined } from "@ant-design/icons";

// Exemple d'icône pour les marqueurs
const customIcon = new L.Icon({
  iconUrl: "https://unpkg.com/leaflet@1.7.1/dist/images/marker-icon.png",
  iconSize: [25, 41],
  iconAnchor: [12, 41],
});

const ClustersMap = ({setClusterLocation}) => {
  const [points, setPoints] = useState([]);

  // Fonction pour décoder et extraire les points d'un fichier GPX
  const parseGPX = (gpxBase64) => {
    try {
      const gpxString = atob(gpxBase64); // Décoder le contenu base64 en chaîne
      const parser = new DOMParser();
      const gpxDoc = parser.parseFromString(gpxString, "application/xml");
      const geoJSON = gpx(gpxDoc); // Convertir GPX en GeoJSON
      const coords = geoJSON.features.map((feature) => ({
        lat: feature.geometry.coordinates[1],
        lng: feature.geometry.coordinates[0],
        name: feature.properties.name || "Point",
      }));
      setPoints(coords);
    } catch (error) {
      console.error("Erreur lors du parsing du fichier GPX :", error);
    }
  };

  useEffect(() => {
    const API_BASE_URL = "api";
    fetch(`${API_BASE_URL}/batch/export_as_gpx`)
      .then((res) => res.json())
      .then((data) => {
        if (data.file) {
          parseGPX(data.file);
        } else {
          console.error("Fichier GPX manquant dans la réponse de l'API.");
        }
      })
      .catch((error) => {
        console.error("Erreur lors de la récupération du fichier GPX :", error);
      });
  }, []);

  const handleMarkerClick = (point) => {
    setClusterLocation(point.name)
  };

  return (
    <MapContainer
      center={[48.8566, 2.3522]} // Centrer la carte sur Paris par défaut
      zoom={2}
      style={{ height: "1000px", width: "100%" }}
    >
      <TileLayer
        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        attribution="&copy; OpenStreetMap contributors"
      />
      {points.map((point, index) => (
        <Marker
          key={index}
          position={[point.lat, point.lng]}
          icon={customIcon}
        >
          <Popup style={{width: "200px"}}>
            <Card
              hoverable
              actions={[
                    <EditOutlined key={"edit-" + point} onClick={() => handleMarkerClick(point)}/>,
                ]}>
                    <Card.Meta
                      title={point.name.split("/").at(-1)}
                      style={{textWrap: "wrap"}}
                    />
            </Card>

          </Popup>
        </Marker>
      ))}
    </MapContainer>
  );
};

export default ClustersMap;
