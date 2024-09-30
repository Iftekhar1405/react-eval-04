import React, { useContext } from "react";
import { Link } from "react-router-dom";
import { AuthContext } from "./Login"; // Make sure AuthContextType is exported

const Nav: React.FC = () => {
  const context = useContext(AuthContext);

  if (!context) {
    throw new Error("useContext must be used within an AuthContextProvider");
  }

  const { isLoggedIn } = context;

  return (
    <div style={{ display: "flex", justifyContent: "space-around" }}>
      {!isLoggedIn && (
        <>
          <Link to="/register">
            <p>Register</p>
          </Link>
          <Link to="/login">
            <p>Login</p>
          </Link>
        </>
      )}
      {isLoggedIn && (
        <>
      <Link to="/books">
        <p>Books</p>
      </Link>
      <Link to="/genre">
        <p>Genre</p>
      </Link></>)}
    </div>
  );
};

export default Nav;
