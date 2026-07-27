import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { Toaster } from "sonner";
import { AuthProvider, useAuth } from "./context/AuthContext";
import ProtectedRoute from "./components/ProtectedRoute";
import DashboardLayout from "./components/dashboard/DashboardLayout";
import Login from "./pages/Login";
import Register from "./pages/Register";
import PatientDashboard from "./pages/patient/PatientDashboard";
import DoctorDashboard from "./pages/doctor/DoctorDashboard";
import DoctorProfile from "./pages/doctor/DoctorProfile";
import DoctorAppointments from "./pages/doctor/DoctorAppointments";
import AdminDashboard from "./pages/admin/AdminDashboard";
import ManageDoctors from "./pages/admin/ManageDoctors";
import ManageUsers from "./pages/admin/ManageUsers";
import ManageAppointments from "./pages/admin/ManageAppointments";
import Doctors from "./pages/doctors/Doctors";
import DoctorDetails from "./pages/doctors/DoctorDetails";
import MyAppointments from "./pages/appointments/MyAppointments";
import BookAppointment from "./pages/appointments/BookAppointment";

const DashboardRedirect = () => { const { user } = useAuth(); return <Navigate replace to={user?.role === "doctor" ? "/doctor/dashboard" : user?.role === "admin" ? "/admin/dashboard" : "/patient/dashboard"} />; };
const App = () => <AuthProvider><Toaster position="top-right" richColors closeButton /><BrowserRouter><Routes>
  <Route path="/" element={<Navigate to="/login" replace />} />
  <Route path="/login" element={<Login />} />
  <Route path="/register" element={<Register />} />
  <Route element={<ProtectedRoute />}><Route element={<DashboardLayout />}>
    <Route path="/dashboard" element={<DashboardRedirect />} />
    <Route element={<ProtectedRoute allowedRoles={["patient"]} />}>
      <Route path="/patient/dashboard" element={<PatientDashboard />} />
      <Route path="/appointments" element={<MyAppointments />} />
      <Route path="/appointments/book/:doctorId" element={<BookAppointment />} />
      <Route path="/doctors" element={<Doctors />} />
      <Route path="/doctors/:id" element={<DoctorDetails />} />
    </Route>
    <Route element={<ProtectedRoute allowedRoles={["doctor"]} />}>
      <Route path="/doctor/dashboard" element={<DoctorDashboard />} />
      <Route path="/doctor/profile" element={<DoctorProfile />} />
      <Route path="/doctor/appointments" element={<DoctorAppointments />} />
    </Route>
    <Route element={<ProtectedRoute allowedRoles={["admin"]} />}>
      <Route path="/admin/dashboard" element={<AdminDashboard />} />
      <Route path="/admin/doctors" element={<ManageDoctors />} />
      <Route path="/admin/users" element={<ManageUsers />} />
      <Route path="/admin/appointments" element={<ManageAppointments />} />
    </Route>
  </Route></Route>
  <Route path="*" element={<Navigate to="/login" replace />} />
</Routes></BrowserRouter></AuthProvider>;
export default App;
