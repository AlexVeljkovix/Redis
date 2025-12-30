const UserCard = ({ user }) => {
  return (
    <div className="bg-linear-to-br from-indigo-600 to-purple-600 p-0.5 shadow-lg">
      <div className="bg-white p-5">
        <div className="flex justify-between items-start">
          <div>
            <h3 className="text-xl font-bold text-gray-900">{user.name}</h3>
            <p className="text-gray-600">{user.email}</p>
            <p className="text-sm text-gray-500 font-mono mt-1">
              ID: {user.id}
            </p>
          </div>
          <span
            className={`px-3 py-1 rounded-full text-sm font-semibold ${
              user.role === "Admin"
                ? "bg-yellow-100 text-yellow-800"
                : "bg-blue-100 text-blue-800"
            }`}
          >
            {user.role}
          </span>
        </div>
      </div>
    </div>
  );
};

export default UserCard;
