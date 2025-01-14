import React from "react";
import { Breadcrumb, Button, Card } from "antd";
import "./app.css";
import ClustersView from "./clusters_view";
import ClusterView from "./cluster_view";
import { Space, Switch } from 'antd';
import ClustersMap from "./clusters_map";

const API_BASE_URL = "/api";

const ClustersManager = () => {
  const [mapCluster, setMapCluster] = React.useState(null);
  const [currentPath, setCurrentPath] = React.useState([]); // Chemin actuel
  const [reload, setReload] = React.useState([]);
  const [clusterLocationToEdit, setClusterLocationToEdit] = React.useState();
  const [clusterEdit, setClusterEdit] = React.useState();
  const [showMap, setShowMap] = React.useState(true);

  const SWITCH_VALUE = {true: "Map", false: "List"}

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
  }, [reload]);

  React.useEffect(() => {
    if (clusterLocationToEdit === undefined) {
      setClusterEdit(undefined)
      return 
    }
    const utf8Bytes = new TextEncoder().encode(clusterLocationToEdit);

    fetch(`${API_BASE_URL}/get_cluster_by_location/${btoa(String.fromCharCode(...utf8Bytes))}`)
      .then((response) => {
        if (!response.ok) {
          throw new Error(`HTTP error! Status: ${response.status}`);
        }
        return response.json();
      })
      .then((data) => {
        if (data && typeof data === "object") {
          setClusterEdit(data)
        } else {
          console.error("Les données reçues ne sont pas valides:", data);
        }
      })
      .catch((error) => {
        console.error("Erreur de récupération des clusters", error);
      });
  }, [clusterLocationToEdit]);

  const updateCluster = (data) => {
    
      const updatedCluster = { 
        continent: data.continent,
        country: data.country,
        region: data.region,
        place: data.place
      };

      const apiURL = window.location + "api/cluster/" + data.cluster_id

      fetch(apiURL, {
          method: 'UPDATE',
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
        setReload(Date.now());
      })
      .catch(error => {
        console.error('Erreur:', error);
        alert('Une erreur est survenue lors de la sauvegarde des modifications.');
      });

  };

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
  const handleChangePath = (path) => {
    setClusterLocationToEdit(undefined);
    setCurrentPath(path);
  }

  const generateSpanBreadcrumb = () => {
    // Génère les spans pour chaque niveau du chemin
    const map = currentPath.map((level, index) => ({
      key: `level-${index}`,
      title: (
        <span
          onClick={() => handleChangePath(currentPath.slice(0, index + 1))}
          style={{ cursor: "pointer" }}
        >
          {level}
        </span>
      ),
    }));

    // Span pour "Monde"
    const mondeSpan = {
      key: "monde",
      title: (
        <span
          onClick={() => handleChangePath([])}
          style={{ cursor: "pointer" }}
        >
          Monde
        </span>
      ),
    };

    // Combine le span Monde et les autres niveaux
    return [mondeSpan, ...map];
  };
  

  return (
    <>
      {!clusterEdit && 
      <Switch
        checkedChildren={SWITCH_VALUE[true]}
        unCheckedChildren={SWITCH_VALUE[false]}
        defaultChecked={true}
        onChange={(checked, e) => {
          setShowMap(checked); 
          setReload(Date.now());
        }}/>
      }

      {/* Breadcrumb pour afficher le chemin actuel */}
      <Breadcrumb
        separator=">"
        items={generateSpanBreadcrumb()}
      />
      {!clusterEdit ?  
        showMap ? <ClustersMap setClusterLocation={setClusterLocationToEdit}/> : 
        <ClustersView currentPath={currentPath} currentLevelData={currentLevelData} setCurrentPath={setCurrentPath} onClusterCardClick={setClusterLocationToEdit}/>
        : <ClusterView cluster={clusterEdit} setClusterLocation={setClusterLocationToEdit} updateCluster={updateCluster}/>
      
    }

      
    </>
  );
};

export default ClustersManager;
