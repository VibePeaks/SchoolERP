import React from 'react';
import { useNavigate } from 'react-router-dom';

const LandingPage: React.FC = () => {
  const navigate = useNavigate();

  return (
    <div className="landing-page">
      {/* Navigation */}
      <nav>
        <div className="logo">
          <i className="fas fa-graduation-cap"></i>
          <span>Vibe<span>Peaks</span> ERP</span>
        </div>
        <div className="nav-links">
          <a href="#features">Features</a>
          <a href="#testimonials">Testimonials</a>
          <a href="#contact">Contact</a>
        </div>
        <div className="nav-buttons">
          <button className="login-btn" onClick={() => navigate('/login')}>Login</button>
          <button className="signup-btn" onClick={() => alert('Signup flow coming soon!')}>Get Started</button>
        </div>
      </nav>
      
      {/* Hero Section */}
      <section className="hero">
        <div className="hero-content">
          <h1>Transform Your School with <span>VibePeaks</span> ERP</h1>
          <p>Modern digital platform for managing all school operations efficiently. Designed by VibePeaks to elevate educational institutions to new heights.</p>
          <div className="hero-buttons">
            <button className="primary-btn" onClick={() => navigate('/login')}>Start Free Trial</button>
            <button className="secondary-btn" onClick={() => alert('Demo scheduled!')}>Schedule a Demo</button>
          </div>
        </div>
        <div className="hero-image">
          <div className="dashboard-preview">
            <div className="preview-header">
              <div className="preview-dots">
                <span className="dot red"></span>
                <span className="dot yellow"></span>
                <span className="dot green"></span>
              </div>
            </div>
            <div className="preview-stats">
              <div className="stat-card">
                <div className="stat-icon blue">
                  <i className="fas fa-users"></i>
                </div>
                <div className="stat-text">
                  <h3>1,254</h3>
                  <p>Students</p>
                </div>
              </div>
              <div className="stat-card">
                <div className="stat-icon purple">
                  <i className="fas fa-chalkboard-teacher"></i>
                </div>
                <div className="stat-text">
                  <h3>68</h3>
                  <p>Teachers</p>
                </div>
              </div>
              <div className="stat-card">
                <div className="stat-icon green">
                  <i className="fas fa-book"></i>
                </div>
                <div className="stat-text">
                  <h3>42</h3>
                  <p>Classes</p>
                </div>
              </div>
            </div>
            <div className="preview-chart">
              <div className="chart-bar" style={{ height: '70%' }}></div>
              <div className="chart-bar" style={{ height: '90%' }}></div>
              <div className="chart-bar" style={{ height: '60%' }}></div>
              <div className="chart-bar" style={{ height: '80%' }}></div>
              <div className="chart-bar" style={{ height: '75%' }}></div>
            </div>
          </div>
        </div>
      </section>
      
      {/* Features Section */}
      <section id="features" className="features">
        <h2>Powerful Features for Modern Schools</h2>
        <p className="subtitle">Designed by VibePeaks to meet all your educational institution's needs</p>
        
        <div className="features-grid">
          <div className="feature-card">
            <div className="feature-icon blue">
              <i className="fas fa-user-graduate"></i>
            </div>
            <h3>Student Management</h3>
            <p>Comprehensive student profiles, attendance tracking, and academic performance monitoring.</p>
          </div>
          
          <div className="feature-card">
            <div className="feature-icon purple">
              <i className="fas fa-book"></i>
            </div>
            <h3>Academic Management</h3>
            <p>Curriculum planning, class scheduling, and exam management made simple.</p>
          </div>
          
          <div className="feature-card">
            <div className="feature-icon green">
              <i className="fas fa-money-bill-wave"></i>
            </div>
            <h3>Fee Management</h3>
            <p>Automated billing, payment tracking, and financial reporting for seamless operations.</p>
          </div>
          
          <div className="feature-card">
            <div className="feature-icon orange">
              <i className="fas fa-calendar-check"></i>
            </div>
            <h3>Attendance Tracking</h3>
            <p>Real-time attendance monitoring with automated notifications for parents and staff.</p>
          </div>
          
          <div className="feature-card">
            <div className="feature-icon teal">
              <i className="fas fa-bus"></i>
            </div>
            <h3>Transport Management</h3>
            <p>Route planning, vehicle tracking, and transportation scheduling for student safety.</p>
          </div>
          
          <div className="feature-card">
            <div className="feature-icon pink">
              <i className="fas fa-shield-alt"></i>
            </div>
            <h3>Role-Based Access</h3>
            <p>Secure access controls for administrators, teachers, students, and parents.</p>
          </div>
        </div>
      </section>
      
      {/* Testimonials */}
      <section id="testimonials" className="testimonials">
        <h2>Trusted by Educational Institutions</h2>
        <p className="subtitle">See what our clients say about VibePeaks School ERP</p>
        
        <div className="testimonial-cards">
          <div className="testimonial-card">
            <div className="testimonial-header">
              <div className="avatar">SJ</div>
              <div className="testimonial-info">
                <h3>Dr. Sarah Johnson</h3>
                <p>Principal, Lincoln High School</p>
              </div>
            </div>
            <p className="testimonial-text">"VibePeaks ERP has transformed how we manage our school. The platform is intuitive and has reduced our administrative workload by 40%."</p>
          </div>
          
          <div className="testimonial-card">
            <div className="testimonial-header">
              <div className="avatar">MR</div>
              <div className="testimonial-info">
                <h3>Michael Rodriguez</h3>
                <p>IT Director, Oakwood Academy</p>
              </div>
            </div>
            <p className="testimonial-text">"The implementation was seamless, and the VibePeaks team provided excellent support throughout. Our teachers love the grade management features."</p>
          </div>
          
          <div className="testimonial-card">
            <div className="testimonial-header">
              <div className="avatar">EC</div>
              <div className="testimonial-info">
                <h3>Emily Chen</h3>
                <p>School Administrator, Riverdale Prep</p>
              </div>
            </div>
            <p className="testimonial-text">"The parent portal has been a game-changer for communication. Attendance tracking and fee management are now effortless."</p>
          </div>
        </div>
      </section>
      
      {/* CTA Section */}
      <section className="cta">
        <h2>Ready to Transform Your School?</h2>
        <p>Join hundreds of educational institutions using VibePeaks ERP to streamline their operations and enhance learning experiences.</p>
        <div className="cta-buttons">
          <button className="primary-btn" onClick={() => navigate('/login')}>Start Free Trial</button>
          <button className="secondary-btn" onClick={() => alert('Demo scheduled!')}>Schedule a Demo</button>
        </div>
      </section>
      
      {/* Footer */}
      <footer id="contact">
        <div className="footer-content">
          <div className="footer-brand">
            <div className="logo">
              <i className="fas fa-graduation-cap"></i>
              <span>Vibe<span>Peaks</span> ERP</span>
            </div>
            <p>Transforming education through innovative technology solutions.</p>
            <div className="social-icons">
              <a href="#"><i className="fab fa-twitter"></i></a>
              <a href="#"><i className="fab fa-linkedin"></i></a>
              <a href="#"><i className="fab fa-facebook"></i></a>
            </div>
          </div>
          
          <div className="footer-links">
            <h3>Solutions</h3>
            <ul>
              <li><a href="#">K-12 Schools</a></li>
              <li><a href="#">Colleges</a></li>
              <li><a href="#">Universities</a></li>
              <li><a href="#">Training Centers</a></li>
            </ul>
          </div>
          
          <div className="footer-links">
            <h3>Company</h3>
            <ul>
              <li><a href="#">About Us</a></li>
              <li><a href="#">Careers</a></li>
              <li><a href="#">Blog</a></li>
              <li><a href="#">Contact</a></li>
            </ul>
          </div>
          
          <div className="footer-contact">
            <h3>Contact</h3>
            <ul>
              <li><i className="fas fa-envelope"></i> support@vibepeaks.com</li>
              <li><i className="fas fa-phone"></i> +1 (555) 123-4567</li>
              <li><i className="fas fa-map-marker-alt"></i> 123 Innovation Drive, Tech City</li>
            </ul>
          </div>
        </div>
        
        <div className="footer-bottom">
          <p>© {new Date().getFullYear()} VibePeaks Technologies. All rights reserved.</p>
        </div>
      </footer>

      {/* Inbuilt CSS */}
      <style>{`
        /* Base Styles */
        * {
          margin: 0;
          padding: 0;
          box-sizing: border-box;
          font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
        }
        
        .landing-page {
          background-color: #f8fafc;
          color: #1e293b;
          line-height: 1.6;
          overflow-x: hidden;
        }
        
        /* Navigation */
        nav {
          display: flex;
          justify-content: space-between;
          align-items: center;
          padding: 20px 40px;
          background-color: #fff;
          box-shadow: 0 2px 10px rgba(0, 0, 0, 0.05);
          position: sticky;
          top: 0;
          z-index: 100;
        }
        
        .logo {
          display: flex;
          align-items: center;
          font-size: 1.8rem;
          font-weight: 700;
        }
        
        .logo i {
          color: #4f46e5;
          margin-right: 10px;
        }
        
        .logo span {
          color: #4f46e5;
        }
        
        .nav-links {
          display: flex;
          gap: 30px;
        }
        
        .nav-links a {
          text-decoration: none;
          color: #475569;
          font-weight: 500;
          transition: color 0.3s;
        }
        
        .nav-links a:hover {
          color: #4f46e5;
        }
        
        .nav-buttons {
          display: flex;
          gap: 15px;
        }
        
        .login-btn, .signup-btn {
          padding: 10px 20px;
          border-radius: 8px;
          font-weight: 500;
          cursor: pointer;
          transition: all 0.3s;
        }
        
        .login-btn {
          background: transparent;
          border: 2px solid #cbd5e1;
          color: #475569;
        }
        
        .login-btn:hover {
          border-color: #4f46e5;
          color: #4f46e5;
        }
        
        .signup-btn {
          background: linear-gradient(135deg, #4f46e5, #7c3aed);
          color: white;
          border: none;
        }
        
        .signup-btn:hover {
          opacity: 0.9;
          transform: translateY(-2px);
          box-shadow: 0 4px 10px rgba(79, 70, 229, 0.3);
        }
        
        /* Hero Section */
        .hero {
          display: flex;
          align-items: center;
          padding: 80px 40px;
          gap: 50px;
          max-width: 1400px;
          margin: 0 auto;
        }
        
        .hero-content {
          flex: 1;
        }
        
        .hero-content h1 {
          font-size: 3.5rem;
          font-weight: 800;
          line-height: 1.2;
          margin-bottom: 20px;
        }
        
        .hero-content h1 span {
          color: #4f46e5;
          position: relative;
        }
        
        .hero-content h1 span::after {
          content: "";
          position: absolute;
          bottom: 5px;
          left: 0;
          width: 100%;
          height: 12px;
          background-color: rgba(79, 70, 229, 0.2);
          z-index: -1;
        }
        
        .hero-content p {
          font-size: 1.2rem;
          color: #475569;
          margin-bottom: 30px;
          max-width: 600px;
        }
        
        .hero-buttons {
          display: flex;
          gap: 20px;
          margin-top: 30px;
        }
        
        .primary-btn, .secondary-btn {
          padding: 14px 32px;
          border-radius: 8px;
          font-weight: 600;
          font-size: 1rem;
          cursor: pointer;
          transition: all 0.3s;
        }
        
        .primary-btn {
          background: linear-gradient(135deg, #4f46e5, #7c3aed);
          color: white;
          border: none;
          box-shadow: 0 4px 15px rgba(79, 70, 229, 0.3);
        }
        
        .primary-btn:hover {
          transform: translateY(-3px);
          box-shadow: 0 6px 20px rgba(79, 70, 229, 0.4);
        }
        
        .secondary-btn {
          background: transparent;
          border: 2px solid #cbd5e1;
          color: #475569;
        }
        
        .secondary-btn:hover {
          border-color: #4f46e5;
          color: #4f46e5;
        }
        
        .hero-image {
          flex: 1;
          display: flex;
          justify-content: center;
        }
        
        .dashboard-preview {
          width: 100%;
          max-width: 500px;
          background: white;
          border-radius: 16px;
          overflow: hidden;
          box-shadow: 0 20px 40px rgba(0, 0, 0, 0.1);
          transform: rotate(3deg);
          transition: transform 0.5s;
        }
        
        .dashboard-preview:hover {
          transform: rotate(1deg) scale(1.02);
        }
        
        .preview-header {
          background: #f1f5f9;
          padding: 15px 20px;
          border-bottom: 1px solid #e2e8f0;
        }
        
        .preview-dots {
          display: flex;
          gap: 8px;
        }
        
        .dot {
          width: 12px;
          height: 12px;
          border-radius: 50%;
        }
        
        .red { background: #f87171; }
        .yellow { background: #fbbf24; }
        .green { background: #34d399; }
        
        .preview-stats {
          display: grid;
          grid-template-columns: repeat(3, 1fr);
          gap: 15px;
          padding: 20px;
          background: white;
        }
        
        .stat-card {
          display: flex;
          align-items: center;
          background: #f8fafc;
          border-radius: 12px;
          padding: 15px;
          box-shadow: 0 4px 6px rgba(0, 0, 0, 0.05);
        }
        
        .stat-icon {
          width: 50px;
          height: 50px;
          border-radius: 12px;
          display: flex;
          align-items: center;
          justify-content: center;
          margin-right: 15px;
          font-size: 1.5rem;
        }
        
        .blue { background: #dbeafe; color: #3b82f6; }
        .purple { background: #ede9fe; color: #8b5cf6; }
        .green { background: #dcfce7; color: #10b981; }
        
        .stat-text h3 {
          font-size: 1.5rem;
          font-weight: 700;
          margin-bottom: 2px;
        }
        
        .stat-text p {
          font-size: 0.9rem;
          color: #64748b;
        }
        
        .preview-chart {
          height: 150px;
          display: flex;
          align-items: flex-end;
          gap: 20px;
          padding: 20px;
          background: linear-gradient(to bottom, #f8fafc, white);
        }
        
        .chart-bar {
          flex: 1;
          background: linear-gradient(to top, #4f46e5, #818cf8);
          border-radius: 8px 8px 0 0;
          max-width: 60px;
          animation: grow 1.5s ease-out;
        }
        
        @keyframes grow {
          from { height: 0; }
          to { height: var(--height); }
        }
        
        /* Features Section */
        .features {
          padding: 100px 40px;
          background: #f1f5f9;
          max-width: 1400px;
          margin: 0 auto;
        }
        
        .features h2, .testimonials h2, .cta h2 {
          text-align: center;
          font-size: 2.5rem;
          font-weight: 800;
          margin-bottom: 15px;
        }
        
        .subtitle {
          text-align: center;
          font-size: 1.2rem;
          color: #64748b;
          max-width: 700px;
          margin: 0 auto 60px;
        }
        
        .features-grid {
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(350px, 1fr));
          gap: 30px;
          max-width: 1200px;
          margin: 0 auto;
        }
        
        .feature-card {
          background: white;
          border-radius: 16px;
          padding: 30px;
          box-shadow: 0 10px 20px rgba(0, 0, 0, 0.05);
          transition: all 0.3s;
        }
        
        .feature-card:hover {
          transform: translateY(-10px);
          box-shadow: 0 15px 30px rgba(0, 0, 0, 0.1);
        }
        
        .feature-icon {
          width: 70px;
          height: 70px;
          border-radius: 16px;
          display: flex;
          align-items: center;
          justify-content: center;
          font-size: 2rem;
          margin-bottom: 25px;
        }
        
        .feature-icon.blue { background: #dbeafe; color: #3b82f6; }
        .feature-icon.purple { background: #ede9fe; color: #8b5cf6; }
        .feature-icon.green { background: #dcfce7; color: #10b981; }
        .feature-icon.orange { background: #ffedd5; color: #f97316; }
        .feature-icon.teal { background: #ccfbf1; color: #0d9488; }
        .feature-icon.pink { background: #fce7f3; color: #ec4899; }
        
        .feature-card h3 {
          font-size: 1.5rem;
          margin-bottom: 15px;
          color: #1e293b;
        }
        
        .feature-card p {
          color: #64748b;
        }
        
        /* Testimonials */
        .testimonials {
          padding: 100px 40px;
          background: white;
          max-width: 1400px;
          margin: 0 auto;
        }
        
        .testimonial-cards {
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(350px, 1fr));
          gap: 30px;
          max-width: 1200px;
          margin: 0 auto;
        }
        
        .testimonial-card {
          background: #f8fafc;
          border-radius: 16px;
          padding: 30px;
          box-shadow: 0 10px 20px rgba(0, 0, 0, 0.05);
          transition: all 0.3s;
        }
        
        .testimonial-card:hover {
          transform: translateY(-5px);
          box-shadow: 0 15px 30px rgba(0, 0, 0, 0.1);
        }
        
        .testimonial-header {
          display: flex;
          align-items: center;
          margin-bottom: 20px;
        }
        
        .avatar {
          width: 60px;
          height: 60px;
          background: linear-gradient(135deg, #4f46e5, #7c3aed);
          color: white;
          border-radius: 50%;
          display: flex;
          align-items: center;
          justify-content: center;
          font-weight: 700;
          font-size: 1.5rem;
          margin-right: 15px;
        }
        
        .testimonial-info h3 {
          font-size: 1.3rem;
          margin-bottom: 5px;
        }
        
        .testimonial-info p {
          color: #64748b;
          font-size: 0.9rem;
        }
        
        .testimonial-text {
          font-style: italic;
          color: #475569;
          position: relative;
          padding-left: 20px;
        }
        
        .testimonial-text::before {
          content: """;
          position: absolute;
          top: -20px;
          left: 0;
          font-size: 5rem;
          color: #e2e8f0;
          font-family: Georgia, serif;
          z-index: 0;
        }
        
        /* CTA Section */
        .cta {
          padding: 100px 40px;
          background: linear-gradient(135deg, #4f46e5, #7c3aed);
          color: white;
          text-align: center;
          max-width: 1400px;
          margin: 0 auto;
        }
        
        .cta h2 {
          font-size: 2.8rem;
          max-width: 700px;
          margin: 0 auto 20px;
        }
        
        .cta p {
          font-size: 1.2rem;
          max-width: 700px;
          margin: 0 auto 40px;
          opacity: 0.9;
        }
        
        .cta-buttons {
          display: flex;
          justify-content: center;
          gap: 20px;
        }
        
        .cta .secondary-btn {
          background: transparent;
          border: 2px solid rgba(255, 255, 255, 0.5);
          color: white;
        }
        
        .cta .secondary-btn:hover {
          background: rgba(255, 255, 255, 0.1);
          border-color: white;
        }
        
        /* Footer */
        footer {
          background: #0f172a;
          color: #cbd5e1;
          padding: 80px 40px 30px;
        }
        
        .footer-content {
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
          gap: 40px;
          max-width: 1200px;
          margin: 0 auto 60px;
        }
        
        .footer-brand .logo {
          font-size: 1.8rem;
          margin-bottom: 20px;
        }
        
        .footer-brand p {
          margin-bottom: 20px;
          line-height: 1.7;
        }
        
        .social-icons {
          display: flex;
          gap: 15px;
        }
        
        .social-icons a {
          width: 40px;
          height: 40px;
          background: rgba(255, 255, 255, 0.1);
          border-radius: 50%;
          display: flex;
          align-items: center;
          justify-content: center;
          color: white;
          transition: all 0.3s;
        }
        
        .social-icons a:hover {
          background: #4f46e5;
          transform: translateY(-3px);
        }
        
        .footer-links h3, .footer-contact h3 {
          font-size: 1.3rem;
          margin-bottom: 20px;
          color: white;
        }
        
        .footer-links ul {
          list-style: none;
        }
        
        .footer-links li {
          margin-bottom: 12px;
        }
        
        .footer-links a {
          color: #94a3b8;
          text-decoration: none;
          transition: color 0.3s;
        }
        
        .footer-links a:hover {
          color: #4f46e5;
        }
        
        .footer-contact ul {
          list-style: none;
        }
        
        .footer-contact li {
          margin-bottom: 15px;
          display: flex;
          align-items: center;
        }
        
        .footer-contact i {
          width: 30px;
          color: #4f46e5;
          font-size: 1.2rem;
        }
        
        .footer-bottom {
          text-align: center;
          padding-top: 30px;
          border-top: 1px solid rgba(255, 255, 255, 0.1);
          max-width: 1200px;
          margin: 0 auto;
          font-size: 0.9rem;
          color: #94a3b8;
        }
        
        /* Responsive Design */
        @media (max-width: 992px) {
          .hero {
            flex-direction: column;
            text-align: center;
          }
          
          .hero-content p {
            margin-left: auto;
            margin-right: auto;
          }
          
          .hero-buttons {
            justify-content: center;
          }
          
          .hero-image {
            width: 100%;
          }
        }
        
        @media (max-width: 768px) {
          nav {
            flex-direction: column;
            gap: 20px;
            padding: 15px 20px;
          }
          
          .nav-links {
            gap: 15px;
          }
          
          .hero {
            padding: 60px 20px;
          }
          
          .hero-content h1 {
            font-size: 2.5rem;
          }
          
          .features, .testimonials, .cta {
            padding: 70px 20px;
          }
          
          .hero-buttons, .cta-buttons {
            flex-direction: column;
            gap: 15px;
          }
          
          .primary-btn, .secondary-btn {
            width: 100%;
          }
        }
        
        @media (max-width: 480px) {
          .nav-links {
            flex-wrap: wrap;
            justify-content: center;
          }
          
          .features-grid, .testimonial-cards {
            grid-template-columns: 1fr;
          }
          
          .footer-content {
            grid-template-columns: 1fr;
          }
        }
      `}</style>
    </div>
  );
};

export default LandingPage;