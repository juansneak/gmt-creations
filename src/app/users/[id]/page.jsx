"use client";
import { useEffect, useState } from 'react'
import ItemDetail from "../../components/common/ItemDetail";

export default function Page({ params }) {
  
  const [ user, setUser ] = useState({});
  
  const fetchUserById = async (id) => {
    try {
      const response = await fetch (`https://jsonplaceholder.typicode.com/users/${id}`, {});
      const data = await response.json();
      setUser(data);
    } catch (error) {
      console.log(error);
    }
  }
  
  useEffect(() => {
    const fetchData = async () => {
      await fetchUserById(params.id);
    }
    fetchData();
  }, [])
  
  return (
    <div>
      <h2>User</h2>
      <ItemDetail item={user}/>
    </div>
  );
}
