# EduNova-Student-Registration-System
A student registration system built for EduNova Academy to simplify and automate the student enrollment process.
EduNova Academy - Educational Management System 🎓
The primary goal of this project was to understand how the frontend and backend of a web application work together. 👩‍💻👨‍💻 Specifically, this document explains how the backend was used to manage the timetable.

Frontend Development ✨
I used traditional web technologies to create the look and feel of the website and the user experience:

HTML, CSS, JavaScript: I used these to create the website's appearance and interactive features. 🎨

Logo and Other Images: The logo and other images were stored in the static/assets folder and loaded using Flask's url_for('static', ...) function. 🖼️

Backend Development ⚙️
For this project, I specifically focused the backend development on managing the Timetable.

Flask Framework: I used the Flask Framework to load the page related to the timetable.

The @app.route('/timetable') route in app.py was created for this purpose. ⏰

Routes: Routes were created for every page on the website (index, about, contact, timetable). This ensures that the URLs are maintained correctly. The routes and their corresponding URLs are as follows:

Home Page: http://127.0.0.1:5000/ 🏠

About Page: http://127.0.0.1:5000/about ℹ️

Contact Page: http://127.0.0.1:5000/contact 📞

Timetable Page: http://127.0.0.1:5000/timetable 📅

Issues I Solved ✅
Not Found Error: I fixed the Not Found error that occurred because the route for the contact page was missing by adding a new route to app.py. ✔️

Image Not Loading: I solved the issue of the logo not loading by clearing the browser cache. 🖼️✔️

This project gave me a solid understanding of how the frontend and backend of a web application connect. 🚀
