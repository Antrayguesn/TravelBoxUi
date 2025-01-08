import React from "react";
import ClusterCard from "./cluster_card";
import { Breadcrumb, Button, Card } from "antd";
import "./app.css";

const API_BASE_URL = "/api";

const ClustersView = ({ setEditCluster_ }) => {
  const [mapCluster, setMapCluster] = React.useState(null);
  const [currentPath, setCurrentPath] = React.useState([]); // Chemin actuel

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
    <>
      {/* Breadcrumb pour afficher le chemin actuel */}
      <Breadcrumb
        separator=">"
        items={currentPath.map((level, index) => ({
          title: (
            <span
              onClick={() => setCurrentPath(currentPath.slice(0, index + 1))}
              style={{ cursor: "pointer" }}
            >
              {level}
            </span>
          ),
        }))}
      />
      
      {/* Bouton pour revenir au niveau précédent */}
      {currentPath.length > 0 && (
        <Button
          onClick={() => setCurrentPath(currentPath.slice(0, -1))} // Retirer le dernier niveau
          style={{ marginBottom: 16 }}
        >
          Revenir au niveau précédent
        </Button>
      )}
      
      <div id="container">
        {currentLevelData && Object.keys(currentLevelData).length > 0 ? (
          Object.entries(currentLevelData).map(([key, value]) => {
            const isCluster = typeof value === "object" && !Object.keys(value).length;

            return (
              <div key={`container-${key}`} style={{ marginBottom: 16 }}>
                {/* Afficher une carte pour naviguer plus profondément dans la hiérarchie */}
                {!isCluster && (
                  <Card
                    hoverable
                    style={{ width: 500 }}
                    onClick={() => setCurrentPath([...currentPath, key])} // Ajouter le niveau au chemin actuel
                  >
                    <Card.Meta
                      title={key}
                      description={`Explorez les sous-niveaux de ${key}`}
                    />
                  </Card>
                )}

                {/* Afficher les clusters terminaux */}
                {(isCluster || value.clusters) && (
                  <>
                  <ClusterCard
                    location={[...currentPath, key].join("/")}
                    setEditCluster={setEditCluster_}
                  />
                  <br/>
                  <ClusterCard
                    location={currentPath.join("/")}
                    setEditCluster={setEditCluster_}
                  />
                  </>
                )}
              </div>
            );
          })
        ) : (
          <p>Aucun cluster ou sous-niveau disponible.</p>
        )}
      </div>
    </>
  );
};

export default ClustersView;
