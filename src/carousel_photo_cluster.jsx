import React, { useState } from "react";
import { Card, Carousel, Modal } from "antd";
import { DeleteOutlined, EditOutlined, PushpinOutlined } from "@ant-design/icons";
import "./app.css";

const CarouselPhotoCluster = ({ photos, deletePhoto }) => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedPhoto, setSelectedPhoto] = useState(null);
  const [showPhotoLocation, setShowPhotoLocation] = useState(null);

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

  const handleImageClick = (photo) => {
    setSelectedPhoto(photo);
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setSelectedPhoto(null);
  };

  return (
    <>
      <Carousel arrows infinite={true} slidesToShow={3} swipeToSlide>
        {Object.entries(photos).map(([id_photo, photo]) => (
          <div key={id_photo} className="photo-container">
            <Card
              className="carousel-card"
              cover={
                <div
                  className="image-container"
                  onClick={() => handleImageClick(photo)}
                >
                  <img
                    className="carousel-image"
                    src={"api/" + photo.path}
                    alt={`Photo ${id_photo}`}
                  />
                </div>
              }
              actions={[
                    <EditOutlined key="edit" />,
                    <PushpinOutlined
                      onClick={() => {
                        if (photo.coord !== null) {
                          setShowPhotoLocation(photo);
                        }
                      }}
                      style={{
                        color: photo.coord === null ? "gray" : "blue",
                        cursor: photo.coord === null ? "not-allowed" : "pointer",
                      }}
                      key="location"
                    />,
                    <DeleteOutlined
                      style={{color:"red"}}
                      key="delete"
                      onClick={() => deletePhoto(photo)}
                      />
                  ]}
            />
          </div>
        ))}
      </Carousel>

      {selectedPhoto && (
        <Modal
          open={isModalOpen}
          footer={null}
          onCancel={handleCloseModal}
          centered
          className="fullscreen-modal"
        >
          <img
            src={"api/" + selectedPhoto.path}
            alt="Enlarged"
            className="modal-image" // Utilise la classe CSS ici
          />
        </Modal>
      )}

      {showPhotoLocation && (
        <Modal
          open={showPhotoLocation}
          footer={null}
          onCancel={() => setShowPhotoLocation(undefined)}
          centered
          className="fullscreen-modal"
        >
          { buildOpenStreetMapUrl(showPhotoLocation.coord) }
        </Modal>
      )}
    </>
  );
};

export default CarouselPhotoCluster;
