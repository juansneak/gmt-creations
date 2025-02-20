"use client";
import { useEffect, useState } from "react";
import List from "../components/common/List";

export default function Page() {
  const [albums, setAlbums] = useState([]);
  
  const fetchAlbums = async () => {
    try {
      const response = await fetch('https://jsonplaceholder.typicode.com/albums');
      const data = await response.json();
      setAlbums(data);
    } catch (error) {
      console.error("Error fetching albums:", error);
    }
  };
  
  useEffect(() => {
    const fetchData = async () => {
      await fetchAlbums();
    };
    fetchData();
  }, []);
  
  return (
    <div>
      <h1>Albums list</h1>
      <List items={albums} model="albums"/>
    </div>
  );
}
