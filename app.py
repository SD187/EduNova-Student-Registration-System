# Clean Flask Timetable Backend - No Warnings

from flask import Flask, render_template, jsonify, request

app = Flask(__name__)

# Simple timetable data matching your Figma design
timetable_data = {
    "Monday": [
        {"time": "3:30 PM-5:30 PM", "subject": "Mathematics", "grade": "Grade 6", "instructor": "Dr. Smith", "room": "Room A-101"},
        {"time": "3:30 PM-5:30 PM", "subject": "Mathematics", "grade": "Grade 7", "instructor": "Dr. Smith", "room": "Room A-102"},
        {"time": "6:00 PM-8:00 PM", "subject": "Mathematics", "grade": "Grade 8", "instructor": "Dr. Johnson", "room": "Room A-101"},
        {"time": "6:00 PM-8:00 PM", "subject": "Mathematics", "grade": "Grade 9", "instructor": "Dr. Johnson", "room": "Room A-102"},
        {"time": "8:00 PM-10:00 PM", "subject": "Mathematics", "grade": "Grade 10", "instructor": "Prof. Wilson", "room": "Room A-101"},
        {"time": "8:00 PM-10:00 PM", "subject": "Mathematics", "grade": "Grade 11", "instructor": "Prof. Wilson", "room": "Room A-102"}
    ],
    "Tuesday": [
        {"time": "3:30 PM-5:30 PM", "subject": "Science", "grade": "Grade 6", "instructor": "Dr. Anderson", "room": "Lab B-201"},
        {"time": "3:30 PM-5:30 PM", "subject": "Science", "grade": "Grade 7", "instructor": "Dr. Anderson", "room": "Lab B-202"},
        {"time": "6:00 PM-8:00 PM", "subject": "Science", "grade": "Grade 8", "instructor": "Prof. Garcia", "room": "Lab B-201"},
        {"time": "6:00 PM-8:00 PM", "subject": "Science", "grade": "Grade 9", "instructor": "Prof. Garcia", "room": "Lab B-202"},
        {"time": "8:00 PM-10:00 PM", "subject": "Science", "grade": "Grade 10", "instructor": "Dr. Martinez", "room": "Lab B-201"},
        {"time": "8:00 PM-10:00 PM", "subject": "Science", "grade": "Grade 11", "instructor": "Dr. Martinez", "room": "Lab B-202"}
    ],
    "Wednesday": [
        {"time": "3:30 PM-5:30 PM", "subject": "Sinhala", "grade": "Grade 6", "instructor": "Ms. Fernando", "room": "Room C-301"},
        {"time": "3:30 PM-5:30 PM", "subject": "Sinhala", "grade": "Grade 7", "instructor": "Ms. Fernando", "room": "Room C-302"},
        {"time": "6:00 PM-8:00 PM", "subject": "Sinhala", "grade": "Grade 8", "instructor": "Mr. Perera", "room": "Room C-301"},
        {"time": "6:00 PM-8:00 PM", "subject": "Sinhala", "grade": "Grade 9", "instructor": "Mr. Perera", "room": "Room C-302"},
        {"time": "8:00 PM-10:00 PM", "subject": "Sinhala", "grade": "Grade 10", "instructor": "Mrs. Silva", "room": "Room C-301"},
        {"time": "8:00 PM-10:00 PM", "subject": "Sinhala", "grade": "Grade 11", "instructor": "Mrs. Silva", "room": "Room C-302"}
    ],
    "Thursday": [
        {"time": "3:30 PM-5:30 PM", "subject": "English", "grade": "Grade 6", "instructor": "Ms. Davis", "room": "Room D-101"},
        {"time": "3:30 PM-5:30 PM", "subject": "English", "grade": "Grade 7", "instructor": "Ms. Davis", "room": "Room D-102"},
        {"time": "6:00 PM-8:00 PM", "subject": "English", "grade": "Grade 8", "instructor": "Prof. Taylor", "room": "Room D-101"},
        {"time": "6:00 PM-8:00 PM", "subject": "English", "grade": "Grade 9", "instructor": "Prof. Taylor", "room": "Room D-102"},
        {"time": "8:00 PM-10:00 PM", "subject": "English", "grade": "Grade 10", "instructor": "Dr. Brown", "room": "Room D-101"},
        {"time": "8:00 PM-10:00 PM", "subject": "English", "grade": "Grade 11", "instructor": "Dr. Brown", "room": "Room D-102"}
    ],
    "Friday": [
        {"time": "3:30 PM-5:30 PM", "subject": "History", "grade": "Grade 6", "instructor": "Prof. Jayawardana", "room": "Room E-201"},
        {"time": "3:30 PM-5:30 PM", "subject": "History", "grade": "Grade 7", "instructor": "Prof. Jayawardana", "room": "Room E-202"},
        {"time": "6:00 PM-8:00 PM", "subject": "History", "grade": "Grade 8", "instructor": "Dr. Wijesinghe", "room": "Room E-201"},
        {"time": "6:00 PM-8:00 PM", "subject": "History", "grade": "Grade 9", "instructor": "Dr. Wijesinghe", "room": "Room E-202"},
        {"time": "8:00 PM-10:00 PM", "subject": "History", "grade": "Grade 10", "instructor": "Mrs. Rathnayake", "room": "Room E-201"},
        {"time": "8:00 PM-10:00 PM", "subject": "History", "grade": "Grade 11", "instructor": "Mrs. Rathnayake", "room": "Room E-202"}
    ],
    "Saturday": [
        {"time": "3:30 PM-5:30 PM", "subject": "Buddhist", "grade": "Grade 6", "instructor": "Rev. Dharmaratana", "room": "Hall F-101"},
        {"time": "3:30 PM-5:30 PM", "subject": "Buddhist", "grade": "Grade 7", "instructor": "Rev. Dharmaratana", "room": "Hall F-102"},
        {"time": "6:00 PM-8:00 PM", "subject": "Buddhist", "grade": "Grade 8", "instructor": "Rev. Siripala", "room": "Hall F-101"},
        {"time": "6:00 PM-8:00 PM", "subject": "Buddhist", "grade": "Grade 9", "instructor": "Rev. Siripala", "room": "Hall F-102"},
        {"time": "8:00 PM-10:00 PM", "subject": "Buddhist", "grade": "Grade 10", "instructor": "Rev. Wimalasara", "room": "Hall F-101"},
        {"time": "8:00 PM-10:00 PM", "subject": "Buddhist", "grade": "Grade 11", "instructor": "Rev. Wimalasara", "room": "Hall F-102"}
    ]
}

