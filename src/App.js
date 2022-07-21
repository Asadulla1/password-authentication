import logo from "./logo.svg";
import "./App.css";
import { useState } from "react";
import initializeAuthentication from "./Firebase/firebase.init";
import {
  getAuth,
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  updateProfile,
} from "firebase/auth";

function App() {
  initializeAuthentication();
  const auth = getAuth();
  const [newUser, setNewUser] = useState(false);
  const [user, setUser] = useState({
    isSignedIn: false,
    name: "",
    email: "",
    password: "",
    photo: "",
    error: "",
    success: false,
  });

  const handleBlur = (e) => {
    let isFormValid = true;
    if (e.target.name === "email") {
      isFormValid = /\S+@\S+\.\S+/.test(e.target.value);
    }
    if (e.target.name === "password") {
      const isPasswordValid = e.target.value.length > 6;
      const isPasswordHasNumber = /\d{1}/.test(e.target.value);
      isFormValid = isPasswordValid && isPasswordHasNumber;
    }
    if (isFormValid) {
      const newUserInfo = { ...user };
      newUserInfo[e.target.name] = e.target.value;
      setUser(newUserInfo);
    }
  };
  const handleSubmit = (e) => {
    console.log(user.email, user.password);
    if (newUser && user.email && user.password) {
      createUserWithEmailAndPassword(auth, user.email, user.password)
        .then((userCredential) => {
          // Signed in
          const user = userCredential.user;
          const newUserInfo = { ...user };
          newUserInfo.error = " ";
          newUserInfo.success = true;
          setUser(newUserInfo);
          updateUserName(newUserInfo.name);
        })
        .catch((error) => {
          const newUserInfo = { ...user };
          newUserInfo.error = error.message;
          newUserInfo.success = false;
          setUser(newUserInfo);
          // console.log(errorCode, errorMessage);
          // ..
        });
    }
    if (!newUser && user.email && user.password) {
      signInWithEmailAndPassword(auth, user.email, user.password)
        .then((userCredential) => {
          // Signed in
          const user = userCredential.user;
          const newUserInfo = { ...user };
          newUserInfo.error = " ";
          newUserInfo.success = true;
          setUser(newUserInfo);
          console.log("signed in user info:", userCredential.user);
          // ...
        })
        .catch((error) => {
          const newUserInfo = { ...user };
          newUserInfo.error = error.message;
          newUserInfo.success = false;
          setUser(newUserInfo);
        });
    }
    e.preventDefault();

    const updateUserName = (name) => {
      updateProfile(auth.currentUser, {
        displayName: name,
      })
        .then(() => {
          // Profile updated!
          // ...
        })
        .catch((error) => {
          // An error occurred
          // ...
        });
    };
  };
  return (
    <div className="App">
      <h1>Our Own Authentication</h1>
      <input
        type="checkbox"
        name="newUser"
        onChange={() => setNewUser(!newUser)}
        id=""
      />
      <label htmlFor="newUser">New User Sign Up</label>
      <form action="" onSubmit={handleSubmit}>
        {newUser && <input type="text" placeholder="Write your Name" />} <br />
        <input
          type="text"
          name="email"
          placeholder="Write your Email Address"
          required
          onBlur={handleBlur}
        />
        <br />
        <input
          type="password"
          name="password"
          id=""
          placeholder="Write your Password"
          onBlur={handleBlur}
        />{" "}
        <br />
        <input type="submit" value="Submit" />
        <br />
        <p style={{ color: "red" }}>{user.error}</p>
        {user.success && (
          <p style={{ color: "green" }}>
            User {newUser ? "Created" : "Logged In"} Successfully{" "}
          </p>
        )}
      </form>
    </div>
  );
}

export default App;
