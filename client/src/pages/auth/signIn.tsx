import { useState } from "react";
import { loginUser } from "../../api/api";
import { useNavigate } from "react-router-dom";
import { Link } from "react-router-dom";

export function SignIn() {
  const [username, setUsername] = useState<string>();
  const [password, setPass] = useState<string>();
  const [error, setError] = useState<string>("");

  const navigate = useNavigate();

  async function register() {
    try {
      if (!username || !password ) {
        setError("Please provide valid details");
        throw new Error( "Please provide valid details" );
      }

      const loggedIn = await loginUser({ username, password });
      localStorage.setItem("token", loggedIn.token);
      navigate("/home");
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
      <p className = "mb-2 text-2xl font-bold"> Sign In </p>
      <input type="textbox" placeholder="Username" className="border-2 border-gray-400 p-2 m-2 rounded-sm"
        onChange={(e) => setUsername(e.target.value)}>
      </input>
      <input type="password" placeholder="Password" className="border-2 border-gray-400 p-2 m-2 rounded-sm"
        onChange={(e) => setPass(e.target.value)}>
      </input>
      <p className="text-red-500"> {error} </p>
      <div className="flex">
        <p className="pr-1"> New user? </p>
        <Link to="/home/register" className = "text-blue-500"> Sign up </Link>
      </div>
      <button onClick={register} className="border-2 rounded-sm pb-2 pt-2 pr-4 pl-4 mt-2 bg-emerald-400 cursor-pointer"> Sign In </button>
    </div>
  );
}