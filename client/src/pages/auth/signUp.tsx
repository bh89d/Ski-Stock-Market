import { useState } from "react";
import { registerUser } from "../../api/api";
import { Link, useNavigate } from "react-router-dom";

export function SignUp() {
  const [username, setUsername] = useState<string>();
  const [email, setEmail] = useState<string>();
  const [password, setPass] = useState<string>();
  const [confPass, setConfPass] = useState<string>();
  const [error, setError] = useState<string>("");

  const navigate = useNavigate();

  async function register() {
    try {
      if (!username || !email || !password || !confPass) {
        setError("Please provide valid details");
        throw new Error( "Please provide valid details" );
      }
      if (password !== confPass) {
        setError("Passwords doesn't match !");
        throw new Error( "Passwords dont match" )
      }

      await registerUser({ username, password, email });
      navigate("/home/signin");
    } catch (err) {
      if (err instanceof Error) {
        setError(err.message);
      } else {
        return "An Error occured , please try again later";
      }
    }
  }

  return (
    <div className="flex h-screen items-center justify-center flex-col">
      <p className = "mb-2 text-2xl font-bold"> Sign Up </p>
      <input type="textbox" placeholder="Username" className="border-2 border-gray-400 p-2 m-2 rounded-sm"
        onChange={(e) => setUsername(e.target.value)}>
      </input>
      <input type="textbox" placeholder="Email" className="border-2 border-gray-400 p-2 m-2 rounded-sm"
        onChange={(e) => setEmail(e.target.value)}>
      </input>
      <input type="password" placeholder="Password" className="border-2 border-gray-400 p-2 m-2 rounded-sm"
        onChange={(e) => setPass(e.target.value)}>
      </input>
      <input type="password" placeholder="Confirm Password" className="border-2 border-gray-400 p-2 m-2 rounded-sm"
        onChange={(e) => setConfPass(e.target.value)}>
      </input>
      <p className="text-red-500"> {error} </p>
      <div className="flex">
        <p className="pr-1"> Already an User? </p>
        <Link to="/home/signin" className="text-blue-500"> Sign in </Link>
      </div>
      <button onClick={register} className="border-2 rounded-sm pb-2 pt-2 pr-4 pl-4 mt-2 bg-emerald-400 cursor-pointer"> Sign Up </button>
    </div>
  );
}