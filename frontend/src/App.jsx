import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";
import { AuthProvider } from "./context/AuthContext";
import { ThemeProvider } from "./context/ThemeContext";
import ProtectedRoute from "./components/ProtectedRoute";
import AdminProtectedRoute from "./components/AdminProtectedRoute";
import GoogleMapsLoader from "./components/GoogleMapsLoader";
import Login from "./pages/Login";
import Home from "./pages/Home";
import Search from "./pages/Search";
import MyTrips from "./pages/MyTrips";
import Review from "./pages/Review";
import RidePool from "./pages/RidePool";
import Payments from "./pages/Payments";
import Profile from "./pages/Profile";
import EditProfile from "./pages/EditProfile";
import Settings from "./pages/Settings";
import DriverDashboard from "./pages/DriverDashboard";
import PostRide from "./pages/PostRide";
import RideRequest from "./pages/RideRequest";
import InRide from "./pages/InRide";
import DriverRides from "./pages/DriverRides";
import DriverEarnings from "./pages/DriverEarnings";
import DriverProfile from "./pages/DriverProfile";
import DriverSettings from "./pages/DriverSettings";
import DriverEditProfile from "./pages/DriverEditProfile";
import AdminLogin from "./pages/AdminLogin";
import AdminDashboard from "./pages/AdminDashboard";
import AdminDrivers from "./pages/AdminDrivers";
import AdminUsers from "./pages/AdminUsers";
import AdminDisputes from "./pages/AdminDisputes";
import AdminDisputeDetail from "./pages/AdminDisputeDetail";
import AdminSettings from "./pages/AdminSettings";

export default function App() {
  return (
    <GoogleMapsLoader>
      <ThemeProvider>
        <AuthProvider>
          <Router>
            <Routes>
            <Route path="/login" element={<Login />} />
            <Route
              path="/home"
              element={
                <ProtectedRoute>
                  <Home />
                </ProtectedRoute>
              }
            />
            <Route
              path="/search"
              element={
                <ProtectedRoute>
                  <Search />
                </ProtectedRoute>
              }
            />
            <Route
              path="/trips"
              element={
                <ProtectedRoute>
                  <MyTrips />
                </ProtectedRoute>
              }
            />
            <Route
              path="/review"
              element={
                <ProtectedRoute>
                  <Review />
                </ProtectedRoute>
              }
            />
            <Route
              path="/ride-pool"
              element={
                <ProtectedRoute>
                  <RidePool />
                </ProtectedRoute>
              }
            />
            <Route
              path="/payments"
              element={
                <ProtectedRoute>
                  <Payments />
                </ProtectedRoute>
              }
            />
            <Route
              path="/profile"
              element={
                <ProtectedRoute>
                  <Profile />
                </ProtectedRoute>
              }
            />
            <Route
              path="/profile/edit"
              element={
                <ProtectedRoute>
                  <EditProfile />
                </ProtectedRoute>
              }
            />
            <Route
              path="/settings"
              element={
                <ProtectedRoute>
                  <Settings />
                </ProtectedRoute>
              }
            />
            <Route
              path="/driver/dashboard"
              element={
                <ProtectedRoute>
                  <DriverDashboard />
                </ProtectedRoute>
              }
            />
            <Route
              path="/driver/post-ride"
              element={
                <ProtectedRoute>
                  <PostRide />
                </ProtectedRoute>
              }
            />
            <Route
              path="/driver/ride-request/:id"
              element={
                <ProtectedRoute>
                  <RideRequest />
                </ProtectedRoute>
              }
            />
            <Route
              path="/driver/in-ride/:id"
              element={
                <ProtectedRoute>
                  <InRide />
                </ProtectedRoute>
              }
            />
            <Route
              path="/driver/rides"
              element={
                <ProtectedRoute>
                  <DriverRides />
                </ProtectedRoute>
              }
            />
            <Route
              path="/driver/earnings"
              element={
                <ProtectedRoute>
                  <DriverEarnings />
                </ProtectedRoute>
              }
            />
            <Route
              path="/driver/profile"
              element={
                <ProtectedRoute>
                  <DriverProfile />
                </ProtectedRoute>
              }
            />
            <Route
              path="/driver/settings"
              element={
                <ProtectedRoute>
                  <DriverSettings />
                </ProtectedRoute>
              }
            />
            <Route
              path="/driver/profile/edit"
              element={
                <ProtectedRoute>
                  <DriverEditProfile />
                </ProtectedRoute>
              }
            />
            {/* Admin Routes */}
            <Route path="/admin/login" element={<AdminLogin />} />
            <Route path="/admin" element={<Navigate to="/admin/dashboard" />} />
            <Route
              path="/admin/dashboard"
              element={
                <AdminProtectedRoute>
                  <AdminDashboard />
                </AdminProtectedRoute>
              }
            />
            <Route
              path="/admin/drivers"
              element={
                <AdminProtectedRoute>
                  <AdminDrivers />
                </AdminProtectedRoute>
              }
            />
            <Route
              path="/admin/users"
              element={
                <AdminProtectedRoute>
                  <AdminUsers />
                </AdminProtectedRoute>
              }
            />
            <Route
              path="/admin/disputes"
              element={
                <AdminProtectedRoute>
                  <AdminDisputes />
                </AdminProtectedRoute>
              }
            />
            <Route
              path="/admin/disputes/:id"
              element={
                <AdminProtectedRoute>
                  <AdminDisputeDetail />
                </AdminProtectedRoute>
              }
            />
            <Route
              path="/admin/settings"
              element={
                <AdminProtectedRoute>
                  <AdminSettings />
                </AdminProtectedRoute>
              }
            />
            <Route path="/" element={<Navigate to="/login" />} />
          </Routes>
        </Router>
      </AuthProvider>
    </ThemeProvider>
    </GoogleMapsLoader>
  );
}
