import React, { useEffect, useState } from "react";
import { getAllUsers } from "../api/userApi";
import { useAuth } from "../context/AuthContext";
import { Navigate } from "react-router-dom";
import UserCard from "../components/User/UserCard";

const UsersPage = () => {
  const { isAdmin } = useAuth();
  const [users, setUsers] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const data = await getAllUsers();
        setUsers(data);
      } catch (err) {
        setError(err.message);
      } finally {
        setIsLoading(false);
      }
    };

    if (isAdmin()) {
      fetchUsers();
    }
  }, [isAdmin]);

  if (!isAdmin()) {
    return <Navigate to="/events" replace />;
  }

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-slate-100">
        <p className="text-gray-500 text-lg">Loading users...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-slate-100">
        <p className="text-red-500 text-lg">Error: {error}</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-100 p-8">
      <div className="max-w-5xl mx-auto">
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-4xl font-bold text-gray-900">All Users</h1>
          <span className="bg-gray-200 text-gray-700 px-4 py-2 rounded-full font-semibold">
            Total: {users.length}
          </span>
        </div>

        <div className="space-y-4">
          {users.map((user) => (
            <UserCard key={user.id} user={user} />
          ))}
        </div>
      </div>
    </div>
  );
};

export default UsersPage;
