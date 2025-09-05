# EduNova Routing Guide

## Overview
Your EduNova application now has proper routing paths for both admin and user parts. The routing is handled by the Flask backend at `http://127.0.0.1:5000`.

## 🏠 User/Public Routes

### Main User Pages
- **Home Page**: `http://127.0.0.1:5000/` or `http://127.0.0.1:5000/index.html`
- **About Page**: `http://127.0.0.1:5000/about` or `http://127.0.0.1:5000/about.html`
- **Courses Page**: `http://127.0.0.1:5000/courses` or `http://127.0.0.1:5000/courses.html`
- **Timetable Page**: `http://127.0.0.1:5000/timetable` or `http://127.0.0.1:5000/timetable.html`
- **Contact Page**: `http://127.0.0.1:5000/contact` or `http://127.0.0.1:5000/Contact.html`

### Static Files
- **CSS Files**: `http://127.0.0.1:5000/public/css/`
- **JavaScript Files**: `http://127.0.0.1:5000/public/js/`
- **Shared Assets**: `http://127.0.0.1:5000/shared/assets/`

## 🔐 Admin Routes

### Admin Dashboard
- **Admin Dashboard**: `http://127.0.0.1:5000/admin`
- **Admin Login**: `http://127.0.0.1:5000/admin/adminlogin.html`
- **Admin Settings**: `http://127.0.0.1:5000/admin/settings.html`

### Admin Management Pages
- **Manage Students**: `http://127.0.0.1:5000/admin/mstudent.html`
- **Manage Teachers**: `http://127.0.0.1:5000/admin/mteachers.html`
- **Manage Courses**: `http://127.0.0.1:5000/admin/Mcourses.html`
- **Manage Timetable**: `http://127.0.0.1:5000/admin/mtime.html`

### Admin Static Files
- **Admin CSS**: `http://127.0.0.1:5000/admin/css/`
- **Admin JavaScript**: `http://127.0.0.1:5000/admin/js/`

## 🔌 API Routes

### Admin APIs
- **Admin Login**: `POST /api/admin/login`
- **Admin Register**: `POST /api/admin/register`
- **Admin Profile**: `GET /api/admin/me`
- **Admin Logout**: `POST /api/admin/logout`

### Data Management APIs
- **Students**: `GET/POST/PUT/DELETE /api/students`
- **Teachers**: `GET/POST/PUT/DELETE /api/teachers`
- **Courses**: `GET/POST/PUT/DELETE /api/courses`
- **Timetable**: `GET/POST/DELETE /api/timetable`

### Public APIs
- **Health Check**: `GET /api/health`
- **Course Resources**: `GET /api/public/course-resource`
- **Registration Links**: `GET /api/public/registration-link`

## 🚀 How to Start the Server

### Option 1: Using the startup script
```bash
cd admin-backend
python start.py
```

### Option 2: Direct Flask run
```bash
cd admin-backend
python app.py
```

### Option 3: Using the batch file (Windows)
```bash
cd admin-backend
start.bat
```

## 🔗 Navigation Between Admin and User Parts

### From Admin Dashboard to User Pages
The admin dashboard has navigation links in the top bar that allow you to access user pages:
- **Home**: `/` - Takes you to the main user home page
- **About Us**: `/about` - Takes you to the about page
- **Courses**: `/courses` - Takes you to the courses page
- **Time Table**: `/timetable` - Takes you to the timetable page
- **Contact**: `/contact` - Takes you to the contact page

### From User Pages to Admin
To access the admin panel from user pages, you can:
1. Navigate directly to `http://127.0.0.1:5000/admin`
2. Or add admin links to your user pages if needed

## ✅ Testing Routes

You can test all routes using the provided test script:
```bash
cd admin-backend
python test_routes.py
```

This will verify that all user and admin routes are working correctly.

## 🎯 Default Credentials

- **Admin Username**: `admin`
- **Admin Password**: `admin123`

## 📁 File Structure

```
edunova-sadee/
├── admin-backend/          # Flask backend (handles all routing)
│   ├── app.py             # Main Flask application
│   └── start.py           # Startup script
├── admin/                  # Admin frontend files
│   ├── Dashboard.html     # Admin dashboard
│   ├── mstudent.html      # Student management
│   └── ...
├── public/                 # User frontend files
│   ├── index.html         # Home page
│   ├── about.html         # About page
│   └── ...
└── shared/                 # Shared assets
    └── assets/            # Images, logos, etc.
```

## 🔧 Troubleshooting

### If user pages don't load:
1. Make sure the Flask server is running on port 5000
2. Check that the `public/` directory contains the HTML files
3. Verify the route definitions in `app.py`

### If admin pages don't load:
1. Ensure you're logged in as admin
2. Check that the `admin/` directory contains the HTML files
3. Verify the admin route definitions in `app.py`

### If static files don't load:
1. Check that CSS/JS files exist in the correct directories
2. Verify the static file route definitions
3. Check browser console for 404 errors

## 🎉 Summary

✅ **Your routing is now correctly set up!**

- **User pages** are accessible at `http://127.0.0.1:5000/` and related paths
- **Admin pages** are accessible at `http://127.0.0.1:5000/admin` and related paths
- **Navigation between admin and user parts** works through the top navigation bar in the admin dashboard
- **All routes are tested and working** correctly

You can now access both the admin panel and user pages from the same server at `http://127.0.0.1:5000`!
