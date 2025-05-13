import React, { useState, useEffect } from 'react';
import { FaTrash, FaSearch, FaUsers, FaFileCode } from 'react-icons/fa';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';

const API_URL = import.meta.env.VITE_BACKEND_URL;
const AdminDashboard = () => {
  const navigate = useNavigate();
  const [selectedTab, setSelectedTab] = useState('users');
  const [searchQuery, setSearchQuery] = useState('');
  const[Loding,setLoading]= useState("true");
  const [users, setUsers] = useState([
    { id: 1, name: 'User 1', email: 'user1@test.com', role: 'user' },
    { id: 2, name: 'Admin User', email: 'admin@test.com', role: 'admin' },
  ]);
  // Mock data - Replace with API calls
  const [Files, setFiles] = useState([
    { id: 1, title: 'Sample Post', author: 'User 1', date: '2023-10-05', userId:'34' },
  ]);
  // Mock data - Replace with API calls


  useEffect(()=>{
    const fetchdata=async()=>{
    try{
       const res =await axios.get(`${API_URL}/api/files/admin/userdata`);
    setUsers(Object.values(res.data));
    }catch(e){
      console.log(e.message);
    }
  }
  fetchdata();
  },[]);


  // fatching file data

  useEffect(()=>{
    const fetchfiledata=async()=>{
      const res=await axios.get(`${API_URL}/api/files/admin/filedata`);
      const filedata=Object.values(res.data);
     
      setFiles(filedata);
    }
    fetchfiledata();
  },[]);
  
  
 


  //handle file deletion
  const handlefileDelete = async (type, id) => {
    if (!window.confirm("Are you sure you want to delete this?")) return;
  
   
      if (type === "user") {
        setUsers((prevUsers) => prevUsers.filter(user => user.id !== id));
      } else {
        console.log("Deleting File with ID:", id);
        await axios.delete(`${API_URL}/api/files/admin/${id}`);
  
        setFiles((prevFiles) => prevFiles.filter(file => file._id !== id));
      }
   
  };


//handle user delete 
 const handleuserDelete =async(type,id)=>{
  if (!window.confirm("Are you sure you want to delete this?")) return;
  
   
  console.log("Deleting user with ID:", id);
        await axios.delete(`${API_URL}/api/files/admin/user/${id}`);
  
        setUsers((prevUsers) => prevUsers.filter(user => user._id !== id));
        console.log("user deleted successful");
 }
  

 const handleLogout = () => {
  localStorage.removeItem("adminToken");
  window.location.href = "/admin/login"; 
};




  const filteredData = selectedTab === 'users'
  ? users.filter(user => 
      user.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      user.email.toLowerCase().includes(searchQuery.toLowerCase())
    )
  : Files.map(file => {
      const auth = users.find(user => user._id === file.userId);

      return {
        ...file,
        auther: auth ? auth.name : "Unknown Auther",
      };
    }).filter(file => 
      file.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      file.auther.toLowerCase().includes(searchQuery.toLowerCase())
    );


  return (
    <div className="flex min-h-screen">
      {/* Vertical Navbar */}
      <div className="w-64 bg-white border-r border-gray-200 p-4">
        <div className="mb-8">
          <h2 className="text-xl font-bold text-indigo-600">Admin Panel</h2>
        </div>
        <nav className="space-y-2">
          <button
            onClick={() => setSelectedTab('users')}
            className={`w-full flex items-center space-x-2 p-2 rounded-lg ${
              selectedTab === 'users' ? 'bg-indigo-50 text-indigo-700' : 'text-gray-600 hover:bg-gray-50'
            }`}
          >
            <FaUsers className="w-5 h-5" />
            <span>Users</span>
          </button>
          <button
            onClick={() => setSelectedTab('posts')}
            className={`w-full flex items-center space-x-2 p-2 rounded-lg ${
              selectedTab === 'posts' ? 'bg-indigo-50 text-indigo-700' : 'text-gray-600 hover:bg-gray-50'
            }`}
          >
            <FaFileCode className="w-5 h-5" />
            <span>Files</span>
          </button>
        </nav>
      </div>

      {/* Main Content */}
      <div className="flex-1 p-8 bg-gray-50">
        <div className="flex justify-between items-center mb-6">
          <div className="relative w-96">
            <FaSearch className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
            <input
              type="text"
              placeholder={`Search ${selectedTab}...`}
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-10 pr-4 py-2 rounded-lg border border-gray-300 focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500"
            />
          </div>
          <button
            onClick={handleLogout}
            className="px-4 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600 transition-colors"
          >
            Logout
          </button>
        </div>

        {/* Data Table */}
        <div className="bg-white rounded-xl shadow-sm overflow-hidden">
          <table className="w-full">
            <thead className="bg-gray-50">
              <tr>
                {selectedTab === 'users' ? (
                  <>
                    <th className="px-6 py-3 text-left text-sm font-semibold text-gray-700">Name</th>
                    <th className="px-6 py-3 text-left text-sm font-semibold text-gray-700">Email</th>
                    <th className="px-6 py-3 text-left text-sm font-semibold text-gray-700">Role</th>
                    <th className="px-6 py-3 text-left text-sm font-semibold text-gray-700">Actions</th>
                  </>
                ) : (
                  <>
                    <th className="px-6 py-3 text-left text-sm font-semibold text-gray-700">Title</th>
                    <th className="px-6 py-3 text-left text-sm font-semibold text-gray-700">Author</th>
                    <th className="px-6 py-3 text-left text-sm font-semibold text-gray-700">Date</th>
                    <th className="px-6 py-3 text-left text-sm font-semibold text-gray-700">Actions</th>
                  </>
                )}
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              {filteredData.map(item => (
               
               <tr key={item._id||item.id} className="hover:bg-gray-50">
                  {selectedTab === 'users' ? (
                    <>
                      <td className="px-6 py-4">{item.name}</td>
                      <td className="px-6 py-4">{item.email}</td>
                      <td className="px-6 py-4">
                        {item.role?(<span className="px-2 py-1 rounded-full text-xs bg-indigo-100 text-indigo-700">
                          {item.role}
                        </span>):(<span className="px-2 py-1 rounded-full text-xs bg-indigo-100 text-indigo-700">
                          User
                        </span>)}
                        
                      </td>
                      <td className="px-6 py-4">
                        <button
                          onClick={() => handleuserDelete('user', item._id)}
                          className="text-red-500 hover:text-red-700"
                        >
                          <FaTrash className="w-5 h-5" />
                        </button>
                      </td>
                    </>
                  ) : (
                    <>
                     {item.title?( <td className="px-6 py-4">{item.title.slice(0,15)}</td>):( <td className="px-6 py-4">{item.filename}</td>)} 
                    
                      <td className="px-6 py-4">{item.auther}</td>
                      <td className="px-6 py-4">{item.uploadedAt?.split("T")[0]}</td>
                      <td className="px-6 py-4">
                        <button
                          onClick={() => handlefileDelete('File', item._id)
                          }
                          className="text-red-500 hover:text-red-700"
                        >
                          <FaTrash className="w-5 h-5" />
                        </button>
                      </td>
                    </>
                  )}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default AdminDashboard;
