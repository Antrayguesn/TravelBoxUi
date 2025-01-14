import React, { useState } from "react";
import { Card } from "antd";
import "./app.css";

const { Meta } = Card;

const ClusterCard = ({ setEditCluster, location }) => {

  return (
    location ? <Card
      hoverable
      style={{ width: 500 }}
      onClick={() => setEditCluster(location)}
    >
      <Meta title={location.split("/").at(-1)} description={location || "Localisation inconnue"} />
    </Card> : undefined
  );
};

export default ClusterCard;
