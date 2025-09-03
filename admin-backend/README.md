# EduNova Admin Backend

A Flask-based REST API backend for the EduNova Student Registration System admin panel.

## Features

- 🔐 **Admin Authentication** - JWT-based authentication system
- 👥 **Student Management** - CRUD operations for student records
- 📚 **Course Management** - CRUD operations for course management
- 📊 **Dashboard Statistics** - Real-time statistics and analytics
- 🔒 **Secure API** - Token-based authentication and authorization
- 🌐 **CORS Support** - Cross-origin resource sharing enabled
- 📁 **Static File Serving** - Serves frontend files directly

## Tech Stack

- **Backend**: Flask (Python)
- **Database**: MongoDB
- **Authentication**: JWT (JSON Web Tokens)
- **CORS**: Flask-CORS
- **Password Hashing**: Werkzeug

## Prerequisites

- Python 3.7+
- MongoDB (local or cloud)
- pip (Python package manager)

## Installation

1. **Clone the repository** (if not already done):
   ```bash
   git clone <your-repo-url>
   cd edunova-sadee/admin-backend
   ```

2. **Install dependencies**:
   ```bash
   pip install -r requirements.txt
   ```

3. **Set up MongoDB**:
   - Install MongoDB locally or use MongoDB Atlas
   - Ensure MongoDB is running on `mongodb://localhost:27017`

4. **Initialize the database**:
   ```bash
   python init_db.py
   ```

## Configuration

Create a `.env` file in the `admin-backend` directory with the following variables:

```env
# Flask Configuration
SECRET_KEY=your-super-secret-key-change-this-in-production
FLASK_DEBUG=True
HOST=127.0.0.1
PORT=5000

# MongoDB Configuration
MONGODB_URI=mongodb://localhost:27017/edunova_database

# JWT Configuration
JWT_SECRET_KEY=your-jwt-secret-key-change-this-in-production
JWT_ACCESS_TOKEN_EXPIRES=24
```

## Running the Application

1. **Start the Flask server**:
   ```bash
   python app.py
   ```

2. **Access the application**:
   - Frontend: http://127.0.0.1:5000
   - API Base URL: http://127.0.0.1:5000/api

## Default Admin Account

After running `init_db.py`, a default admin account is created:

- **Username**: admin
- **Password**: admin123
- **Email**: admin@edunova.com

⚠️ **Important**: Change these credentials in production!

## API Endpoints

### Authentication
- `POST /api/admin/register` - Register new admin
- `POST /api/admin/login` - Admin login

### Students
- `GET /api/students` - Get all students (with pagination and search)
- `POST /api/students` - Create new student
- `GET /api/students/<id>` - Get specific student
- `PUT /api/students/<id>` - Update student
- `DELETE /api/students/<id>` - Delete student

### Courses
- `GET /api/courses` - Get all courses
- `POST /api/courses` - Create new course
- `GET /api/courses/<id>` - Get specific course
- `PUT /api/courses/<id>` - Update course
- `DELETE /api/courses/<id>` - Delete course

### Teachers
- `GET /api/teachers` - Get all teachers
- `POST /api/teachers` - Create new teacher
- `GET /api/teachers/<id>` - Get specific teacher
- `PUT /api/teachers/<id>` - Update teacher
- `DELETE /api/teachers/<id>` - Delete teacher

### Dashboard
- `GET /api/dashboard/stats` - Get dashboard statistics

### Utility
- `GET /health` - Health check
- `GET /api/routes` - List all registered routes

## Authentication

All protected endpoints require a JWT token in the Authorization header:

```
Authorization: Bearer <your-jwt-token>
```

## Database Schema

### Admins Collection
```json
{
  "_id": "ObjectId",
  "username": "string (unique)",
  "email": "string (unique)",
  "password": "string (hashed)",
  "full_name": "string",
  "role": "string",
  "created_at": "datetime",
  "is_active": "boolean"
}
```

### Students Collection
```json
{
  "_id": "ObjectId",
  "full_name": "string",
  "email": "string (unique)",
  "student_id": "string (unique)",
  "course": "string",
  "phone": "string",
  "address": "string",
  "date_of_birth": "date",
  "enrollment_date": "datetime",
  "status": "string",
  "created_at": "datetime",
  "created_by": "string (admin_id)",
  "updated_at": "datetime",
  "updated_by": "string (admin_id)"
}
```

### Courses Collection
```json
{
  "_id": "ObjectId",
  "name": "string",
  "code": "string (unique)",
  "description": "string",
  "duration": "string",
  "fee": "number",
  "capacity": "number",
  "status": "string",
  "created_at": "datetime",
  "created_by": "string (admin_id)",
  "updated_at": "datetime",
  "updated_by": "string (admin_id)"
}
```

### Teachers Collection
```json
{
  "_id": "ObjectId",
  "name": "string",
  "subject": "string",
  "contact": "string",
  "email": "string (unique)",
  "status": "string",
  "created_at": "datetime",
  "created_by": "string (admin_id)",
  "updated_at": "datetime",
  "updated_by": "string (admin_id)"
}
```

## Error Handling

The API returns consistent error responses:

```json
{
  "message": "Error description"
}
```

Common HTTP status codes:
- `200` - Success
- `201` - Created
- `400` - Bad Request
- `401` - Unauthorized
- `404` - Not Found
- `500` - Internal Server Error

## Development

### Project Structure
```
admin-backend/
├── app.py              # Main Flask application
├── config.py           # Configuration settings
├── init_db.py          # Database initialization
├── requirements.txt    # Python dependencies
├── README.md          # This file
└── test_connection.py # Database connection test
```

### Adding New Features

1. Add new routes to `app.py`
2. Update database schema if needed
3. Add validation and error handling
4. Test with frontend integration

## Troubleshooting

### Common Issues

1. **MongoDB Connection Error**:
   - Ensure MongoDB is running
   - Check connection string in `.env`
   - Verify network connectivity

2. **Import Errors**:
   - Install missing dependencies: `pip install -r requirements.txt`
   - Check Python version compatibility

3. **CORS Issues**:
   - Verify CORS configuration in `config.py`
   - Check frontend URL in allowed origins

4. **JWT Token Issues**:
   - Ensure SECRET_KEY is set
   - Check token expiration time
   - Verify token format in Authorization header

## Production Deployment

1. **Security**:
   - Change default admin credentials
   - Use strong SECRET_KEY
   - Enable HTTPS
   - Set up proper CORS origins

2. **Performance**:
   - Use production WSGI server (Gunicorn)
   - Enable database connection pooling
   - Set up proper logging

3. **Monitoring**:
   - Set up health checks
   - Monitor database performance
   - Log API requests and errors

## License

This project is part of the EduNova Student Registration System.

## Support

For issues and questions, please check the troubleshooting section or create an issue in the repository.
