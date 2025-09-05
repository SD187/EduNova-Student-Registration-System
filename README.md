# EduNova Academy - Integrated Web Application

## 🏗️ Project Structure

This project has been reorganized with a professional, scalable directory structure that integrates frontend and backend components.

```
edunova-sadee/
├── public/                    # User-facing pages (public access)
│   ├── index.html            # Home page
│   ├── courses.html          # Course resources
│   ├── timetable.html        # Public timetable
│   ├── about.html            # About page
│   ├── Contact.html          # Contact page
│   ├── css/                  # Public page styles
│   └── js/                   # Public page scripts
├── admin/                     # Admin-only pages (protected)
│   ├── Dashboard.html        # Admin dashboard
│   ├── mteachers.html        # Manage teachers
│   ├── Mcourses.html         # Manage courses
│   ├── mtime.html            # Manage timetable
│   ├── mstudent.html         # Manage students
│   ├── settings.html         # Admin settings
│   ├── adminlogin.html       # Admin login
│   ├── adminfront.html       # Admin front page
│   ├── fpassword.html        # Forgot password
│   ├── logout.html           # Logout page
│   ├── createaccount.html    # Create admin account
│   ├── css/                  # Admin page styles
│   └── js/                   # Admin page scripts
├── shared/                    # Shared resources
│   ├── css/                  # Common styles
│   ├── js/                   # Common scripts
│   └── assets/               # Common assets (images, logos)
├── admin-backend/            # Backend API (Flask)
│   ├── app.py               # Main Flask app
│   ├── config.py            # Configuration
│   └── ...
└── backend/                  # Node.js backend (if used)
```

## 🌐 URL Structure & Routing

### Public Routes (No Authentication Required)
- **Home**: `http://localhost:5000/`
- **About**: `http://localhost:5000/public/about.html`
- **Courses**: `http://localhost:5000/public/courses.html`
- **Timetable**: `http://localhost:5000/public/timetable.html`
- **Contact**: `http://localhost:5000/public/Contact.html`
- **Student Registration**: `http://localhost:5000/` (via Google Forms link)

### Admin Routes (JWT Authentication Required)
- **Admin Dashboard**: `http://localhost:5000/admin`
- **Manage Students**: `http://localhost:5000/admin/mstudent.html`
- **Manage Teachers**: `http://localhost:5000/admin/mteachers.html`
- **Manage Courses**: `http://localhost:5000/admin/Mcourses.html`
- **Manage Timetable**: `http://localhost:5000/admin/mtime.html`
- **Settings**: `http://localhost:5000/admin/settings.html`
- **Admin Login**: `http://localhost:5000/admin/adminlogin.html`
- **Forgot Password**: `http://localhost:5000/admin/fpassword.html`
- **Create Admin Account**: `http://localhost:5000/admin/createaccount.html`
- **Logout**: `http://localhost:5000/admin/logout.html`

### API Endpoints
- **Health Check**: `http://localhost:5000/health`
- **Admin API**: `http://localhost:5000/api/admin/*`
- **Public API**: `http://localhost:5000/api/public/*`

## 🔐 Access Control

### Public Access
- Home page and all public pages
- Course information
- Timetable viewing
- Contact information
- Student registration (via external Google Forms)

### Protected Access (Admin Only)
- All admin management pages
- Student, teacher, and course management
- Timetable management
- System settings
- Dashboard statistics
- Admin account management
- Password recovery

## 🚀 Getting Started

### 1. Start the Backend
```bash
cd admin-backend
python app.py
```

### 2. Access the Application
- **Public Home**: http://localhost:5000/
- **Admin Panel**: http://localhost:5000/admin

### 3. Default Admin Credentials
- **Username**: `admin`
- **Password**: `admin123`

## 📁 File Organization Benefits

✅ **Security**: Clear separation between public and admin areas
✅ **Organization**: Easy to maintain and understand
✅ **Scalability**: Easy to add new admin or user features
✅ **Deployment**: Can deploy admin and public separately if needed
✅ **Access Control**: Clear authentication boundaries
✅ **Maintenance**: Easier to find and update specific functionality

## 🔧 Development Workflow

### Adding New Public Pages
1. Create HTML file in `public/` directory
2. Add CSS in `public/css/` directory
3. Add JavaScript in `public/js/` directory
4. Update navigation links

### Adding New Admin Pages
1. Create HTML file in `admin/` directory
2. Add CSS in `admin/css/` directory
3. Add JavaScript in `admin/js/` directory
4. Update admin navigation
5. Add backend API endpoints if needed

### Adding Shared Resources
1. Place common CSS in `shared/css/`
2. Place common JavaScript in `shared/js/`
3. Place common assets in `shared/assets/`
4. Reference using `/shared/` paths

## 🌟 Key Features

- **Responsive Design**: Works on all devices
- **JWT Authentication**: Secure admin access
- **MongoDB Integration**: Scalable data storage
- **RESTful API**: Clean backend architecture
- **Professional UI**: Modern, user-friendly interface

## 📞 Support

For questions or support, contact:
- **Email**: edunovaacademy.lk@gmail.com
- **Phone**: 0728561668 / 0711733650
- **Location**: Embilipitiya, Sri Lanka

---

**EduNova Academy** - Empowering Education Through Technology
