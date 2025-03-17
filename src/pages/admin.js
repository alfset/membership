import { useState, useEffect } from "react";
import axios from "axios";

export default function AdminDashboard() {
  const [stores, setStores] = useState([]);
  const [name, setName] = useState("");
  const [contractAddress, setContractAddress] = useState("");

  useEffect(() => {
    fetchStores();
  }, []);


  async function fetchStores() {
    const res = await axios.get("http://localhost:3000/api/getStore");
    setStores(res.data.stores);
  }

  async function createStore(e) {
    e.preventDefault();
    await axios.post("http://localhost:3000/api/createStore", { name, contractAddress });
    fetchStores();
  }

  return (
    <div className="p-10">
      <h1 className="text-2xl font-bold mb-4">Admin Dashboard</h1>

      <form onSubmit={createStore} className="mb-6">
        <input
          type="text"
          placeholder="Store Name"
          className="border p-2 mr-2"
          value={name}
          onChange={(e) => setName(e.target.value)}
        />
        <input
          type="text"
          placeholder="Contract Address"
          className="border p-2 mr-2"
          value={contractAddress}
          onChange={(e) => setContractAddress(e.target.value)}
        />
        <button className="bg-blue-500 text-white p-2">Create Store</button>
      </form>

      <h2 className="text-xl font-bold mb-2">Stores</h2>
      <ul>
        {stores.map((store) => (
          <li key={store._id} className="border p-2 mb-2">
            {store.name} - {store.contractAddress}
          </li>
        ))}
      </ul>
    </div>
  );
}