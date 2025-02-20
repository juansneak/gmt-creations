"use client";
import { useEffect, useState } from 'react'
import ItemDetail from "../../components/common/ItemDetail";

export default function Page({ params }) {
  
  const [ album, setAlbum ] = useState({});
  
  const fetchAlbumById = async (id) => {
    try {
      const response = await fetch (`https://jsonplaceholder.typicode.com/albums/${id}`, {});
      const data = await response.json();
      setAlbum(data);
    } catch (error) {
      console.log(error);
    }
  }
  
  useEffect(() => {
    const fetchData = async () => {
      await fetchAlbumById(params.id);
    }
    fetchData();
  }, [])
  
  return (
    <div>
      <h2>Album</h2>
      <ItemDetail item={album}/>
    </div>
  );
}
