import React, { useState } from "react";
import { useUserStateContext } from "../context/UserContext";
import { useUser } from "@clerk/clerk-react";
import { IconProgress } from "@tabler/icons-react";

const Onboarding = () => {
  const [username, setUsername] = useState("");
  const [age, setAge] = useState("");
  const [location, setLocation] = useState("");
  const { createUser } = useUserStateContext();
  const { user } = useUser();
  const [formError, setFormError] = useState("");
  const [userError, setUserError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleOnboarding = async (e) => {
    setLoading(true);
    setFormError("");
    setUserError("");

    e.preventDefault();

    if (parseInt(age, 10) <= 0) {
      setFormError("Please enter a valid age.");
      setLoading(false);
      return;
    }

    const userData = {
      username,
      age: parseInt(age, 10),
      location,
      createdBy: user?.emailAddresses[0]?.emailAddress,
      isOnBoarded: true,
    };

    try {
      await createUser(userData);
    } catch (error) {
      setUserError(error.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="-mt-12 flex min-h-screen items-center justify-center bg-[#f5f5f5] dark:bg-[#13131a]">
      <div className="w-full max-w-md rounded-2xl bg-[#e9e9e9] p-8 shadow-lg dark:bg-[#1c1c24]">
        <h2 className="mb-2 text-center text-5xl font-bold text-[#1ec070] dark:text-[#1dc071]">
          👋
        </h2>
        <h2 className="mb-6 text-center text-2xl font-bold text-[#13131a] dark:text-white">
          Welcome! Let's get started
        </h2>

        <form onSubmit={handleOnboarding}>
          {formError && (
            <div className="mb-4 text-center text-red-600">{formError}</div>
          )}{" "}
          {userError && (
            <div className="mb-4 text-center text-red-600">{userError}</div>
          )}
          {/* Display form error message */}
          <div className="mb-4">
            <label
              htmlFor="username"
              className="mb-2 block text-sm font-medium text-[#4b5264] dark:text-gray-400"
            >
              Username
            </label>
            <input
              type="text"
              id="username"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              required
              className="w-full rounded-lg bg-[#e3e3db] px-4 py-3 text-[#13131a] focus:outline-none focus:ring-2 focus:ring-[#1ec070] dark:bg-neutral-900 dark:text-neutral-200"
            />
          </div>
          <div className="mb-4">
            <label
              htmlFor="age"
              className="mb-2 block text-sm font-medium text-[#4b5264] dark:text-gray-400"
            >
              Age
            </label>
            <input
              type="number"
              id="age"
              value={age}
              onChange={(e) => setAge(e.target.value)}
              required
              className="w-full rounded-lg bg-[#e3e3db] px-4 py-3 text-[#13131a] focus:outline-none focus:ring-2 focus:ring-[#1ec070] dark:bg-neutral-900 dark:text-neutral-200"
            />
          </div>
          <div className="mb-6">
            <label
              htmlFor="location"
              className="mb-2 block text-sm font-medium text-[#4b5264] dark:text-gray-400"
            >
              Location
            </label>
            <input
              type="text"
              id="location"
              value={location}
              onChange={(e) => setLocation(e.target.value)}
              required
              className="w-full rounded-lg bg-[#e3e3db] px-4 py-3 text-[#13131a] focus:outline-none focus:ring-2 focus:ring-[#1ec070] dark:bg-neutral-900 dark:text-neutral-200"
            />
          </div>
          <button
            type="submit"
            disabled={loading}
            className={`flex w-full items-center justify-center rounded-lg py-3 font-semibold text-white transition-colors duration-200 ${loading ? "bg-gray-300 dark:bg-gray-600" : "bg-[#1ec070] hover:bg-[#1dc071]"} focus:outline-none focus:ring-2 focus:ring-[#1dc071] dark:bg-[#1dc071] dark:hover:bg-[#1ec070]`}
          >
            {loading ? (
              <IconProgress
                size={15}
                className="h-5 w-5 animate-spin text-black dark:text-white"
              />
            ) : (
              "Submit"
            )}
            {loading && (
              <span className="ml-2 text-black dark:text-white">
                Submitting...
              </span>
            )}
          </button>
        </form>
      </div>
    </div>
  );
};

export default Onboarding;
