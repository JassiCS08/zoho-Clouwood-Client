import React, { useState } from "react";
import MD5 from "crypto-js/md5";

const Passcode = ({ children }) => {
  const [password, setPassword] = useState("");
  const [showContent, setShowContent] = useState(false);

  const handlePasswordSubmit = (e) => {
    e.preventDefault();

    const storedPassword = "Clouwood@00$";
    const enteredPasswordHash = MD5(password.trim()).toString();
    const storedPasswordHash = MD5(storedPassword.trim()).toString();

    if (enteredPasswordHash === storedPasswordHash) {
      setShowContent(true);
    } else {
      alert("Incorrect password. Please try again.");
    }
  };

  return (
    <>
      {!showContent && (
        <div className="flex justify-center items-center h-screen bg-[#f5f5f5">
          <div className="flex justify-center items-center flex-col w-full p-4">
            <h2 className="mb-4">Password Required:</h2>
            <form
              onSubmit={handlePasswordSubmit}
              className="flex flex-col justify-center items-center "
            >
              <input
                type="password"
                id="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="mb-2 p-2 w-80 border border-gray-300 rounded"
                required
                autoComplete="off"
              />
              <button
                type="button"
                onClick={handlePasswordSubmit}
                className="bg-blue-500 text-white p-2 rounded w-20"
              >
                Submit
              </button>
            </form>
          </div>
        </div>
      )}

      {showContent && <> {children}</>}
    </>
  );
};

export default Passcode;
