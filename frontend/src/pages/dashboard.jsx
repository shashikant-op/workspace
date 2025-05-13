import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { Link } from 'react-router-dom';
import FileUpload from '../components/fileupload';
import styles from '../styles/Dashboard.module.css';
import { Card, ListGroup, Button, Alert } from 'react-bootstrap';
import {Form} from "react-bootstrap";

const Dashboard = () => {
  const [files, setFiles] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [searchTerm,setSearchTerm]=useState('');
  const [filteredfile,setfilteredfile]=useState([]);

  const fetchFiles = async () => {
    try {
      const token = localStorage.getItem('token');
      const response = await axios.get('http://localhost:5000/api/files/my-files', {
        headers: { Authorization: `Bearer ${token}` },
      });
      setFiles(response.data);
      setfilteredfile(response.data);
      setError('');
    } catch (err) {
      setError(err.response?.data?.error || 'Failed to load files');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchFiles();
  }, []);

  const handleDelete = async (fileId) => {
    if (!window.confirm('Are you sure you want to delete this file?')) return;

    try {
      const token = localStorage.getItem('token');
      await axios.delete(`http://localhost:5000/api/files/${fileId}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setFiles(files.filter((file) => file._id !== fileId));
    } catch (err) {
      setError(err.response?.data?.error || 'Failed to delete file');
    }
  };
    const handleSearch = (e) => {
      const query = e.target.value.toLowerCase();
      setSearchTerm(query);
    
      if (query === "") {
        setfilteredfile(files);
      } else {
        const filtered = files.filter(
          (file) =>
            (file.title && file.title.toLowerCase().includes(query)) || 
            file.filename.toLowerCase().includes(query)
        );
        setfilteredfile(filtered);
      }
    };

  const handleVisibilityToggle = async (fileId, isPublic) => {
    try {
      const token = localStorage.getItem('token');
      await axios.put(
        `http://localhost:5000/api/files/${fileId}/visibility`,
        { isPublic: !isPublic },
        { headers: { Authorization: `Bearer ${token}` } }
      );

      setFiles(
        files.map((file) =>
          file._id === fileId ? { ...file, isPublic: !isPublic } : file
        )
      );
    } catch (err) {
      setError(err.response?.data?.error || 'Failed to update file visibility');
    }
  };

  if (loading) {
    return (
      <div className="text-center mt-5 ">
        <div className="spinner-border" role="status">
          <span className="visually-hidden">Loading...</span>
        </div>
      </div>
    );
  }

  return (
    <div className={styles.dashboardContainer}>
      <div className={styles.header}>
        {/* left box */}
        <div>
        <h1 className={styles.title}><span className='!text-teal-600'>Your</span> Workspace</h1>
        <div className="bg-teal-600 p-2  flex items-center justify-evenly rounded-xl shadow-md text-white">
        <span className='border-r-1 mr-3 pr-3'>
            <i className="bi bi-folder-symlink"></i> {files.length} Post
          </span>
          <span className='border-r-1 mr-3 pr-3'>
            <i className="bi bi-folder-symlink"></i> {files.length} Project
          </span>
          <span className='border-r-1 mr-3 pr-3'>
            <i className="bi bi-folder-symlink"></i> {files.length} Payload
          </span>
          <span className=' mr-3 pr-3'>
            <i className="bi bi-folder-symlink"></i> {files.length} Follower
          </span>
         
        </div>
        <div className={`${styles.searchContainer}  !mt-3 !mb-3 mx-auto w-full p-3`}>
        <Form.Control
          type="text"
          placeholder="Search file by name..."
          value={searchTerm}
          onChange={handleSearch}
          className={styles.searchInput}
        />
      </div>
        </div>
        
       
        <div className="bg-teal-600 p-12  rounded-xl shadow-md text-white">
         
          <FileUpload onUploadSuccess={fetchFiles} />
        </div>
      </div>

      {error && <Alert variant="danger" className={styles.alert}>{error}</Alert>}

      {filteredfile.length === 0 ? (
        <div className={styles.emptyState}>
          <div className={styles.emptyIllustration}>
            <i className="bi bi-upload"></i>
          </div>
          <h3 className={styles.emptyTitle}>Your Digital Library Awaits</h3>
          <p className={styles.emptyText}>Upload your first file to get started</p>
          <FileUpload onUploadSuccess={fetchFiles} variant="primary" />
        </div>
      ) : (
        <Card >
          <ListGroup variant="flush" className='flex-row  p-2 overflow-hidden !justify-center flex-wrap items-center '>
            {filteredfile.map((file) => (
              <ListGroup.Item key={file._id} className="bg-white border p-6 rounded-lg shadow-md transition-transform duration-200 ease-in-out hover:shadow-lg hover:-translate-y-0.5 mr-8 mb-8">
                <div className= 'gap-1' >
                  <div className=' flex pt-0.5 pb-0.5 items-center justify-between  rounded-lg '>
                  <i className={`bi ${file.isPublic ? 'bi-globe ml-3 text-orange-600' : 'bi-lock text-orange-600 ml-3'} ${styles.statusIcon}`}></i>
                  <span className=' text-gray-500 text-sm '>
                        <i className="bi bi-calendar hover:text-orange-600"></i> {new Date(file.uploadedAt).toLocaleDateString()}
                      </span>
                  </div>
                  
                  <div className=' mt-5 '>
                  <span className="text-teal-900">
                      {file.title ? file.title.slice(0, 20) + (file.title.length > 10 ? '...' : '') : file.filename}</span>
                    <div className="flex justify-between text-gray-500 text-sm mt-2">
                      <span className={styles.fileSize}>
                        <i className="bi bi-hdd"></i> {Math.round(file.size / 1024)}KB
                      </span>
                    </div>
                  </div>
                </div>
                <div className='flex gap-0.5 mt-3'>
                  <Button
                    variant="link"
                    className="px-4 py-2 rounded-lg border hover:!bg-teal-600 hover:!text-white border-gray-300 bg-white text-indigo-600 cursor-pointer transition-all duration-200 ease-in-out"

                    onClick={() => handleVisibilityToggle(file._id, file.isPublic)}
                  >
                    {file.isPublic ? <i className="bi bi-eye fs-5"></i> : <i className="bi bi-eye-slash fs-5"></i>}
                  </Button>
                  <Button
                    variant="link"
                    className="px-4 py-2 rounded-lg hover:!bg-teal-600 hover:!text-white border border-gray-300 bg-white text-indigo-600 cursor-pointer transition-all duration-200 ease-in-out"

                    href={`http://localhost:5000/uploads/${file.filename}`}
                    download
                  >
                    <i className="bi bi-download fs-5"></i>
                  </Button>
                  <Button
                    variant="link"
                    className="px-4 py-2 rounded-lg hover:!bg-orange-600 hover:!text-white border border-gray-300 bg-white text-indigo-600 cursor-pointer transition-all duration-200 ease-in-out"
                    onClick={() => handleDelete(file._id)}
                  >
                    <i className="bi bi-trash fs-5"></i>
                  </Button>
                </div>
              </ListGroup.Item>
            ))}
          </ListGroup>
        </Card>
      )}
    </div>
  );
};

export default Dashboard;
