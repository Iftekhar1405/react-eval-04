import React, { createContext, useContext, useState, ReactNode, FormEvent } from "react";
import { useNavigate } from "react-router-dom";

// Define the User type
interface User {
  email: string;
  password: string;
}

// Define the AuthContextType
interface AuthContextType {
  users: User[];
  setUsers: React.Dispatch<React.SetStateAction<User[]>>;
  isLoggedIn: boolean;
  setIsLoggedIn: React.Dispatch<React.SetStateAction<boolean>>;
}

// Create the context with the AuthContextType or undefined
const AuthContext = createContext<AuthContextType | undefined>(undefined);

// Define props for the provider
interface AuthContextProviderProps {
  children: ReactNode;
}

// AuthContextProvider component with type annotations
const AuthContextProvider: React.FC<AuthContextProviderProps> = ({ children }) => {
  const [users, setUsers] = useState<User[]>([
    { email: "iftekhar@gmail.com", password: "password" },
    { email: "khushi@gmail.com", password: "1234word" },
    { email: "amaan@gmail.com", password: "7890word" },
  ]);

  const [isLoggedIn, setIsLoggedIn] = useState<boolean>(false);

  return (
    <AuthContext.Provider value={{ users, setUsers, isLoggedIn, setIsLoggedIn }}>
      {children}
    </AuthContext.Provider>
  );
};

const Login: React.FC = () => {
  const context = useContext(AuthContext);
  
  if (!context) {
    throw new Error("useContext must be used within an AuthContextProvider");
  }

  const { users, setIsLoggedIn, isLoggedIn } = context;

  const [email, setEmail] = useState<string>("");
  const [password, setPassword] = useState<string>("");
  const [error, setError] = useState<string | null>(null); 
  const navigate = useNavigate();

  const handleSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    const existingUser = users.find(
      (user) => user.email === email && user.password === password
    );

    if (existingUser) {
      alert("Login successful!");
      setIsLoggedIn(!isLoggedIn);
      navigate("/");

      setError(null);
    } else {
      setError("Invalid email or password");
    }

    setEmail("");
    setPassword("");
  };

  return (
    <form onSubmit={handleSubmit}>
      <input
        type="email"
        value={email}
        onChange={(event) => setEmail(event.target.value)}
        placeholder="Email"
        required
      />
      <input
        type="password"
        value={password}
        onChange={(event) => setPassword(event.target.value)}
        placeholder="Password"
        required
      />
      <button type="submit">Login</button>

      {error && <p style={{ color: "red" }}>{error}</p>} 
    </form>
  );
};

export { AuthContextProvider, AuthContext, Login };
