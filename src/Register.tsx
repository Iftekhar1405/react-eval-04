import { useContext, useState, FormEvent } from "react";
import { AuthContext } from "./Login"; 
import { useNavigate } from "react-router-dom";

// Define the structure of a user
interface User {
  email: string;
  password: string;
}

const Register: React.FC = () => {
  const { users, setUsers } = useContext(AuthContext) as {
    users: User[];
    setUsers: React.Dispatch<React.SetStateAction<User[]>>;
  };
  
  const [email, setEmail] = useState<string>('');
  const [password, setPassword] = useState<string>('');
  const [confirmPassword, setConfirmPassword] = useState<string>('');
  const [error, setError] = useState<string | null>(null); 
  const [success, setSuccess] = useState<string | null>(null);
  const navigate = useNavigate();

  const handleRegister = (event: FormEvent) => {
    event.preventDefault();
    setError(null); 
    setSuccess(null); 

    const existingUser = users.find((user) => user.email === email);

    if (existingUser) {
      setError('This email is already registered.');
    } else if (password !== confirmPassword) {
      setError('Passwords do not match.');
    } else {
      setUsers([...users, { email, password }]);
      setSuccess('Registration successful! You can now log in.');
      alert(`Registration successful! ${email} You can now log in.`);
      navigate('/login');

      setEmail('');
      setPassword('');
      setConfirmPassword('');
    }
  };

  return (
    <div>
      <h2>Register</h2>
      <form onSubmit={handleRegister}>
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
        <input
          type="password"
          value={confirmPassword}
          onChange={(event) => setConfirmPassword(event.target.value)}
          placeholder="Confirm Password"
          required
        />
        <button type="submit">Register</button>
      </form>

      {error && <p style={{ color: 'red' }}>{error}</p>} 
      {success && <p style={{ color: 'green' }}>{success}</p>} 
    </div>
  );
};

export default Register;
