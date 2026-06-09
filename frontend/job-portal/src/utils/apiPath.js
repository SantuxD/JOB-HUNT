// export const BASE_URL = "http://localhost:8000";

export const API_PATHS = {
  AUTH: {
    LOGIN:"/api/auth/login",
    REGISTER: "/api/auth/register",
    GET_PROFILE: "/api/auth/getMe",
    UPDATE_PROFILE: "/api/user/profile",
    DELETE_RESUME: "/api/user/resume",
  },

  DASHBOARD: {
    OVERVIEW: "/api/analytics/overview",
  },

  JOBS: {
    GET_ALL_JOBS: "/api/jobs/get-jobs",
    GET_JOB_BY_ID: (id) => `/api/jobs/${id}`,
    POST_JOB: "/api/jobs/create-jobs",
    GET_JOBS_ADMIN: "/api/jobs/get-jobs-admin",
    UPDATE_JOB: (id) => `/api/jobs/${id}`,
    TOGGLE_CLOSE_JOB: (id) => `/api/jobs/${id}/toggle-close`,
    DELETE_JOB: (id) => `/api/jobs/${id}`,
    SAVE_JOB: (id) => `/api/saved-jobs/${id}`,
    UNSAVE_JOB: (id) => `/api/saved-jobs/${id}`,
    GET_SAVED_JOBS: "/api/saved-jobs/my",
  },

  APPLICATIONS: {
    APPLY_TO_JOB: (id) => `/api/application/${id}`,
    GET_ALL_APPLICATIONS: (id) => `/api/application/job/${id}`,
    UPDATE_STATUS: (id) => `/api/application/update-status/${id}`,
  },

  IMAGE: {
    UPLOAD: "/api/v1/upload-image",
  },
};
