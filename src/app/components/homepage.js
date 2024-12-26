'use client';
import React, { useEffect, useState } from 'react';
import Navbar from './navbar';
import CardList from './cardlist';

const HomePage = () => {
  const [data, setData] = useState({ runs: [], peaks: [] }); // State to hold API data
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null); // State to hold any error messages

  useEffect(() => {
    const fetchData = async () => {
      try {
        // Retrieve token from localStorage
        const token = localStorage.getItem('token');
        if (!token) {
          setError('No authentication token found. Please log in again.');
          setLoading(false);
          return;
        }

        // Make API call with Authorization header
        const response = await fetch('/api/db/combined', {
          method: 'GET',
          headers: {
            'Authorization': `Bearer ${token}`, // Pass token in the Authorization header
            'Content-Type': 'application/json',
          },
        });

        if (!response.ok) {
          const errorData = await response.json();
          setError(errorData.message || 'Failed to fetch data.');
          setLoading(false);
          return;
        }

        // Parse and set data
        const result = await response.json();
        setData(result); // Set fetched data into state
      } catch (error) {
        setError('An unexpected error occurred. Please try again later.');
        console.error('Error fetching data:', error);
      } finally {
        setLoading(false); // Ensure loading state is updated
      }
    };

    fetchData();
  }, []);

  if (loading) return <p>Loading...</p>;

  if (error) return <p className="text-red-500">{error}</p>;

  return (
    <main className="bg-white overflow-hidden">
      <Navbar />

      

      {data.runs.length === 0 && data.peaks.length === 0 ? (
        <p className="text-center text-gray-500 mt-8">No runs or peaks available at the moment.</p>
      ) : (
        <>
          {data.runs.length === 0 ? (
            <p className="text-center text-gray-500 mt-8">No runs available for the current user.</p>
          ) : data.peaks.length === 0 ? (
            <CardList runs={data.runs} peaks={[]} /> // Pass only runs if peaks are empty
          ) : (
            <CardList runs={data.runs} peaks={data.peaks} /> // Both runs and peaks available, render both
          )}

          {data.peaks.length === 0 && data.runs.length === 0 && (
            <p className="text-center text-gray-500 mt-8">No runs or peaks available at the moment.</p>
          )}
        </>
      )}
    </main>
  );
};

export default HomePage;
