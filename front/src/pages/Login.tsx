import React from "react";
import { useHistory } from "react-router-dom";
import { COLORS } from "../constants/colors";

const Login = () => {
  const history = useHistory();
  function login() {
    history.push("/dashboard");
  }

  return (
    <div className="flex justify-center items-center h-full">
      <div className="w-full max-w-sm">
        <form className="bg-white shadow-md rounded px-8 pt-6 pb-8 mb-4">
          <div className="mb-4">
            <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="username">
              Identifiant
            </label>
            <input
              className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
              id="username"
              type="text"
              placeholder="Identifiant"
            />
          </div>
          <div className="mb-6">
            <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="password">
              Mot de passe
            </label>
            <input
              className="shadow appearance-none border border-error-500 rounded w-full py-2 px-3 text-gray-700 mb-3 leading-tight focus:outline-none focus:shadow-outline"
              id="password"
              type="password"
              placeholder="******************"
            />
          </div>
          <div className="flex items-center justify-between">
            <button
              className="bg-info-500 hover:bg-info-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline"
              type="button"
              onClick={login}
            >
              Se connecter
            </button>
            <a className="inline-block align-baseline font-bold text-sm text-info-500 hover:text-info-800" href="#">
              Mot de passe oublié ?
            </a>
          </div>
        </form>
        <p className="text-center text-gray-500 text-xs">&copy;2020 Acme Corp. All rights reserved.</p>
      </div>
    </div>
  );
};

export default Login;
