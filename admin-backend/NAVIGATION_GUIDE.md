# Navigation Guide: Accessing User Pages from Admin Dashboard

## ✅ All Routes Are Working!

The server is running correctly and all routes are tested and working. Here's how to access the user pages from the admin dashboard:

## 🚀 Step-by-Step Instructions

### 1. Start the Server (if not already running)
```bash
cd edunova-sadee/admin-backend
python app.py
```

### 2. Access the Admin Dashboard
Open your browser and go to:
```
http://127.0.0.1:5000/admin
```

### 3. Login as Admin (if required)
- **Username**: `admin`
- **Password**: `admin123`

### 4. Use the Navigation Links
Once you're in the admin dashboard, you'll see navigation links in the **top bar**:
- **Home** → Takes you to `http://127.0.0.1:5000/`
- **About Us** → Takes you to `http://127.0.0.1:5000/about`
- **Courses** → Takes you to `http://127.0.0.1:5000/courses`
- **Time Table** → Takes you to `http://127.0.0.1:5000/timetable`
- **Contact** → Takes you to `http://127.0.0.1:5000/contact`

## 🔗 Direct Access URLs

You can also access the user pages directly:

- **Home Page**: `http://127.0.0.1:5000/` or `http://127.0.0.1:5000/index.html`
- **About Page**: `http://127.0.0.1:5000/about` or `http://127.0.0.1:5000/about.html`
- **Courses Page**: `http://127.0.0.1:5000/courses` or `http://127.0.0.1:5000/courses.html`
- **Timetable Page**: `http://127.0.0.1:5000/timetable` or `http://127.0.0.1:5000/timetable.html`
- **Contact Page**: `http://127.0.0.1:5000/contact` or `http://127.0.0.1:5000/Contact.html`

## 🔧 Troubleshooting

### If navigation links don't work:

1. **Check if you're logged in**: Make sure you're logged in as admin
2. **Refresh the page**: Try refreshing the admin dashboard
3. **Check browser console**: Press F12 and look for JavaScript errors
4. **Try direct URLs**: Use the direct access URLs above
5. **Clear browser cache**: Clear your browser cache and try again

### If you get a 404 error:

1. **Make sure the server is running**: Check that port 5000 is in use
2. **Check the URL**: Make sure you're using `http://127.0.0.1:5000` (not `localhost`)
3. **Try the startup script**: Use `python start.py` instead of `python app.py`

## 🧪 Testing

You can test all routes using:
```bash
python test_navigation.py
```

This will verify that all navigation links are working correctly.

## 📋 Quick Reference

| Page | Admin Dashboard Link | Direct URL |
|------|---------------------|------------|
| Home | Click "Home" in top nav | `http://127.0.0.1:5000/` |
| About | Click "About Us" in top nav | `http://127.0.0.1:5000/about` |
| Courses | Click "Courses" in top nav | `http://127.0.0.1:5000/courses` |
| Timetable | Click "Time Table" in top nav | `http://127.0.0.1:5000/timetable` |
| Contact | Click "Contact" in top nav | `http://127.0.0.1:5000/contact` |

## 🎉 Success!

All routes are working correctly. You should be able to navigate from the admin dashboard to any user page using the navigation links in the top bar.
