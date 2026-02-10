import {
  Route,
  BrowserRouter as Router,
  Routes,
  Navigate,
} from "react-router-dom";
import CreateMatch from "../pages/CreateMatch";
import Home from "../pages/Home";
import NoRouteFound from "../pages/NoRouteFound";
import Sidebar from "../components/Sidebar";
import CreatePlayer from "../pages/CreatePlayer";
import CreateVenue from "../pages/CreateVenue";
import LiveMatch from "../pages/LiveMatch";
import Login from "../pages/Login";
import ProtectedRoute from "../components/ProtectedRoute";
import { AuthProvider, useAuth } from "../context/AuthContext";
import UserManagement from "../pages/UserManagement";
import Articles from "../pages/Articles";
import EditArticle from "../pages/EditArticle";
import AdsManager from "../pages/AdsManager";

const AppContent = () => {
  const { user } = useAuth();

  return (
    <div className="app flex flex-col lg:flex-row min-h-screen bg-zinc-50">
      {user && <Sidebar />}
      <div
        className={`main-content flex-1 ${user ? "pt-16 lg:pt-0" : ""} overflow-x-hidden`}
      >
        <Routes>
          <Route path="/login" element={<Login />} />
          <Route
            path="/"
            element={
              <ProtectedRoute>
                <Home />
              </ProtectedRoute>
            }
          />
          <Route
            path="/match/live/:id"
            element={
              <ProtectedRoute>
                <LiveMatch />
              </ProtectedRoute>
            }
          />
          <Route
            path="/create-match"
            element={
              <ProtectedRoute>
                <CreateMatch />
              </ProtectedRoute>
            }
          />
          <Route
            path="/create-player"
            element={
              <ProtectedRoute>
                <CreatePlayer />
              </ProtectedRoute>
            }
          />
          <Route
            path="/create-venue"
            element={
              <ProtectedRoute>
                <CreateVenue />
              </ProtectedRoute>
            }
          />
          <Route
            path="/users"
            element={
              <ProtectedRoute>
                <UserManagement />
              </ProtectedRoute>
            }
          />
          <Route
            path="/articles"
            element={
              <ProtectedRoute>
                <Articles />
              </ProtectedRoute>
            }
          />
          <Route
            path="/articles/create"
            element={
              <ProtectedRoute>
                <EditArticle />
              </ProtectedRoute>
            }
          />
          <Route
            path="/articles/edit/:id"
            element={
              <ProtectedRoute>
                <EditArticle />
              </ProtectedRoute>
            }
          />
          <Route path="*" element={<NoRouteFound />} />
        </Routes>
      </div>
    </div>
  );
};

const MainRouter = () => (
  <Router>
    <AuthProvider>
      <AppContent />
    </AuthProvider>
  </Router>
);

export default MainRouter;
