import React, { useState, useEffect } from 'react';
import { axiosInstance } from '@/lib/AxiosInstance';

const Newsletter = () => {
  const [subscribers, setSubscribers] = useState([]);

  useEffect(() => {
    axiosInstance
      .get("/newsletter/subscribers")
      .then((response) => {
        setSubscribers(response.data);
      })
      .catch((error) => {
        console.error("Error fetching subscribers:", error);
      });
  }, []);

  const handleMailClick = () => {
    const emails = subscribers
      .map(subscriber => subscriber.email)
      .filter(email => !!email)
      .join(',');

    const subject = encodeURIComponent("Newsletter Update");
    const body = encodeURIComponent("Dear subscriber,\n\nHere's the latest update from our newsletter...");

    const gmailUrl = `https://mail.google.com/mail/?view=cm&fs=1&bcc=${encodeURIComponent(emails)}&su=${subject}&body=${body}`;

    window.open(gmailUrl, '_blank');
  };

  return (
    <div className="container mx-auto p-6">
      <h1 className="text-2xl font-semibold mb-4">Newsletter Subscribers</h1>
      
      <button 
        onClick={handleMailClick}
        className="mb-4 px-4 py-2 bg-blue-500 text-white font-semibold rounded-md"
      >
        Mail
      </button>
      
      <div className="overflow-x-auto shadow-lg rounded-lg">
        <table className="min-w-full bg-white">
          <thead>
            <tr className="bg-gray-100">
              <th className="px-6 py-3 text-left text-sm font-medium text-gray-700">ID</th>
              <th className="px-6 py-3 text-left text-sm font-medium text-gray-700">Email</th>
            </tr>
          </thead>
          <tbody>
            {subscribers.map((subscriber) => (
              <tr key={subscriber._id} className="border-t hover:bg-gray-50">
                <td className="px-6 py-4 text-sm text-gray-900">{subscriber._id}</td>
                <td className="px-6 py-4 text-sm text-gray-900">{subscriber.email}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default Newsletter;
