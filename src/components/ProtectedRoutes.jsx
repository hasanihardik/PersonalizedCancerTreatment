import { useEffect, useState } from "react";
import { useUserStateContext } from "../context/UserContext.jsx";
import { useUser } from "@clerk/clerk-react";
import { useNavigate, useLocation } from "react-router-dom";
import LoadingSpinner from "./LoadingSpinner.jsx";
import Sidebar from "./Sidebar.jsx";
import Navbar from "./Navbar.jsx";

const ProtectedRoutes = ({ children }) => {
  const { currentUser, fetchUserByEmail, fetchUserRecords } =
    useUserStateContext();
  const { isLoaded, user } = useUser();
  const navigate = useNavigate();
  const { pathname } = useLocation();
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const initializeApp = async () => {
      if (isLoaded) {
        if (!user) {
          navigate("/sign-in");
          setLoading(false);
          return;
        }

        const email = user.emailAddresses[0]?.emailAddress;
        try {
          if (!currentUser) {
            await fetchUserByEmail(email);
          } else if (currentUser === "user-not-found") {
            navigate("/onboarding");
          } else if (!currentUser.isOnBoarded) {
            // it is not necessary usually but when we play with database the useful only
            navigate("/onboarding");
          } else if (pathname === "/onboarding") {
            navigate("/dashboard");
          }
        } catch (error) {
          console.error("Error initializing app:", error);
        } finally {
          setLoading(false);
        }
      }
    };
    initializeApp();
  }, [isLoaded, user, navigate, currentUser, pathname]);

  if (loading) {
    return <LoadingSpinner />;
  }
  return (
    <div className="relative flex min-h-screen flex-row bg-[#f5f5f5] p-4 transition-colors duration-300 dark:bg-[#13131a] dark:text-white">
      <div className="relative mr-10 hidden sm:flex">
        <Sidebar />
      </div>
      <div className="mx-auto w-full max-w-[1280px] flex-1 sm:pr-3">
        <Navbar />
        {children}
      </div>
    </div>
  );
};

export default ProtectedRoutes;
