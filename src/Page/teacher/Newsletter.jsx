import React, { useState, useEffect } from 'react';
import { axiosInstance } from '@/lib/AxiosInstance';
import BackButton from '@/CustomComponent/BackButton';

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

  const downloadCSV = () => {
    // Extract the email addresses
    const emails = subscribers
      .map(subscriber => subscriber.email)
      .filter(email => !!email);

    // Prepare the CSV content
    const csvContent = "data:text/csv;charset=utf-8," 
      + "Email\n"  // Add a header for the CSV file
      + emails.map(email => `${email}`).join("\n");

    // Create a download link
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement("a");
    link.setAttribute("href", encodedUri);
    link.setAttribute("download", "subscribers.csv");
    document.body.appendChild(link);

    // Trigger the download
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div className="container mx-auto p-6">
      <BackButton label="Go Back" className="mb-4" />

      <h1 className="text-2xl font-semibold mb-4">Newsletter Subscribers</h1>
      
      <button 
        onClick={downloadCSV}
        className="mb-4 px-4 py-2 bg-green-500 hover:bg-green-600 text-white font-semibold rounded-md"
      >
        Download Emails as CSV
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
