import React from "react";
import "./index.css";

export default function index({ isShow, data, onCancel }) {
  const defaultImageUrl = "https://picsum.photos/200"; // Ganti dengan URL gambar default Anda

  return (
    <div className={!isShow ? "hidden" : ""} datacy="modal-delete">
      <div className="modal-bg" onClick={onCancel}></div>
      <div className="modal">
        {data && data.i && data.i.imageUrl ? (
          <img
            src={data.i.imageUrl}
            alt="sesuatu"
            onError={(e) => {
              e.target.src = defaultImageUrl;
            }}
          />
        ) : (
          <img src={defaultImageUrl} alt="Gambar Default" />
        )}
      </div>
    </div>
  );
}
