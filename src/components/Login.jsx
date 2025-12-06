import { useRef, useState } from "react";
import { createUserWithEmailAndPassword, updateProfile } from "firebase/auth";
import { signInWithEmailAndPassword } from "firebase/auth";
import { auth } from "../utils/firebase";
import { validateData } from "../utils/validate";
import { useDispatch } from "react-redux";
import { addUser } from "../utils/userSlice";
import { useNavigate } from "react-router-dom";

const Login = () => {
  const [isSignInForm, setIsSignInForm] = useState(true);
  const [errorMessage, setErrorMessage] = useState("");
  const email = useRef(null);
  const password = useRef(null);
  const name = useRef(null);
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const handleButtonClick = () => {
    const message = validateData(email?.current.value, password.current.value);
    setErrorMessage(message);
    if (message) return;

    if (isSignInForm) {
      signInWithEmailAndPassword(
        auth,
        email.current.value,
        password.current.value
      )
        .then(() => {
          navigate("/dashboard");
        })
        .catch(() => {
          setErrorMessage("Please enter valid credentials");
        });
    } else {
      createUserWithEmailAndPassword(
        auth,
        email.current.value,
        password.current.value
      )
        .then((userCredential) => {
          const user = userCredential.user;

          updateProfile(user, {
            displayName: name.current.value,
          })
            .then(() => {
              //  Trigger n8n welcome email workflow ON SIGNUP
              fetch(import.meta.env.VITE_N8N_URL, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                  uid: user.uid,
                  email: user.email,
                  name: name.current.value,
                }),
              });

              // Redirect to dashboard
              navigate("/dashboard");

              // Store user in Redux
              if (auth.currentUser) {
                const { uid, displayName, email, photoURL } = auth.currentUser;
                dispatch(
                  addUser({
                    uid,
                    displayName,
                    email,
                    photoURL,
                  })
                );
              }
            })
            .catch(() => {
              setErrorMessage("Please enter valid Credentials");
            });
        })
        .catch((error) => {
          const errorCode = error.code;
          const errorMessage = error.message;
          setErrorMessage(errorCode + " - " + errorMessage);
        });
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100">
      <form
        onSubmit={(e) => e.preventDefault()}
        className="w-full max-w-sm bg-white p-8 rounded-xl shadow-md border border-gray-200"
      >
        <h2 className="text-2xl font-semibold text-gray-800 mb-6 text-center">
          {isSignInForm ? "Login" : "Create Account"}
        </h2>

        {!isSignInForm && (
          <input
            ref={name}
            type="text"
            placeholder="Full Name"
            className="w-full p-3 bg-gray-100 border border-gray-300 rounded-lg mb-3 text-gray-800 focus:ring focus:ring-blue-300 outline-none"
          />
        )}

        <input
          ref={email}
          type="email"
          placeholder="Email"
          className="w-full p-3 bg-gray-100 border border-gray-300 rounded-lg mb-3 text-gray-800 focus:ring focus:ring-blue-300 outline-none"
        />

        <input
          ref={password}
          type="password"
          placeholder="Password"
          className="w-full p-3 bg-gray-100 border border-gray-300 rounded-lg mb-3 text-gray-800 focus:ring focus:ring-blue-300 outline-none"
        />

        {errorMessage && (
          <p className="text-red-500 text-sm font-medium mb-2 text-center">
            {errorMessage}
          </p>
        )}

        <button
          onClick={handleButtonClick}
          className="w-full bg-blue-600 hover:bg-blue-700 transition text-white p-3 rounded-lg font-semibold text-lg mt-2"
        >
          {isSignInForm ? "Login" : "Sign Up"}
        </button>

        <p
          className="text-gray-600 mt-4 text-center cursor-pointer hover:underline"
          onClick={() => setIsSignInForm(!isSignInForm)}
        >
          {isSignInForm
            ? "New here? Create an account"
            : "Already have an account? Login"}
        </p>
      </form>
    </div>
  );
};

export default Login;
