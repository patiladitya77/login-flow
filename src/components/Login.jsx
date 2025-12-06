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
      //signin logic

      signInWithEmailAndPassword(
        auth,
        email.current.value,
        password.current.value
      )
        .then(() => {
          // Signed in
          navigate("/dashboard");
        })
        .catch(() => {
          // const errorCode = error.code;
          // const errorMessage = error.message;
          setErrorMessage("Please enter valid credentials");
        });
    } else {
      //signup logic

      createUserWithEmailAndPassword(
        auth,
        email.current.value,
        password.current.value
      )
        .then((userCredential) => {
          // Signed up
          const user = userCredential.user;
          updateProfile(user, {
            displayName: name.current.value,
          })
            .then(() => {
              navigate("/dashboard");
              if (auth.currentUser) {
                const { uid, displayName, email, photoURL } = auth.currentUser;
                dispatch(
                  addUser({
                    uid: uid,
                    displayName: displayName,
                    email: email,
                    photoURL: photoURL,
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

        {/* Full Name (Only for Sign Up) */}
        {!isSignInForm && (
          <input
            ref={name}
            type="text"
            placeholder="Full Name"
            className="w-full p-3 bg-gray-100 border border-gray-300 rounded-lg mb-3 text-gray-800 focus:ring focus:ring-blue-300 outline-none"
          />
        )}

        {/* Email */}
        <input
          ref={email}
          type="email"
          placeholder="Email"
          className="w-full p-3 bg-gray-100 border border-gray-300 rounded-lg mb-3 text-gray-800 focus:ring focus:ring-blue-300 outline-none"
        />

        {/* Password */}
        <input
          ref={password}
          type="password"
          placeholder="Password"
          className="w-full p-3 bg-gray-100 border border-gray-300 rounded-lg mb-3 text-gray-800 focus:ring focus:ring-blue-300 outline-none"
        />

        {/* Error Message */}
        {errorMessage && (
          <p className="text-red-500 text-sm font-medium mb-2 text-center">
            {errorMessage}
          </p>
        )}

        {/* Button */}
        <button
          onClick={handleButtonClick}
          className="w-full bg-blue-600 hover:bg-blue-700 transition text-white p-3 rounded-lg font-semibold text-lg mt-2"
        >
          {isSignInForm ? "Login" : "Sign Up"}
        </button>

        {/* Bottom Toggle */}
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
