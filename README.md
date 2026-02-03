# Smart Timesheet Validation and Approval System
## 1. Project Overview
The Smart Timesheet Validation and Approval System is a web-based application designed to simplify and improve the process of employee timesheet submission, validation, and managerial approval.

The system reduces manual effort for managers by automatically validating timesheet data, identifying policy violations and unusual work patterns, and prioritizing entries that require closer review. By combining rule-based checks, historical analysis, and clear dashboards, the system enables efficient, transparent, and accurate timesheet management across organizations.

## 2. Problem it Solves
In many organizations, managers are required to review a large number of employee timesheets regularly. This process is often time-consuming and error-prone, as managers must manually verify reported hours, detect inconsistencies, and ensure compliance with organizational policies.

Existing timesheet systems primarily focus on basic data collection and submission, offering little support for intelligent validation or anomaly detection. As a result, managers either spend excessive time on manual checks or approve timesheets without sufficient insight.

This system addresses the problem by enabling **exception-based review**, where managers can focus primarily on high-risk or unusual entries while routine submissions are handled efficiently.

## 3. Target Users
### Employee
- Submits weekly timesheets
- Saves drafts and edits entries before submission
- Views approval status, risk score, and feedback
- Resubmits rejected timesheets after corrections

### Manager
- Reviews submitted timesheets
- Prioritizes reviews using risk scores and validation flags
- Approves or rejects timesheets with clear reasoning

### System Administrator
- Manages users and assigns roles
- Configures validation rules and risk thresholds
- Maintains system configuration and monitoring

## 4. Vision Statement
*To build a reliable timesheet validation and approval system that reduces manual effort, improves accuracy, and supports managers through automated validation and risk-based prioritization.*


## 5. Key Features
- Simple and intuitive timesheet submission for employees
- Secure authentication with role-based access control (Employee, Manager, Admin)
- Automated rule-based validation of work hours and policy compliance
- Risk scoring and identification of unusual or potentially inaccurate timesheets
- Manager dashboards with prioritized review based on risk levels
- Approval and rejection workflows with clear feedback
- Notifications to keep employees and managers informed
- Audit logs to ensure transparency and accountability

## 6. Success Metrics
The success of the system will be measured using the following criteria:

- The system supports all core workflows: submission, validation, approval, rejection, and notification
- At least 95% of core use cases execute successfully without defects
- Validation rules and risk scores are correctly applied to all submitted timesheets
- At least 90% of high-risk test cases are correctly flagged for managerial review
- The project is completed within the defined timeline and meets all specified requirements

## 7. Assumptions
- Employees, managers, and administrators have access to a web browser to use the system
- Users enter timesheet data accurately and honestly within the defined reporting period
- Basic internet connectivity is available to access the web-based application
- Historical timesheet data (real or simulated) is available for analysis and testing purposes
- The development team has access to necessary tools and resources for development

## 8. Constraints
- Development must be completed within a 4-month timeline
- Only free or open-source technologies are used to minimize costs
- The system must ensure data privacy and basic security for user credentials, timesheet data, and audit records
- Historical timesheet data may be simulated for demonstration purposes
- The project is developed by a student with intermediate programming skills

## 9. Branching Strategy
### Main Principles
- The `main` branch always contains stable and working code.
- New features, enhancements, or changes are developed in separate **feature branches** created from `main`.
- Each feature branch represents a specific unit of work (for example, Docker setup or documentation updates).
- Once a feature is completed and tested locally, it is pushed to GitHub and can be merged back into `main`.

### Branch Naming Convention
Feature branches follow this naming format: feature/ `<`feature-name`>`

## 10. Quick Start – Local Development (Docker)
This project uses **Docker** and **Docker Compose** to run the frontend, backend, and database in isolated containers for consistent local development.

### Prerequisites
Ensure the following tools are installed on your system:
- **Git**
- **Docker Desktop (AMD64 / x86_64)**
- **Node.js** (only required if running without Docker)
- **Web browser** (Chrome / Firefox)


### Project Structure
```text
smart-timesheet-system/
│
├── frontend/            # React frontend
│   ├── Dockerfile
│   └── package.json
│
├── backend/             # Node.js + Express backend
│   ├── Dockerfile
│   ├── server.js
│   └── package.json
│
├── docker-compose.yml   # Docker Compose configuration
├── .gitignore
└── README.md
```

### Running the Application Using Docker Compose
#### Clone the repository

```
git clone <your-github-repo-url>
cd smart-timesheet-system
```

#### Build and start all services
```
docker-compose up --build
```

This command will:
- Build the frontend and backend Docker images
- Start the React frontend
- Start the Node.js backend
- Start MongoDB as a database container

### Access the Application
#### Frontend (React UI): 
http://localhost:3000

#### Backend (API test):
http://localhost:5000


### Stopping the Application
To stop all running containers:
```
docker-compose down
```

### Local Development Tools Used

- **VS Code** – Code editor
- **Docker Desktop** – Containerization
- **Docker Compose** – Multi-container orchestration
- **Git & GitHub** – Version control
- **Draw.io** – Architecture diagram
- **Figma** – UI wireframes
