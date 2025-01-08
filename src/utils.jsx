import React from "react"

const API_BASE_URL = "/api";

export function useFetchClusters(){
    const [clusters, setClusters] = React.useState();
    const [loading, setLoading] = React.useState(true);
    const [reload, setReload] = React.useState(true);

    
    React.useEffect(() => {
      fetch(`${API_BASE_URL}/clusters`)
        .then((response) => {
          if (!response.ok) {
            throw new Error(`HTTP error! Status: ${response.status}`);
          }
          return response.json();
        })
        .then((data) => {
          if (data && typeof data === "object") {
            setClusters(data);
            setLoading(false);
          } else {
            console.error("Les données reçues ne sont pas valides:", data);
          }
        })
        .catch((error) => {
          console.error("Erreur de récupération des clusters", error);
        });
    }, [reload]);

    return [loading, clusters, setReload];


}