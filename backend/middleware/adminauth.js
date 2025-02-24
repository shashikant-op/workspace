const express = require('express');
const User = require('../models/User');
const checkAdmin = (req, res, next) => {
    // Check if user is authenticated
    if (!req.user) {
      return res.status(401).json({ error: "Unauthorized: User not logged in" });
    }
  
    // Check if user is an admin
    if (req.user.role !== "admin") {
      return res.status(403).json({ error: "Forbidden: Access restricted to admins" });
    }
  
    next(); // Proceed to the next middleware or route handler
  };
  
 module.exports =checkAdmin;
  