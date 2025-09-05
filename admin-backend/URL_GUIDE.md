# EduNova URL Guide - Understanding Correct URLs

## 🚨 **The Error You Encountered**

**Error**: `http://127.0.0.1:5000/admin/index.html` - 404 NOT FOUND

**Why this happened**: You tried to access `/admin/index.html` but this file doesn't exist in the admin directory.

## ✅ **Correct URLs to Use**

### 🔐 **Admin URLs**
| What You Want | ❌ Wrong URL | ✅ Correct URL |
|---------------|--------------|----------------|
| Admin Dashboard | `http://127.0.0.1:5000/admin/index.html` | `http://127.0.0.1:5000/admin` |
| Admin Login | `http://127.0.0.1:5000/admin/login.html` | `http://127.0.0.1:5000/admin/adminlogin.html` |
| Admin Settings | `http://127.0.0.1:5000/admin/settings.html` | `http://127.0.0.1:5000/admin/settings.html` |

### 🏠 **User/Public URLs**
| What You Want | ✅ Correct URL |
|---------------|----------------|
| Home Page | `http://127.0.0.1:5000/` or `http://127.0.0.1:5000/index.html` |
| About Page | `http://127.0.0.1:5000/about` or `http://127.0.0.1:5000/about.html` |
| Courses Page | `http://127.0.0.1:5000/courses` or `http://127.0.0.1:5000/courses.html` |
| Timetable Page | `http://127.0.0.1:5000/timetable` or `http://127.0.0.1:5000/timetable.html` |
| Contact Page | `http://127.0.0.1:5000/contact` or `http://127.0.0.1:5000/Contact.html` |

## 📁 **File Structure Explanation**

### Admin Directory (`/admin/`)
```
admin/
├── Dashboard.html      ← Main admin dashboard
├── adminlogin.html     ← Admin login page
├── settings.html       ← Admin settings
├── mstudent.html       ← Manage students
├── mteachers.html      ← Manage teachers
├── Mcourses.html       ← Manage courses
├── mtime.html          ← Manage timetable
└── ... (other admin files)
```

**Note**: There is NO `index.html` file in the admin directory!

### Public Directory (`/public/`)
```
public/
├── index.html          ← Main home page
├── about.html          ← About page
├── courses.html        ← Courses page
├── timetable.html      ← Timetable page
└── Contact.html        ← Contact page
```

## 🚀 **How to Access Your Application**

### Step 1: Start the Server
```bash
cd edunova-sadee/admin-backend
python app.py
```

### Step 2: Access Admin Dashboard
Open your browser and go to:
```
http://127.0.0.1:5000/admin
```

### Step 3: Access User Pages
From the admin dashboard, click the navigation links in the top bar:
- **Home** → `http://127.0.0.1:5000/`
- **About Us** → `http://127.0.0.1:5000/about`
- **Courses** → `http://127.0.0.1:5000/courses`
- **Time Table** → `http://127.0.0.1:5000/timetable`
- **Contact** → `http://127.0.0.1:5000/contact`

## 🔧 **Fixes Applied**

I've added a redirect route so that if you accidentally type `/admin/index.html`, it will automatically redirect you to `/admin`.

## 🧪 **Testing URLs**

You can test all URLs using:
```bash
python test_all_routes.py
```

This will verify that all correct URLs are working.

## 📋 **Quick Reference**

### ✅ **Use These URLs:**
- **Admin Dashboard**: `http://127.0.0.1:5000/admin`
- **Home Page**: `http://127.0.0.1:5000/`
- **About Page**: `http://127.0.0.1:5000/about`
- **Courses Page**: `http://127.0.0.1:5000/courses`
- **Timetable Page**: `http://127.0.0.1:5000/timetable`
- **Contact Page**: `http://127.0.0.1:5000/contact`

### ❌ **Don't Use These URLs:**
- `http://127.0.0.1:5000/admin/index.html` (doesn't exist)
- `http://127.0.0.1:5000/admin/login.html` (wrong filename)
- `http://127.0.0.1:5000/admin/home.html` (doesn't exist)

## 🎉 **Summary**

- **Admin dashboard**: Use `http://127.0.0.1:5000/admin`
- **User pages**: Use the clean URLs like `http://127.0.0.1:5000/`, `/about`, `/courses`, etc.
- **Navigation**: Use the links in the admin dashboard top bar

The 404 error is now fixed with a redirect, but it's better to use the correct URLs from the start!
