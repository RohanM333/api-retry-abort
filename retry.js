import React, { useEffect, useState } from 'react';
import axios from 'axios';
import axiosRetry from 'axios-retry';

const App = () => {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    // Create an Axios instance
    const api = axios.create({
      baseURL: 'https://jsonplaceholder.typicode.com'
    });

    // Configure retry logic
    axiosRetry(api, {
      retries: 3, // Number of retry attempts
      retryDelay: (retryCount) => {
        console.log(`Retry attempt: ${retryCount}`);
        return retryCount * 1000; // Exponential back-off
      },
      retryCondition: (error) => {
        // Retry on network errors or 5xx responses
        return axiosRetry.isNetworkError(error) || axiosRetry.isRetryableError(error);
      }
    });

    const fetchData = async () => {
      try {
        setLoading(true);
        const response = await api.get('/posts/1');
        setData(response.data);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  if (loading) {
    return <div>Loading...</div>;
  }

  if (error) {
    return <div>Error: {error}</div>;
  }

  return (
    <div>
      <h1>Fetched Data</h1>
      <pre>{JSON.stringify(data, null, 2)}</pre>
    </div>
  );
};

export default App;
