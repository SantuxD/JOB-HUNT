import {
  Search,
  FileText,
  MessageSquare,
  Award,
  Users,
  BarChart3,
  Shield,
  Clock,
  Plus,
  Building2,
  Briefcase,
  LayoutDashboard,
} from "lucide-react";

export const jobSeekerFeatures = [
  {
    icon: Search,
    title: "Powerful Job Search",
    description:
      "Easily find jobs that match your skills and preferences with our advanced search filters.",
  },
  {
    icon: FileText,
    title: "Resume Builder",
    description:
      "Create a professional resume using our easy-to-use resume builder, tailored to highlight your strengths and experience.",
  },
  {
    icon: MessageSquare,
    title: "Direct Communication",
    description:
      "Communicate directly with employers and candidates through our integrated messaging system, making the hiring process smoother and more efficient.",
  },
  {
    icon: Award,
    title: "Skill Assessments",
    description:
      "Showcase your skills and stand out to employers with our skill assessment tests, designed to validate your expertise and boost your profile visibility.",
  },
];

export const AdminFeatures = [
  {
    icon: Users,
    title: "Talent Pool Access",
    description:
      "Access a vast pool of qualified candidates, allowing you to find the perfect fit for your job openings quickly and efficiently.",
  },
  {
    icon: BarChart3,
    title: "Analytics Dashboard",
    description:
      "Gain insights into user behavior, job postings, and application trends with our comprehensive analytics dashboard.",
  },
  {
    icon: Shield,
    title: "Verified Candidates",
    description:
      "Ensure the authenticity of candidates with our verification process, giving you confidence in the quality of applicants and reducing the risk of fraudulent profiles.",
  },
  {
    icon: Clock,
    title: "Quick Hiring Process",
    description:
      "Streamline your hiring process with our efficient tools and features, allowing you to fill positions faster and reduce time-to-hire.",
  },
];

export const NAVIGATION_MENU = [
  { id: "admin-dashboard", name: "Dashboard", icon: LayoutDashboard },
  { id: "manage-jobs", name: "Manage Jobs", icon: Briefcase },
  { id: "post-jobs", name: "Post Job", icon: Plus },
  { id: "company-profile", name: "Company Profile", icon: Building2 },
];

export const CATEGORIES = [
  {
    value: "Engineering",
    label: "Engineering",
  },
  {
    value: "Design",
    label: "Design",
  },
  {
    value: "Marketing",
    label: "Marketing",
  },
  {
    value: "Sales",
    label: "Sales",
  },
  {
    value: "Customer Support",
    label: "Customer Support",
  },
  {
    value: "Finance",
    label: "Finance",
  },
  { value: "IT & Software", label: "IT & Software" },
  {
    value: "Human Resources",
    label: "Human Resources",
  },
  {
    value: "Operations",
    label: "Operations",
  },
  {
    value: "Product Management",
    label: "Product Management",
  },
  {
    value: "Others",
    label: "Others",
  },
];

export const JOB_TYPES = [
  { value: "Full-time", label: "Full-time" },
  { value: "Part-time", label: "Part-time" },
  { value: "Contract", label: "Contract" },
  { value: "Internship", label: "Internship" },
  { value: "Freelance", label: "Freelance" },
  { value: "Remote", label: "Remote" },
];

export const SALARY_RANGES = [
  { value: "0-50000", label: "$0 - $50,000" },
  { value: "50000-100000", label: "$50,000 - $100,000" },
  { value: "100000-150000", label: "$100,000 - $150,000" },
  { value: "150000-200000", label: "$150,000 - $200,000" },
  { value: "200000+", label: "$200,000+" },
];
