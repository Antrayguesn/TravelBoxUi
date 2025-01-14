import React from "react";
import ClusterCard from "./cluster_card";
import { Card } from "antd";
import "./app.css";

const ClustersView = ({currentPath, currentLevelData, setCurrentPath, onClusterCardClick}) => {

  return (
    <>
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
