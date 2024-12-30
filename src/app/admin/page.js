"use client";

import React, { useState, useEffect } from "react";
import { Toaster, toast } from "sonner"; // Import Toaster and toast

const Dashboard = () => {
  const [users, setUsers] = useState([]);
  const [devices, setDevices] = useState([]);
  const [accessControl, setAccessControl] = useState([]);
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    section: "users", // Default form section
    data: {},
  });

  const fetchData = async (endpoint, setter) => {
    setLoading(true);
    try {
      const res = await fetch(`/api/db/${endpoint}`);
      const data = await res.json();
      setter(data);
    } catch (error) {
      console.error(`Error fetching ${endpoint}:`, error);
      toast.error(`Failed to fetch ${endpoint}`); // Show error toast
    } finally {
      setLoading(false);
    }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      data: { ...prev.data, [name]: value },
    }));
  };

  const handleSubmit = async () => {
    const { section, data } = formData;
    const endpoint =
      section === "users"
        ? "users"
        : section === "crt_devices"
        ? "crt_devices"
        : "access_control";
    const method = data.id ? "PUT" : "POST";
    const url = data.id
      ? `/api/db/${endpoint}/${data.id}`
      : `/api/db/${endpoint}`;
  
    try {
      const res = await fetch(url, {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });
  
      if (!res.ok) {
        const errorMessage = await res.text();
        throw new Error(errorMessage || `Failed to ${method === "POST" ? "create" : "update"} ${section}`);
      }
  
      setFormData({ section, data: {} }); // Reset form
      await reloadAll(); // Refresh data
      toast.success(`${section.charAt(0).toUpperCase() + section.slice(1)} successfully ${method === "POST" ? "created" : "updated"}`); // Show success toast
    } catch (error) {
      console.error(error);
      // Provide a detailed error message based on the error thrown
      toast.error(error.message || `Failed to ${method === "POST" ? "create" : "update"} ${section}`); // Show error toast
    }
  };

  const handleDelete = async (section, item) => {
    const { user_name, crt_id } = item; // Destructure needed properties
    let endpoint;
  
    if (section === "users") {
      endpoint = `users/${user_name}`; // Use user_name for users
    } else if (section === "crt_devices") {
      endpoint = `crt_devices/${crt_id}`; // Use crt_id for crt_devices
    } else if (section === "access_control") {
      endpoint = `access_control/${crt_id}`; // Use crt_id for access_control
    } else {
      console.error("Invalid section");
      return;
    }
  
    try {
      const res = await fetch(`/api/db/${endpoint}`, { method: "DELETE" });
      if (!res.ok) throw new Error(`Failed to delete ${section}`);
      console.log(`Deleted ${section} with ID: ${crt_id || user_name}`);
      await reloadAll(); // Refresh the data
      toast.success(`${section.charAt(0).toUpperCase() + section.slice(1)} successfully deleted`); // Show success toast
    } catch (error) {
      console.error(error);
      toast.error(`Failed to delete ${section}`); // Show error toast
    }
  };

  const reloadAll = async () => {
    await Promise.all([
      fetchData("users", setUsers),
      fetchData("crt_devices", setDevices),
      fetchData("access_control", setAccessControl),
    ]);
  };

  useEffect(() => {
    reloadAll();
  }, []);

  return (
    <div className="p-6 bg-gray-100 min-h-screen">
      <Toaster position="top-right" /> {/* Add Toaster component */}
      <h1 className="text-3xl font-bold text-center mb-6">Dashboard</h1>
      {loading && <p className="text-center text-blue-600">Loading...</p>}
      {/* Section Selector */}
      <div className="flex justify-center space-x-4 mb-6">
        <button
          className={`px-4 py-2 rounded ${
            formData.section === "users"
              ? "bg-blue-500 text-white"
              : "bg-gray-200 text-gray-700"
          }`}
          onClick={() => setFormData({ section: "users", data: {} })}
        >
          Users
        </button>
        <button
          className={`px-4 py-2 rounded ${
            formData.section === "access_control"
              ? "bg-blue-500 text-white"
              : "bg-gray-200 text-gray-700"
          }`}
          onClick={() => setFormData({ section: "access_control", data: {} })}
        >
          Access Control
        </button>
      </div>

      {/* Form */}
      <form
        onSubmit={(e) => {
          e.preventDefault();
          handleSubmit();
        }}
        className="p-6 bg-white rounded shadow mb-8"
      >
        <h2 className="text-xl font-semibold mb-4">{formData.section.toUpperCase()} Form</h2>
        {formData.section === "users" && (
          <div className="grid grid-cols-2 gap-4">
            <input
              className="p-2 border rounded"
              type="text"
              name="user_name"
              placeholder="User Name"
              onChange={handleInputChange}
            />
            <input
              className="p-2 border rounded"
              type="password"
              name="password"
              placeholder="Password"
              onChange={handleInputChange}
            />
            <input
              className="p-2 border rounded"
              type="text"
              name="phone_number"
              placeholder="Phone Number"
              onChange={handleInputChange}
            />
            <input
              className="p-2 border rounded"
              type="email"
              name="email_id"
              placeholder="Email"
              onChange={handleInputChange}
            />
          </div>
        )}
        {formData.section === "crt_devices" && (
          <div className="grid grid-cols-2 gap-4">
            <input
              className="p-2 border rounded"
              type="text"
              name="train_number"
              placeholder="Train Number"
              onChange={handleInputChange}
            />
            <input
              className="p-2 border rounded"
              type="text"
              name="coach_number"
              placeholder="Coach Number"
              onChange={handleInputChange}
            />
            <input
              className="p-2 border rounded"
              type="text"
              name="railway"
              placeholder="Railway"
              onChange={handleInputChange}
            />
            <input
              className="p-2 border rounded"
              type="number"
              name="max_temp"
              placeholder="Max Temp"
              onChange={handleInputChange}
            />
            <input
              className="p-2 border rounded"
              type="number"
              name="min_temp"
              placeholder="Min Temp"
              onChange={handleInputChange}
            />
          </div>
        )}
        {formData.section === "access_control" && (
          <div className="grid grid-cols-2 gap-4">
            <input
              className="p-2 border rounded"
              type="text"
              name="user_name"
              placeholder="User Name"
              onChange={handleInputChange}
            />
            <input
              className="p-2 border rounded"
              type="text"
              name="crt_id"
              placeholder="CRT ID"
              onChange={handleInputChange}
            />
          </div>
        )}
        <button
          type="submit"
          className="mt-4 px-6 py-2 bg-blue-500 text-white rounded"
        >
          Submit
        </button>
      </form>

      {/* Tables */}
      <div className="space-y-8">
        {[ 
          { title: "Users", data: users, fields: ["user_name"] },
          { title: "Devices", data: devices, fields: ["run_no", "railway"] },
          { title: "Access Control", data: accessControl, fields: ["user_name", "crt_id"] }
        ].map(({ title, data, fields }) => (
          <div key={title}>
            <h2 className="text-xl font-semibold mb-4">{title}</h2>
            <table className="w-full bg-white rounded shadow">
              <thead>
                <tr>
                  {fields.map((field) => (
                    <th key={field} className="p-2 border">
                      {field === "run_no" ? "OMS Id" : field.replace(/_/g, " ")}
                    </th>
                  ))}
                  {title !== "Devices" && (
                    <th className="p-2 border">Actions</th>
                  )}
                </tr>
              </thead>
              <tbody>
                {data.map((item, idx) => (
                  <tr key={idx}>
                    {fields.map((field) => (
                      <td key={field} className="p-2 border">
                        {field === "run_no" ? item[field] : item[field]}
                      </td>
                    ))}
                    {title !== "Devices" && (
                      <td className="p-2 border">
                        <button
                          className="px-4 py-2 bg-red-500 text-white rounded"
                          onClick={() => handleDelete(title.toLowerCase(), item)}
                        >
                          Delete
                        </button>
                      </td>
                    )}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Dashboard;
