"use client";
import { useState, useReducer } from 'react';
import List from "../components/common/List";
import { initialState, reducer } from "./reducer";
import Modal from "../components/common/Modal";

const Page = () => {
  
  const [state, dispatch] = useReducer(reducer, initialState);
  const [newUser, setNewUser] = useState({});
  const [showModal, setShowModal] = useState(false);
  
  const handleInputChange = (event) => {
    const { name, value } = event.target;
    setNewUser((prev) => ({ ...prev, [name]: value }));
  };
  
  const handleAddUser = () => {
    if (newUser.name && newUser.username && newUser.email) {
      dispatch({ type: 'ADD_USER', payload: newUser });
      setNewUser({ name: '', username: '', email: '' });
      setShowModal(false);
    } else {
      alert('Please fill out all fields');
    }
  };
  
  return (
    <section style={{ padding: '20px'}}>
      <button
        type="button"
        className="bg-blue-500 text-white font-bold py-2 px-4 rounded hover:bg-blue-700"
        onClick={() => setShowModal(true)}
        style={{ marginBottom: '20px' }}
      >
        New User
      </button>
      <List items={state.users} model="users" disableDetails={true}/>
      
      {showModal && (
        <Modal onClose={() => setShowModal(false)} title="New User">
          {['name', 'username', 'email'].map((field) => (
            <input
              key={field}
              type="text"
              name={field}
              placeholder={`Enter ${field}`}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              value={newUser[field]}
              onChange={handleInputChange}
              style={{ marginBottom: '10px' }}
            />
          ))}
          <button
            type="button"
            className="bg-blue-500 text-white font-bold py-2 px-4 rounded hover:bg-blue-700"
            onClick={handleAddUser}
          >
            Accept
          </button>
        </Modal>
      )}
    </section>
  );
}

export default Page;
