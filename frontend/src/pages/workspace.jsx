import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useParams } from 'react-router-dom';
import { Card, Spinner, Alert, Form } from "react-bootstrap";
import styles from '../styles/Dashboard.module.css';
import openai from"openai";
const API_URL = import.meta.env.VITE_BACKEND_URL;
const Workspace = () => {
  const { userId } = useParams();
  const [workspaceData, setWorkspaceData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [searchTerm, setSearchTerm] = useState("");
  
  const [filteredWorkspacesData, setFilteredWorkspacesData] = useState([]);

  useEffect(() => {
    const fetchWorkspace = async () => {
      try {
        const response = await axios.get(
          `${API_URL}/api/files/workspace/${userId}`
        );
        setWorkspaceData(response.data);
        setFilteredWorkspacesData(response.data.files || []);
      } catch (err) {
        setError(err.response?.data?.error || 'Failed to load workspace');
      } finally {
        setLoading(false);
      }
    };
    fetchWorkspace();
  }, [userId]);

  if (loading) {
    return <div className="flex items-center justify-center min-h-screen text-lg">Loading...</div>;
  }

  if (error) {
    return <div className="text-center text-red-500 mt-5">{error}</div>;
  }
   // Handle search input
   const handleSearch = (e) => {
    const query = e.target.value.toLowerCase();
    setSearchTerm(query);
    

    if (query === "") {
      setFilteredWorkspacesData(workspaceData.files); // Use all files when search is empty
      console.log(workspaceData.files);
    } else {
      const filtered = workspaceData.files.filter((file) =>
        file.title?.toLowerCase().includes(query) || file.filename.toLowerCase().includes(query)
      );
      setFilteredWorkspacesData(filtered);
    }
};
  

  return (

    <div className="flex flex-col lg:flex-row ">
      
      {/* Left Sidebar (Fixed) */}
      <div className="flex pt-4  items-center justify-center lg:justify-start w-full lg:w-1/3 lg:sticky lg:top-0 lg:h-screen  align-middle">
      <div className="flex flex-col items-center lg:items-start text-center lg:text-left w-full align-middle ">
      
  <div className="w-40  h-40 mb-2 border border-yellow-500 rounded-full flex items-center justify-center mx-auto relative">
    <img className='object-fit w-40  h-40 rounded-full flex items-center justify-center mx-auto relative  ' src="https://i.ebayimg.com/images/g/HJ4AAOSwLzFcrVT7/s-l400.jpg" alt="" />
    <div className="w-10 h-10 border border-yellow-500 rounded-full bg-white absolute bottom-8 right-0 translate-x-1/4 translate-y-1/4"></div>
  </div>

          <h1 className={`${styles.title} text-xl md:text-2xl font-bold`}>
            <span className="text-teal-600">{workspaceData.user.name}'s</span> Workspace
          </h1>
          <div className="flex items-center justify-center ">

       
<span className=" cursor-pointer mr-3 ml-3 bg-teal-500 hover:bg-teal-600 p-4 justify-center lg:justify-start rounded-xl shadow-md text-white mt-4 px-4 py-2 border-r border-white last:border-none">
    <i className="bi bi-folder-symlink"></i> {workspaceData.files.length} <span className=' hidden  lg:inline ' >Post</span> 
  </span>
  <span className=" cursor-pointer mr-3 ml-3 bg-teal-500   hover:bg-teal-600 p-4 justify-center lg:justify-start rounded-xl shadow-md text-white mt-4 px-4 py-2 border-r border-white last:border-none">
    <i className="bi bi-folder-symlink"></i> {workspaceData.files.length} <span className=' hidden  lg:inline ' >Payload</span> 
  </span>
  <span className= " cursor-pointer mr-3 ml-3 bg-teal-500  hover:bg-teal-600 p-4 justify-center lg:justify-start rounded-xl shadow-md text-white mt-4 px-4 py-2 border-r border-white last:border-none">
    <i className="bi bi-folder-symlink"></i> {workspaceData.files.length} <span className=' hidden  lg:inline ' >Follower</span> 
  </span>
  </div>
  
  <div className={`${styles.searchContainer}  !mt-3 !mb-3 mx-auto w-full p-3`}>
        <Form.Control
          type="text"
          placeholder="Search workspaces by name..."
          value={searchTerm}
          onChange={handleSearch}
          className={styles.searchInput}
        />
      </div>
      </div>
    
      </div>
     

      {/* Right Content (Scrollable) */}
      <div className="w-full lg:w-2/3 overflow-y-auto p-4 bg-amber-100">
      <div className={`${styles.searchContainer}  !mt-3 !mb-3`}>
        <Form.Control
          type="text"
          placeholder="Search workspaces by name..."
          value={searchTerm}
          onChange={handleSearch}
          className={styles.searchInput}
        />
      </div>
        
              {filteredWorkspacesData.length === 0 ? (
                <div className={styles.emptyState}>
                  <div className={styles.emptyIllustration}>
                    <i className="bi bi-folder2-open"></i>
                  </div>
                  <p className={styles.emptyText}>No matching workspaces found</p>
                </div>
              ) :
              
              (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
            {filteredWorkspacesData.map((file) => (
              <div key={file._id} className="bg-white border rounded-lg shadow-md p-5 hover:shadow-lg transition">
                <div className="flex items-center justify-between">
                  <div className="text-gray-700 font-medium truncate">
                    {file.title ? file.title.slice(0, 15) : file.filename.slice(0, 4)}
                  </div>
                  <a
                    href={file.url.replace('/upload/', '/upload/fl_attachment/')}
                    download
                    className="text-blue-500 hover:text-blue-700 text-lg"
                  >
                    ⬇️
                  </a>
                </div>
                <div className="mt-2 text-sm text-gray-500 flex justify-between">
                  <span>📅 {new Date(file.uploadedAt).toLocaleDateString()}</span>
                  <span>📁 {Math.round(file.size / 1024)}KB</span>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

    </div>
  );
};

export default Workspace;
