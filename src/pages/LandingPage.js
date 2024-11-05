import React, { useState, useEffect } from "react";
import axios from "axios";

import Card from "../components/card";
import Modal from "../components/modal";

export default function LandingPage() {
  const [data, setData] = useState(null);
  const [isLoaded, setIsLoaded] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [query, setQuery] = useState("Fast");

  const [modalShow, setModalShow] = useState(false);
  const [modalItem, setModalItem] = useState(null);

  const fetchData = async (query) => {
    setIsLoading(true);
    try {
      const response = await axios.get("https://imdb8.p.rapidapi.com/auto-complete", {
        params: { q: query },
        headers: {
          "x-rapidapi-host": "imdb8.p.rapidapi.com",
          "x-rapidapi-key": "f08145865fmsha0a42b47083c13fp1f69f9jsnb9a9a78d7600",
        },
      });
      if (response.status === 200) {
        setData(response.data);
        setIsLoaded(true);
        setIsLoading(false);

        // Menyimpan hasil pencarian ke dalam cache
        if ("caches" in window) {
          caches.open("search-results").then((cache) => {
            cache.put("https://imdb8.p.rapidapi.com/auto-complete", new Response(JSON.stringify(response.data)));
          });
        }
      }
    } catch (err) {
      console.log(err);
      setIsLoading(false);
    }
  };

  useEffect(() => {
    if (!isLoaded) {
      // Coba mengambil data dari cache saat offline
      if (!navigator.onLine) {
        caches.open("search-results").then((cache) => {
          cache.match("https://imdb8.p.rapidapi.com/auto-complete").then((response) => {
            if (response) {
              response.json().then((cachedData) => {
                setData(cachedData);
              });
            }
          });
        });
      } else {
        fetchData(query);
      }
    }
  }, [isLoaded, query]);

  const onSearch = (e) => {
    if (e.key === "Enter") {
      setIsLoaded(false);
      setQuery(e.target.value);
    }
  };

  const handleClick = (item) => {
    setModalShow(true);
    setModalItem(item);
  };

  return (
    <main>
      <input
        type="text"
        placeholder="Search film by name"
        onKeyDown={(e) => onSearch(e)}
      />
      <h3 className="title">Search : {query}</h3>
      {!data || isLoading ? (
        <p>Loading...</p>
      ) : (
        <div className="card-container">
          {data.d.map((item, index) => {
            return (
              <Card data={item} key={index} onClick={() => handleClick(item)} />
            );
          })}
        </div>
      )}
      <Modal
        data={modalItem}
        isShow={modalShow}
        onCancel={() => setModalShow(false)}
      />
    </main>
  );
}
