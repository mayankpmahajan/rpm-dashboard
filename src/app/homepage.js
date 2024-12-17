'use client';
import React, { useEffect, useState } from 'react';
import Navbar from './navbar';
import CardList from './cardlist';

const HomePage = () => {
  const [data, setData] = useState({ run: [], peak: [] }); // State to hold API data
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await fetch('/api/db'); // Fetch data from your backend API
        const result = await response.json();
        console.log('API Response:', result); // Debug response
        setData(result); // Set fetched data into state
        setLoading(false);
      } catch (error) {
        console.error('Error fetching data:', error);
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  if (loading) return <p>Loading...</p>;

  return (
    <main className="bg-white overflow-hidden">
      <Navbar />

      {/* Pass dynamically fetched 'run' data to CardList */}
      <CardList runs={data.run} peaks={data.peak}/>

      
    </main>
  );
};

export default HomePage;
