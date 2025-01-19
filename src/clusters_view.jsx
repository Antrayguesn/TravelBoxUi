import React from "react";
import ClusterCard from "./cluster_card";
import { Card } from "antd";
import "./app.css";

const ClustersView = ({ currentPath, currentLevelData, setCurrentPath, onClusterCardClick }) => {
  return (
    <>
      <div id="container">
        {currentLevelData && Object.keys(currentLevelData).length > 0 ? (
          Object.entries(currentLevelData).map(([key, value]) => {
            console.log(currentPath,key, value, value.is_leaf)

            return (
              <div key={`container-${key}`} style={{ marginBottom: 16 }}>
                {/* Afficher une carte pour naviguer plus profondément dans la hiérarchie */}
                {Object.keys(value.children).length !== 0 && (
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
                { value.is_leaf && (
                  <ClusterCard
                    location={[...currentPath, key].join("/")}
                    setEditCluster={onClusterCardClick}
                  />
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
