import React from "react";
import "./index.css";

export default function Card({ data, onClick }) {
  const defaultImageUrl = "https://picsum.photos/200"; // Ganti dengan URL gambar default Anda

  return (
    <div className="card" onClick={onClick}>
      {data && data.i && data.i.imageUrl ? (
        <>
          <figure>
            <img
              src={data.i.imageUrl}
              alt={data.l}
              onError={(e) => {
                e.target.src = defaultImageUrl;
              }}
            />
          </figure>
          <div className="card-info">
            <h3>{data.l}</h3>
            <p>{data.q}</p>
          </div>
        </>
      ) : (
        <p>Loading...</p>
      )}
    </div>
  );
}
