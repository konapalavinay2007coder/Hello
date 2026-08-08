import React, { useState } from 'react';
import { courses } from '../data/courses';

export default function SkillAcademy() {
  const [activeCourse, setActiveCourse] = useState(null);
  const [enrolledMap, setEnrolledMap] = useState({});

  const handleEnroll = (courseId) => {
    setEnrolledMap({ ...enrolledMap, [courseId]: true });
  };

  return (
    <div style={{ maxWidth: '1000px', margin: '0 auto', padding: '1rem', fontFamily: 'sans-serif' }}>
      
      {/* Header */}
      <div style={{ borderBottom: '2px solid #00796b', paddingBottom: '0.75rem', marginBottom: '1.5rem' }}>
        <h2 style={{ margin: 0, color: '#004d40' }}>📚 Skill Academy & Video Courses</h2>
        <p style={{ margin: '0.4rem 0 0 0', color: '#555' }}>
          Free practical vocational and digital skills video courses taught in Hindi and regional languages.
        </p>
      </div>

      {/* Courses Grid */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '1.25rem' }}>
        {courses.map((course) => (
          <div key={course.id} style={{ border: '1px solid #b2dfdb', borderRadius: '8px', overflow: 'hidden', background: '#ffffff', boxShadow: '0 2px 4px rgba(0,0,0,0.06)' }}>
            
            <div style={{ background: '#004d40', color: '#fff', padding: '1.5rem 1rem', textAlign: 'center' }}>
              <div style={{ fontSize: '2rem' }}>
                {course.category === 'tech' ? '💻' : course.category === 'business' ? '📱' : course.category === 'agri' ? '🌾' : '☀️'}
              </div>
              <h4 style={{ margin: '0.5rem 0 0 0', fontSize: '1.05rem' }}>{course.title}</h4>
            </div>

            <div style={{ padding: '1rem' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.85rem', color: '#666', marginBottom: '0.5rem' }}>
                <span>⏱️ {course.duration}</span>
                <span>⭐ {course.rating} / 5</span>
              </div>

              <p style={{ fontSize: '0.88rem', color: '#444', height: '42px', overflow: 'hidden' }}>
                {course.description}
              </p>

              <small style={{ color: '#00796b', fontWeight: 'bold' }}>Instructor: {course.instructor}</small>

              <div style={{ marginTop: '1rem', display: 'flex', gap: '0.5rem' }}>
                {enrolledMap[course.id] ? (
                  <button 
                    onClick={() => setActiveCourse(course)}
                    style={{ flex: 1, padding: '0.5rem', background: '#00796b', color: '#fff', border: 'none', borderRadius: '4px', cursor: 'pointer', fontWeight: 'bold' }}
                  >
                    ▶️ Resume Learning
                  </button>
                ) : (
                  <button 
                    onClick={() => handleEnroll(course.id)}
                    style={{ flex: 1, padding: '0.5rem', background: '#e0f2f1', color: '#004d40', border: '1px solid #80cbc4', borderRadius: '4px', cursor: 'pointer', fontWeight: 'bold' }}
                  >
                    Free Enroll
                  </button>
                )}
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Video Player Modal */}
      {activeCourse && (
        <div style={{ position: 'fixed', top: 0, left: 0, right: 0, bottom: 0, background: 'rgba(0,0,0,0.7)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 1000 }}>
          <div style={{ background: '#fff', padding: '1.5rem', borderRadius: '8px', maxWidth: '650px', width: '90%' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.75rem' }}>
              <h3 style={{ margin: 0, color: '#004d40' }}>{activeCourse.title}</h3>
              <button onClick={() => setActiveCourse(null)} style={{ cursor: 'pointer', fontSize: '1rem' }}>✕ Close</button>
            </div>

            <div style={{ position: 'relative', paddingBottom: '56.25%', height: 0, overflow: 'hidden', borderRadius: '6px', background: '#000' }}>
              <iframe 
                style={{ position: 'absolute', top: 0, left: 0, width: '100%', height: '100%', border: 0 }}
                src={`https://www.youtube.com/embed/${activeCourse.youtubeVideoId}`}
                title={activeCourse.title}
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                allowFullScreen
              />
            </div>

            <div style={{ marginTop: '1rem', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <span style={{ fontSize: '0.85rem', color: '#666' }}>Progress: Module 1 of {activeCourse.modulesCount}</span>
              <button onClick={() => alert('Module 1 marked complete!')} style={{ padding: '0.4rem 0.8rem', background: '#00796b', color: '#fff', border: 'none', borderRadius: '4px', cursor: 'pointer' }}>
                Next Module ➔
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
