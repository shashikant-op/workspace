import React, { useState } from 'react';
import axios from 'axios';
import { Button, Form, Alert } from 'react-bootstrap';

const API_URL = import.meta.env.VITE_BACKEND_URL;
const FileUpload = () => {
  const [file, setFile] = useState(null);
  const [isPublic, setIsPublic] = useState(false);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [title, setTitle] = useState(""); // ✅ Fixed: Use empty string instead of null

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!file || !title.trim()) {
      setError('File and title are required.');
      return;
    }

    const formData = new FormData();
    formData.append('file', file);
    formData.append('title', title.trim()); // ✅ Trim title to remove spaces
    formData.append('isPublic', isPublic);

    try {
      setLoading(true);
      const token = localStorage.getItem('token');
      console.log(token,"token");
      console.log(API_URL,"api url");
      console.log("formdata",formData);
      await axios.post(`${API_URL}/api/files/upload`, formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
          Authorization: `Bearer ${token}`
        }
      });
      window.location.reload(); // Refresh file list
    } catch (err) {
      setError(err.response?.data?.error || 'Upload failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="mb-4">
      <h4>Upload New File</h4>
      {error && <Alert variant="danger">{error}</Alert>}
      <Form onSubmit={handleSubmit}>
        <Form.Group className="mb-3">
          <Form.Control 
            type="file" 
            onChange={(e) => setFile(e.target.files[0])} 
            required 
          />
        </Form.Group>
        
        <Form.Group className="mb-3">
          <Form.Check 
            type="checkbox" 
            label="Make file public"
            checked={isPublic}
            onChange={(e) => setIsPublic(e.target.checked)}
          />
        </Form.Group>

        <Form.Group className="mb-3">
          <Form.Label>Title</Form.Label>
          <Form.Control 
            type="text" 
            placeholder="Enter file title"
            value={title}
            onChange={(e) => setTitle(e.target.value)} // ✅ Fixed: Used correct function
            required 
          />
        </Form.Group>

        <Button variant="primary" className="!bg-white !text-teal-600 hover:!bg-[#1e293b] hover:!text-white" type="submit" disabled={loading}>
          {loading ? 'Uploading...' : 'Upload File'}
        </Button>
      </Form>
    </div>
  );
};

export default FileUpload;
