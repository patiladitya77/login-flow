import { onAuthStateChanged, signOut } from "firebase/auth";
import React, { useEffect } from "react";
import { auth } from "../utils/firebase";
import { useDispatch, useSelector } from "react-redux";
import { addUser, removeUser } from "../utils/userSlice";
import { useNavigate } from "react-router-dom";

const Dashboard = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const user = useSelector((store) => store.user);
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      if (user) {
        const { uid, displayName, email, photoURL } = user;

        dispatch(addUser({ uid, displayName, email, photoURL }));
        navigate("/dashboard");
      } else {
        dispatch(removeUser());
        navigate("/");
      }
    });

    return () => unsubscribe();
  }, []);
  const handleLogout = () => {
    signOut(auth)
      .then(() => {
        dispatch(removeUser());
        navigate("/");
      })
      .catch((err) => console.log(err));
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100">
      <div className="w-full max-w-md bg-white p-8 rounded-xl shadow-md border border-gray-200 text-center">
        <h1 className="text-2xl font-semibold text-gray-800 mb-4">
          Welcome, {user?.displayName}
        </h1>

        <button
          onClick={handleLogout}
          className="bg-blue-600 text-white px-6 py-2 rounded-lg text-lg font-medium hover:bg-blue-700 transition"
        >
          Logout
        </button>
      </div>
    </div>
  );
};

export default Dashboard;
