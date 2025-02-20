"use client";

import { useState } from "react";

export default function Page() {
  const [newAlbum, setNewAlbum] = useState({ title: '' });
  
  const handleClick = async (event) => {
    event.preventDefault();
    try {
      await fetch('https://jsonplaceholder.typicode.com/albums', {
        method: 'POST',
        headers: {},
        body: JSON.stringify(newAlbum)
      });
      console.log('Album created!');
    } catch (error) {
      console.error("Error creating album:", error);
    }
  }
  
  const handleInputChange = (event) => {
    setNewAlbum({ ...newAlbum, [event.target.name]: event.target.value });
    console.log(newAlbum);
  }
  
  return (
    <div>
      <h1>Create New Album</h1>
      <form action="">
        <label>Title</label>
        <input type="text" name="title" id="title" onChange={(event) => handleInputChange(event)}/>
        <button type="submit" onClick={(event) => handleClick(event)}>Accept</button>
      </form>
    </div>
  );
}