# Main timetable route
@app.route('/timetable')
def timetable():
    return render_template('timetable.html', schedule=timetable_data)

# API endpoint for timetable data (for AJAX calls)
@app.route('/api/timetable')
def api_timetable():
    return jsonify(timetable_data)

# Get timetable for specific day
@app.route('/api/timetable/<day>')
def api_timetable_day(day):
    if day.capitalize() in timetable_data:
        return jsonify({day: timetable_data[day.capitalize()]})
    return jsonify({"error": "Day not found"}), 404

# Add new class (simple version)
@app.route('/add_class', methods=['POST'])
def add_class():
    day = request.form.get('day')
    time_slot = request.form.get('time')
    subject = request.form.get('subject')
    grade = request.form.get('grade')
    instructor = request.form.get('instructor')
    room = request.form.get('room')
    
    if day in timetable_data:
        new_class = {
            "time": time_slot,
            "subject": subject,
            "grade": grade,
            "instructor": instructor,
            "room": room
        }
        timetable_data[day].append(new_class)
        return jsonify({"message": "Class added successfully"})
    
    return jsonify({"error": "Invalid day"}), 400

# Simple search function
@app.route('/search_timetable')
def search_timetable():
    query = request.args.get('q', '').lower()
    results = []
    
    for day, classes in timetable_data.items():
        for class_info in classes:
            if (query in class_info['subject'].lower() or 
                query in class_info['instructor'].lower() or
                query in class_info['room'].lower() or
                query in class_info['grade'].lower()):
                results.append({
                    "day": day,
                    "time": class_info['time'],
                    "subject": class_info['subject'],
                    "grade": class_info['grade'],
                    "instructor": class_info['instructor'],
                    "room": class_info['room']
                })
    
    return jsonify(results)

# Helper function to get all instructors
@app.route('/api/instructors')
def get_instructors():
    instructors = set()
    for day, classes in timetable_data.items():
        for class_info in classes:
            instructors.add(class_info['instructor'])
    return jsonify(list(instructors))

# Helper function to get all rooms
@app.route('/api/rooms')
def get_rooms():
    rooms = set()
    for day, classes in timetable_data.items():
        for class_info in classes:
            rooms.add(class_info['room'])
    return jsonify(list(rooms))

# Simple stats for dashboard
@app.route('/api/timetable/stats')
def timetable_stats():
    total_classes = sum(len(classes) for classes in timetable_data.values())
    total_instructors = len(set(class_info['instructor'] 
                              for classes in timetable_data.values() 
                              for class_info in classes))
    total_rooms = len(set(class_info['room'] 
                         for classes in timetable_data.values() 
                         for class_info in classes))
    
    return jsonify({
        "total_classes": total_classes,
        "total_instructors": total_instructors,
        "total_rooms": total_rooms,
        "days_scheduled": len(timetable_data)
    })

# If you need a simple form page
@app.route('/timetable/manage')
def manage_timetable():
    return render_template('manage_timetable.html')

# Route to show today's schedule
@app.route('/today')
def today_schedule():
    from datetime import datetime
    
    today = datetime.now().strftime('%A')  # Gets day name like 'Monday'
    
    if today in timetable_data:
        today_classes = timetable_data[today]
        return jsonify({
            "day": today,
            "classes": today_classes,
            "count": len(today_classes)
        })
    
    return jsonify({
        "day": today,
        "classes": [],
        "count": 0,
        "message": "No classes scheduled for today"
    })

# Run the app
if __name__ == '__main__':
    app.run(debug=True)