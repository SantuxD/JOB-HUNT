import { use, useEffect, useState } from "react"
import DashboardLayout from "../../components/layout/DashboardLayout"
import { AlertCircle, Briefcase, DollarSign, Eye, MapPin, Send, Users } from "lucide-react"
import { API_PATHS } from "../../utils/apiPath"
import { useLocation, useNavigate } from "react-router-dom"


const JobPostingForm = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const jobid = location.state?.jobid || null;
  const [formData, setFormData] = useState({
    jobTitle: "",
    location: "",
    category: "",
    jobType: "",
    description: "",
    requirements: "",
    salaryMin: "",
    salaryMax: "",
  })
  const [errors, setErrors] = useState(false)
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isPreview, setIsPreview] = useState(false);

  const handleInputChange = (field, value) => { };
  const handleSubmit = async (e) => {
    e.preventDefault();
  }
  const validateFrom = (formData) => {
    const errors = {}
    return errors;
  } 
  const isFormValid = () => {
    const validationErrors = validateFrom(formData);
    return Object.keys(validationErrors).length === 0;
  }
  return (
    <DashboardLayout activeMenu='post-job'>JobPostingForm</DashboardLayout>
  )
}

export default JobPostingForm