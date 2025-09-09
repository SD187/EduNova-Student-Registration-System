# EduNova Feedback System

A comprehensive feedback management system for collecting and managing student feedback in the EduNova educational platform.

## Features

### Public Features
- **Student Feedback Submission**: Students can submit feedback with:
  - Name and email (required)
  - Message (required)
  - Rating (1-5 stars)
  - Feedback type (general, course, teacher, facility, suggestion, complaint)
  - Anonymous submission option
- **Public Feedback Display**: Shows approved feedbacks on the contact page
- **Real-time Updates**: New feedbacks appear immediately after submission

### Admin Features
- **Feedback Management Dashboard**: Complete admin interface for managing feedbacks
- **Status Management**: Mark feedbacks as pending, reviewed, resolved, or archived
- **Admin Responses**: Add responses to student feedback
- **Bulk Actions**: Perform bulk operations on multiple feedbacks
- **Advanced Filtering**: Filter by status, type, search terms
- **Statistics Dashboard**: View feedback statistics and analytics
- **Pagination**: Handle large numbers of feedbacks efficiently

## API Endpoints

### Public Endpoints

#### POST /api/feedback
Create new feedback (no authentication required)
```json
{
  "name": "John Doe",
  "email": "john@example.com",
  "message": "Great course!",
  "rating": 5,
  "feedback_type": "course",
  "is_anonymous": false
}
```

#### GET /api/feedback
Get public feedbacks (only approved ones)
- Query parameters:
  - `limit`: Number of feedbacks to return (default: 10)
  - `type`: Filter by feedback type
  - `rating`: Filter by rating

### Admin Endpoints (Require Authentication)

#### GET /api/admin/feedback
Get all feedbacks with pagination and filtering
- Query parameters:
  - `page`: Page number (default: 1)
  - `limit`: Items per page (default: 20)
  - `status`: Filter by status
  - `type`: Filter by feedback type
  - `search`: Search in name, email, or message

#### GET /api/admin/feedback/{feedback_id}
Get specific feedback details

#### PUT /api/admin/feedback/{feedback_id}
Update feedback status and admin response
```json
{
  "status": "reviewed",
  "admin_response": "Thank you for your feedback!"
}
```

#### DELETE /api/admin/feedback/{feedback_id}
Delete feedback

#### POST /api/admin/feedback/bulk-action
Perform bulk actions on multiple feedbacks
```json
{
  "action": "mark_reviewed",
  "feedback_ids": ["id1", "id2", "id3"]
}
```

#### GET /api/admin/feedback/stats
Get feedback statistics for dashboard

## Database Schema

The feedback collection uses the following schema:

```javascript
{
  name: String (required, max 100 chars),
  email: String (required, valid email format),
  message: String (required, max 1000 chars),
  rating: Number (1-5, default: 5),
  feedback_type: String (enum: general, course, teacher, facility, suggestion, complaint),
  student_id: String (optional),
  is_anonymous: Boolean (default: false),
  status: String (enum: pending, reviewed, resolved, archived, default: pending),
  admin_response: String (optional, max 500 chars),
  responded_at: Date (set when admin responds),
  created_at: Date (auto-generated),
  updated_at: Date (auto-generated),
  created_by: String (admin who created, if applicable),
  updated_by: String (admin who last updated)
}
```

## Installation & Setup

1. **Install Dependencies**:
   ```bash
   pip install -r requirements.txt
   ```

2. **Configure Environment**:
   - Set up MongoDB connection in `config.py`
   - Ensure admin account exists (default: admin/admin123)

3. **Start the Server**:
   ```bash
   python app.py
   ```

4. **Access the System**:
   - Public feedback form: `http://localhost:5000/contact`
   - Admin dashboard: `http://localhost:5000/admin/mfeedback.html`

## Testing

Run the test script to verify the system:

```bash
python test_feedback.py
```

This will:
- Create test feedbacks
- Test all API endpoints
- Verify admin functionality
- Test filtering and pagination

## Usage Examples

### Creating Feedback (JavaScript)
```javascript
const feedbackData = {
  name: "Student Name",
  email: "student@example.com",
  message: "Great course content!",
  rating: 5,
  feedback_type: "course",
  is_anonymous: false
};

const response = await fetch('/api/feedback', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify(feedbackData)
});

if (response.ok) {
  console.log('Feedback submitted successfully!');
}
```

### Admin Feedback Management (JavaScript)
```javascript
// Get all feedbacks
const response = await fetch('/api/admin/feedback?status=pending', {
  headers: { 'Authorization': `Bearer ${token}` }
});

const data = await response.json();
console.log(data.feedbacks);

// Update feedback status
await fetch(`/api/admin/feedback/${feedbackId}`, {
  method: 'PUT',
  headers: {
    'Content-Type': 'application/json',
    'Authorization': `Bearer ${token}`
  },
  body: JSON.stringify({
    status: 'reviewed',
    admin_response: 'Thank you for your feedback!'
  })
});
```

## Security Features

- **Input Validation**: All inputs are validated and sanitized
- **Email Validation**: Proper email format validation
- **Rate Limiting**: Can be implemented to prevent spam
- **Admin Authentication**: All admin endpoints require JWT authentication
- **Data Sanitization**: User inputs are trimmed and validated

## Performance Features

- **Database Indexing**: Optimized queries with proper indexes
- **Pagination**: Efficient handling of large datasets
- **Caching**: Can be implemented for frequently accessed data
- **Lazy Loading**: Admin interface loads data on demand

## Customization

### Adding New Feedback Types
1. Update the `feedback_type` enum in the database schema
2. Add new options to the frontend form
3. Update admin interface to handle new types

### Modifying Status Workflow
1. Update the `status` enum in the database schema
2. Modify admin interface status options
3. Update bulk actions if needed

### Styling Customization
- Modify CSS in `shared/css/style.css`
- Update admin interface styles in `admin/mfeedback.html`
- Customize form appearance in `public/Contact.html`

## Troubleshooting

### Common Issues

1. **Feedback not appearing publicly**:
   - Check if feedback status is 'reviewed' or 'resolved'
   - Verify the public API is returning approved feedbacks only

2. **Admin login issues**:
   - Ensure admin account exists in database
   - Check JWT token configuration
   - Verify admin credentials

3. **Database connection errors**:
   - Check MongoDB connection string
   - Ensure MongoDB is running
   - Verify database permissions

### Debug Mode

Enable debug mode in `config.py`:
```python
DEBUG = True
```

This will provide detailed error messages and logging.

## Contributing

1. Follow the existing code style
2. Add tests for new features
3. Update documentation
4. Test with the provided test script

## License

This feedback system is part of the EduNova educational platform.
