import React from "react";
import ClusterCard from "./cluster_card";
import { Button, Card } from "antd"; // Assurez-vous d'utiliser les composants Ant Design si ce n'est pas déjà fait
import "./app.css";

const API_BASE_URL = "/api";

const ClustersView = ({ setEditCluster_, clusters }) => {
  const [mapCluster, setMapCluster] = React.useState(null); // Correction de "cosnt" en "const"
  const [currentPath, setCurrentPath] = React.useState([]); // Pour suivre le chemin actuel dans la hiérarchie

  const findClusterInHierarchy = () => {
    for (const [key, value] of Object.entries(clusters)) {
      if (value.location == currentPath.join("/")) {
        return key; // Cluster trouvé
      }
    }
    return null; 
  };

  findClusterInHierarchy();

  // Charger la hiérarchie depuis l'API
  React.useEffect(() => {
    fetch(`${API_BASE_URL}/map_cluster`)
      .then((response) => {
        if (!response.ok) {
          throw new Error(`HTTP error! Status: ${response.status}`);
        }
        return response.json();
      })
      .then((data) => {
        if (data && typeof data === "object") {
          setMapCluster(data);
        } else {
          console.error("Les données reçues ne sont pas valides:", data);
        }
      })
      .catch((error) => {
        console.error("Erreur de récupération des clusters", error);
      });
  }, []);

  // Récupérer les données à afficher pour le niveau actuel
  const getCurrentLevelData = () => {
    if (!mapCluster) return null;

    let currentLevelData = mapCluster;
    for (const level of currentPath) {
      currentLevelData = currentLevelData[level];
      if (!currentLevelData) break;
    }
    return currentLevelData;
  };

  const currentLevelData = getCurrentLevelData();

  return (
    <div id="container">
      {currentLevelData && Object.keys(currentLevelData).length > 0 ? (
        Object.entries(currentLevelData).map(([key, value]) => {
          // Si le niveau actuel est un cluster (dernier niveau), afficher des ClusterCard
          if (typeof value === "object" && !Object.keys(value).length) {
            return (
              <ClusterCard
                key={`cluster-card-${key}`}
                cluster={{ ...value, cluster_id: key }}
                location={[...currentPath, key].join("/")}
                setEditCluster={setEditCluster_}
              />
            );
          }

          // Sinon, afficher une carte pour naviguer plus profondément dans la hiérarchie
          return (
            <Card
              key={`level-card-${key}`}
              hoverable
              style={{ width: 500, marginBottom: 16 }}
              onClick={() => {
                setCurrentPath([...currentPath, key])} // Ajouter le niveau au chemin actuel
              }
            >
              <Card.Meta
                title={key}
                description={`Explorez les sous-niveaux de ${key}`}
              />
            </Card>
          );
        })
      ) : (
        <p>Aucun cluster ou sous-niveau disponible.</p>
      )}

      {/* Bouton pour revenir au niveau précédent */}
      {currentPath.length > 0 && (
        <Button
          style={{ marginTop: 16 }}
          onClick={() => setCurrentPath(currentPath.slice(0, -1))} // Retirer le dernier niveau
        >
          Revenir au niveau précédent
        </Button>
      )}
    </div>
  );
};

export default ClustersView;
