import React, { useEffect, useState } from "react";
import axios from "axios";
import { Link } from "react-router-dom";
import { Card, Spinner, Alert, Form } from "react-bootstrap";
import styles from "../styles/Home.module.css"; // Ensure this CSS module exists

const Home = () => {
  const [workspaces, setWorkspaces] = useState([]);
  const [filteredWorkspaces, setFilteredWorkspaces] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchTerm, setSearchTerm] = useState("");

  const groupByUser = (files) => {
    return files.reduce((acc, file) => {
      if (!file.userId) {
        console.warn("Skipping file due to missing userId:", file);
        return acc; // Skip this file
      }

      const userId = file.userId._id;
      if (!acc[userId]) {
        acc[userId] = {
          user: file.userId,
          fileCount: 0,
        };
      }
      acc[userId].fileCount++;
      return acc;
    }, {});
  };

  useEffect(() => {
    const fetchWorkspaces = async () => {
      try {
        const res = await axios.get("http://localhost:5000/api/files/public");
        const grouped = groupByUser(res.data);
        const workspacesArray = Object.values(grouped);

        setWorkspaces(workspacesArray);
        setFilteredWorkspaces(workspacesArray); // Initialize filtered list
      } catch (err) {
        console.error("Error fetching workspaces:", err);
        setError(err.response?.data?.error || "Failed to load workspaces");
      } finally {
        setLoading(false);
      }
    };

    fetchWorkspaces();
  }, []);

  // Handle search input
  const handleSearch = (e) => {
    const query = e.target.value.toLowerCase();
    setSearchTerm(query);

    if (query === "") {
      setFilteredWorkspaces(workspaces);
    } else {
      const filtered = workspaces.filter((workspace) =>
        workspace.user.name.toLowerCase().includes(query)
      );
      setFilteredWorkspaces(filtered);
    }
  };

  if (loading) {
    return <div className="text-center my-5">Loading workspaces...</div>;
  }

  if (error) {
    return (
      <div className="alert alert-danger mx-auto mt-4" style={{ maxWidth: "600px" }}>
        {error}
      </div>
    );
  }

  return (
    <div className={styles.container}>
      <h1 className={styles.heading}>
        <span className={styles.highlight}>Public</span> Workspaces
      </h1>

      {/* Search Input */}
      <div className={styles.searchContainer}>
        <Form.Control
          type="text"
          placeholder="Search workspaces by name..."
          value={searchTerm}
          onChange={handleSearch}
          className={styles.searchInput}
        />
      </div>

      {filteredWorkspaces.length === 0 ? (
        <div className={styles.emptyState}>
          <div className={styles.emptyIllustration}>
            <i className="bi bi-folder2-open"></i>
          </div>
          <p className={styles.emptyText}>No matching workspaces found</p>
        </div>
      ) : (
        <div className={styles.grid}>
          {filteredWorkspaces.map((workspace) => (
            <Card key={workspace.user._id} className={styles.workspaceCard}>
              <Card.Body>
                <div className={styles.cardHeader}>
                  <div className={styles.avatar}>
                    {workspace.user.name[0].toUpperCase()}
                  </div>
                  <div>
                    <Card.Title className={styles.workspaceName}>
                      {workspace.user.name}'s Work
                      <span className="text-teal-600">space</span>
                    </Card.Title>
                    <div className={styles.fileCount}>
                      <i className="bi bi-file-earmark"></i>
                      {workspace.fileCount} public files
                    </div>
                  </div>
                </div>
                <div className={styles.cardFooter}>
                  <Link
                    to={`/workspace/${workspace.user._id}`}
                    className={styles.viewButton}
                  >
                    Explore Files
                    <i className="bi bi-arrow-right-short"></i>
                  </Link>
                </div>
              </Card.Body>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
};

export default Home;
