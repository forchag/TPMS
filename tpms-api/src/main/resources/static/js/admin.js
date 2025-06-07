// API service for TPMS application

class APIService {
  constructor() {
    this.baseURL = "http://localhost:8080/api"
    this.token = this.getToken()
  }

  getToken() {
    return localStorage.getItem("authToken") || sessionStorage.getItem("authToken")
  }

  setToken(token) {
    this.token = token
  }

  getHeaders() {
    const headers = {
      "Content-Type": "application/json",
    }

    if (this.token) {
      headers["Authorization"] = `Bearer ${this.token}`
    }

    return headers
  }

  async request(endpoint, options = {}) {
    const url = `${this.baseURL}${endpoint}`
    const config = {
      headers: this.getHeaders(),
      ...options,
    }

    try {
      const response = await fetch(url, config)

      // Handle unauthorized responses
      if (response.status === 401) {
        this.handleUnauthorized()
        throw new Error("Unauthorized")
      }

      // Handle other error responses
      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}))
        throw new Error(errorData.message || `HTTP ${response.status}`)
      }

      // Handle empty responses (like DELETE requests)
      if (response.status === 204) {
        return null
      }

      // Handle JSON responses
      const contentType = response.headers.get("content-type")
      if (contentType && contentType.includes("application/json")) {
        return await response.json()
      }

      return await response.text()
    } catch (error) {
      console.error(`API Error (${endpoint}):`, error)
      throw error
    }
  }

  handleUnauthorized() {
    // Only clear auth data and redirect if we're not already on login page
    if (window.location.pathname !== "/login.html" && window.location.pathname !== "/") {
      localStorage.removeItem("authToken")
      sessionStorage.removeItem("authToken")
      localStorage.removeItem("currentUser")
      sessionStorage.removeItem("currentUser")

      window.location.href = "/login.html"
    }
  }

  // Authentication endpoints
  async login(credentials) {
    return this.request("/auth/login", {
      method: "POST",
      body: JSON.stringify(credentials),
    })
  }

  async signup(userData) {
    return this.request("/auth/signup", {
      method: "POST",
      body: JSON.stringify(userData),
    })
  }

  async checkUsername(username) {
    return this.request(`/auth/check-username?username=${encodeURIComponent(username)}`)
  }

  async checkEmail(email) {
    return this.request(`/auth/check-email?email=${encodeURIComponent(email)}`)
  }

  // Student endpoints
  async getStudentProfile(studentId) {
    return this.request(`/profile/${encodeURIComponent(studentId)}`)
  }

  async updateStudentProfile(studentId, profileData) {
    return this.request(`/profile/${encodeURIComponent(studentId)}`, {
      method: "PUT",
      body: JSON.stringify(profileData),
    })
  }

  async getStudentApplications() {
    return this.request("/applications/student")
  }

  async getStudentInterviews() {
    return this.request("/interviews/student")
  }

  async getStudentEnrollments() {
    return this.request("/enrollments/student")
  }

  async enrollInTraining(trainingId) {
    return this.request("/enrollments", {
      method: "POST",
      body: JSON.stringify({ trainingId }),
    })
  }

  async dropTraining(enrollmentId) {
    return this.request(`/enrollments/${enrollmentId}`, {
      method: "DELETE",
    })
  }

  async applyForJob(jobId) {
    return this.request("/applications", {
      method: "POST",
      body: JSON.stringify({ jobId }),
    })
  }

  // Trainer endpoints
  async getTrainerProfile() {
    return this.request("/trainers/profile")
  }

  async updateTrainerProfile(profileData) {
    return this.request("/trainers/profile", {
      method: "PUT",
      body: JSON.stringify(profileData),
    })
  }

  async getTrainerTrainings() {
    return this.request("/trainings/trainer")
  }

  async createTraining(trainingData) {
    return this.request("/trainings", {
      method: "POST",
      body: JSON.stringify(trainingData),
    })
  }

  async updateTraining(trainingId, trainingData) {
    return this.request(`/trainings/${trainingId}`, {
      method: "PUT",
      body: JSON.stringify(trainingData),
    })
  }

  async deleteTraining(trainingId) {
    return this.request(`/trainings/${trainingId}`, {
      method: "DELETE",
    })
  }

  // Recruiter endpoints
  async getRecruiterProfile() {
    return this.request("/recruiters/profile")
  }

  async updateRecruiterProfile(profileData) {
    return this.request("/recruiters/profile", {
      method: "PUT",
      body: JSON.stringify(profileData),
    })
  }

  async getRecruiterJobs() {
    return this.request("/jobs/recruiter")
  }

  async createJob(jobData) {
    return this.request("/jobs", {
      method: "POST",
      body: JSON.stringify(jobData),
    })
  }

  async updateJob(jobId, jobData) {
    return this.request(`/jobs/${jobId}`, {
      method: "PUT",
      body: JSON.stringify(jobData),
    })
  }

  async deleteJob(jobId) {
    return this.request(`/jobs/${jobId}`, {
      method: "DELETE",
    })
  }

  async getJobApplications(jobId) {
    return this.request(`/jobs/${jobId}/applications`)
  }

  // General endpoints
  async getAllJobs() {
    return this.request("/jobs")
  }

  async getAllTrainings() {
    return this.request("/trainings")
  }

  async getJob(jobId) {
    return this.request(`/jobs/${jobId}`)
  }

  async getTraining(trainingId) {
    return this.request(`/trainings/${trainingId}`)
  }

  // Admin endpoints
  async getAllStudents() {
    return this.request("/students")
  }

  async getAllTrainers() {
    return this.request("/trainers")
  }

  async getAllRecruiters() {
    return this.request("/recruiters")
  }

  async getAllApplications() {
    return this.request("/applications")
  }

  async getAllInterviews() {
    return this.request("/interviews")
  }

  async getAllEnrollments() {
    return this.request("/enrollments")
  }

  async getReportSummary() {
    return this.request("/reporting/summary")
  }

  async exportData(type) {
    return this.request(`/reporting/export/${type}`)
  }

  // Search endpoints
  async searchStudents(query) {
    return this.request(`/search/students?q=${encodeURIComponent(query)}`)
  }

  async searchJobs(query) {
    return this.request(`/search/jobs?q=${encodeURIComponent(query)}`)
  }

  async searchTrainings(query) {
    return this.request(`/search/trainings?q=${encodeURIComponent(query)}`)
  }

  // Profile endpoints
  async getCurrentUserProfile() {
    return this.request("/profile")
  }

  async updateCurrentUserProfile(profileData) {
    return this.request("/profile", {
      method: "PUT",
      body: JSON.stringify(profileData),
    })
  }

  async changePassword(passwordData) {
    return this.request("/profile/change-password", {
      method: "POST",
      body: JSON.stringify(passwordData),
    })
  }
}

// Create global API instance
window.api = new APIService()
