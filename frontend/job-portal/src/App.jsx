import {
  BrowserRouter as Router,
  Routes,
  Route,
  Navigate,
} from "react-router-dom";
import { Toaster } from "react-hot-toast";
import LandingPage from "./pages/LandingPage/LandingPage";
import SignUp from "./pages/Auth/SignUp";
import Login from "./pages/Auth/Login";
import JobSeekerDashboard from "./pages/JobSeeker/JobSeekerDashboard";
import JobDetails from "./pages/JobSeeker/JobDetails";
import SavedJobs from "./pages/JobSeeker/SavedJobs";
import UserProfile from "./pages/JobSeeker/UserProfile";
import AdminDashboard from "./pages/Admin/AdminDashboard";
import JobPostingForm from "./pages/Admin/JobPostingForm";
import ManageJobs from "./pages/Admin/ManageJobs";
import ApplicationViewer from "./pages/Admin/ApplicationViewer";
import CompanyProfilePage from "./pages/Admin/CompanyProfilePage";
import ProtectedRoute from "./routes/ProtectedRoute";

function App() {
  return (
    <>
      <div>
        <Router>
          <Routes>
            <Route path="/" element={<LandingPage />} />
            <Route path="/signup" element={<SignUp />} />
            <Route path="/login" element={<Login />} />
            <Route path="/find-jobs" element={<JobSeekerDashboard />} />
            <Route path="/job/:jobid" element={<JobDetails />} />
            <Route path="/saved-jobs" element={<SavedJobs />} />
            <Route path="/user-profile" element={<UserProfile />} />

            <Route element={<ProtectedRoute requiredRole="admin" />} />
            <Route path="/admin-dashboard" element={<AdminDashboard />} />
            <Route path="/post-jobs" element={<JobPostingForm />} />
            <Route path="/manage-jobs" element={<ManageJobs />} />
            <Route path="/applicants" element={<ApplicationViewer />} />
            <Route path="/company-profile" element={<CompanyProfilePage />} />

            <Route path="*" element={<Navigate to="/" replace />} />
          </Routes>
        </Router>

        <Toaster
          toastOptions={{
            className: "",
            style: {
              fontSize: "13px",
            },
          }}
        />
      </div>
    </>
  );
}

export default App;
