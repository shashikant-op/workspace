import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useParams, Link } from 'react-router-dom';
import { Card, Spinner, Alert, Button } from 'react-bootstrap'; // Removed duplicate imports
import styles from '../styles/Workspace.module.css';
import style from '../styles/Dashboard.module.css';

const Workspace = () => {
  const { userId } = useParams();
  const [workspaceData, setWorkspaceData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchWorkspace = async () => {
      console.log(userId);
      try {
        const response = await axios.get(
          `http://localhost:5000/api/files/workspace/${userId}`
        );
        setWorkspaceData(response.data);
      } catch (err) {
        setError(err.response?.data?.error || 'Failed to load workspace -----');
      } finally {
        setLoading(false);
      }
    };
    fetchWorkspace();
  }, [userId]);

  if (loading) {
    return (
      <div className="text-center mt-5">
        <Spinner animation="border" />
      </div>
    );
  }

  if (error) {
    return (
      <Alert variant="danger" className="mt-4 mx-auto" style={{ maxWidth: '600px' }}>
        {error}
      </Alert>
    );
  }

  return (
    <div className={styles.workspaceContainer}>
      <div className={styles.header}>
        <div className={styles.userInfo}>
          <div className={styles.avatar}>
            {workspaceData?.user?.name[0]?.toUpperCase() || 'A'}
          </div>
          <div>
            <h1 className={styles.userName}>
              {workspaceData?.user?.name}'s Public Workspace
            </h1>
            <p className={styles.fileCount}>
              <i className="bi bi-files"></i>
              {workspaceData?.files?.length || 0} publicly shared files
            </p>
          </div>
        </div>
        <Button 
          as={Link} 
          to="/" 
          variant="outline-primary" 
          className={styles.backButton}
        >
          <i className="bi bi-arrow-left"></i> All Workspaces
        </Button>
      </div>

      {error && <Alert variant="danger" className={styles.alert}>{error}</Alert>}

      {workspaceData?.files?.length === 0 ? (
        <div className={styles.emptyState}>
          <div className={styles.emptyIllustration}>
            <i className="bi bi-folder-x"></i>
          </div>
          <h3>This workspace is empty</h3>
          <p>No public files available yet</p>
        </div>
      ) : (
        <Card className={styles.fileGrid}>
          {workspaceData?.files?.map((file) => (
            <div key={file._id} className='"bg-white border p-6 rounded-lg shadow-md transition-transform duration-200 ease-in-out hover:shadow-lg hover:-translate-y-0.5 mr-8 mb-8'>
              <div className={styles.fileHeader}>
                <i className={`bi bi-filetype-${getFileIcon(file.filename)} ${styles.fileIcon}`}></i>
                <div className={styles.fileActions}>
                  <Button 
                    variant="link" 
                    className={styles.downloadButton}
                    href={`http://localhost:5000/uploads/${file.filename}`} 
                    download
                  >
                    <i className="bi bi-download"></i>
                  </Button>
                </div>
              </div>
              <div className={styles.fileBody}>
                {file.title?(<h6 className={styles.fileName}>{file.title.slice(0,15)}</h6>):(<h6 className={styles.fileName}>{file.filename.slice(0,4)}</h6>)}
                
                <div className={styles.fileMeta}>
                  <span className={styles.fileDate}>
                    <i className="bi bi-calendar"></i>
                    {new Date(file.uploadedAt).toLocaleDateString()}
                  </span>
                  <span className={styles.fileSize}>
                    <i className="bi bi-hdd"></i>
                    {Math.round(file.size / 1024)}KB
                  </span>
                </div>
              </div>
            </div>
          ))}
        </Card>
      )}
    </div>
  );
};

// Helper function for file icons
const getFileIcon = (filename) => {
  const ext = filename.split('.').pop().toLowerCase();
  const icons = {
    pdf: 'pdf',
    doc: 'word',
    docx: 'word',
    xls: 'excel',
    xlsx: 'excel',
    ppt: 'ppt',
    pptx: 'ppt',
    jpg: 'image',
    jpeg: 'image',
    png: 'image',
    txt: 'text',
    zip: 'archive',
    mp3: 'music',
    mp4: 'video'
  };
  return icons[ext] || 'file';
};

export default Workspace;
