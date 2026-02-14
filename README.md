# JobSift - Modern Recruitment Platform 🚀

**JobSift** is a dynamic MERN Stack Job Portal designed to streamline the recruitment process. It offers specialized workflows for both **Job Seekers** and **Employers**, featuring real-time application tracking and secure role-based access.

![Banner](https://img.shields.io/badge/Status-Complete-success) ![Stack](https://img.shields.io/badge/MERN-Stack-blue)

## 📖 About Project
JobSift is a modern recruitment platform designed to solve the disconnect between talent and opportunity. Built with the **MERN Stack**, it digitizes the entire hiring workflow—from posting jobs and tracking applicants to scheduling interviews and making offers. Whether you're a startup looking for talent or a developer looking for your next role, JobSift makes the process seamless, transparent, and efficient.

## 🌟 Key Features (Topic-Based)

### 1. **Employer Management 🏢**
Empowering companies to find the best talent efficiently.
*   **Job Posting**: Create detailed job listings with salary, location, and application **deadlines**.
*   **Applicant Tracking System (ATS)**: View a dedicated dashboard of all applicants for each job.
*   **Status Management**: Move candidates through the pipeline:
    *   `Applied` ➝ `Shortlisted` ➝ `OA` (Online Assessment) ➝ `Interview` ➝ `Hired` or `Rejected`.
*   **Job Control**: Edit deadlines or delete job posts securely.

### 2. **Job Seeker Experience 👨‍💻**
Helping candidates land their dream job with ease.
*   **Smart Search**: Filter jobs by **Category**, **Location**, and **Type** (Full-time, Remote, etc.).
*   **One-Click Apply**: Apply instantly to jobs (resume upload required).
*   **Visual Progress Tracker**: A real-time **Stepper UI** shows exactly where your application stands (e.g., "Interview Scheduled").
*   **Profile Management**: Upload and manage your resume securely.

### 3. **Security & Authentication 🔒**
Built with industry-standard security practices.
*   **JWT Authentication**: Secure, stateless session management.
*   **Role-Based Access Control (RBAC)**: Strict separation between `Employer` and `Seeker` capabilities.
*   **Resource Protection**: Users can only modify their own data (e.g., Employers cannot delete each other's jobs).
*   **Password Encryption**: All passwords are hashed using `bcrypt`.

---

## 🛠️ Tech Stack

| Component | Technology | Description |
| :--- | :--- | :--- |
| **Frontend** | React.js | Component-based UI with Hooks |
| **Styling** | Tailwind CSS | Utility-first modern styling |
| **Backend** | Node.js & Express | Scalable REST API |
| **Database** | MongoDB | Flexible NoSQL data storage |
| **Auth** | JWT & Bcrypt | Security & Encryption |

---

## 🚀 Getting Started

### Prerequisites
*   Node.js (v14+)
*   MongoDB URI

### Installation

1.  **Clone the repository**
    ```bash
    git clone https://github.com/Niku17/JobSift.git
    cd JobSift
    ```

2.  **Install Dependencies**
    ```bash
    # Install Backend deps
    cd backend
    npm install

    # Install Frontend deps
    cd ../frontend
    npm install
    ```

3.  **Configure Environment**
    Create a `.env` file in the `backend` folder:
    ```env
    MONGODB_URI=your_mongodb_connection_string
    JWT_SECRET=your_jwt_secret
    PORT=4000
    ```

4.  **Run the Project**
    ```bash
    # Run Backend (from backend folder)
    npm start

    # Run Frontend (from frontend folder)
    npm run dev
    ```

## 📜 API Endpoints

### Jobs
*   `GET /api/jobs` - Fetch all jobs
*   `POST /api/jobs/post` - Create a job (Employer)
*   `POST /api/jobs/apply` - Apply for a job (Seeker)

### Users
*   `POST /api/auth/register` - Create account
*   `POST /api/auth/login` - Login

---

**Developed with ❤️ by Nikhil**
