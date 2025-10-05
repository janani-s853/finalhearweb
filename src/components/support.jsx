import React, { useState } from 'react';
import './support.css';
import {
  FaUser,
  FaClipboardList,
  FaFilePdf,
  FaPhoneAlt,
} from 'react-icons/fa';
import hearingImage from './assets/hearingicon.jpg';
import { Link } from 'react-router-dom';
import { supabase } from '../supabaseClient';
import Footer from '../components/footer'; // ✅ Import Footer

const supportItems = [
  { icon: <FaUser />, title: 'My Account', description: 'Manage your hearing aid account and settings.', type: 'link', path: '/profile' },
  { icon: <FaClipboardList />, title: 'Orders', description: 'Track, modify or cancel your hearing aid orders.', type: 'none' },
  { icon: <FaFilePdf />, title: 'Product Manuals', description: 'Download guides and user manuals in PDF format.', type: 'none' },
  { icon: <FaPhoneAlt />, title: 'Contact Us', description: 'Call, email or visit one of our nearby support centers.', type: 'none' },
  { icon: <FaClipboardList />, title: 'Non-order Related Issues', description: 'Get help with your account related issues.', type: 'none' },
  { icon: <FaFilePdf />, title: `FAQ's`, description: 'Find answers to the most common questions about our services.', type: 'scroll', path: 'faq-section' },
];

const faqs = [
  { question: 'How to track my order?', answer: 'Use the tracking ID sent to your email.' },
  { question: 'What is the return policy?', answer: 'Returns accepted within 30 days.' },
  { question: 'Do you offer international shipping?', answer: 'Yes, with additional charges.' },
];

const Support = () => {
  const [activeFAQ, setActiveFAQ] = useState(null);
  const [feedbackForm, setFeedbackForm] = useState({
    name: '',
    email: '',
    feedback: ''
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitMessage, setSubmitMessage] = useState('');

  const handleFeedbackChange = (e) => {
    setFeedbackForm({
      ...feedbackForm,
      [e.target.name]: e.target.value
    });
  };

  const handleFeedbackSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    setSubmitMessage('');

    try {
      console.log('Submitting feedback:', feedbackForm);
      
      const { data, error } = await supabase
        .from('feedback')
        .insert([
          {
            name: feedbackForm.name,
            email: feedbackForm.email,
            feedback: feedbackForm.feedback,
          }
        ])
        .select();

      if (error) {
        console.error('Supabase error:', error);
        throw error;
      }

      console.log('Feedback submitted successfully:', data);
      setSubmitMessage('Thank you for your feedback! We appreciate your input.');
      setFeedbackForm({ name: '', email: '', feedback: '' });
    } catch (error) {
      console.error('Error submitting feedback:', error);
      
      let errorMessage = 'Failed to submit feedback. Please try again.';
      
      if (error.message.includes('new row violates row-level security')) {
        errorMessage = 'Permission denied. Please check if you need to be logged in.';
      } else if (error.code === 'PGRST301') {
        errorMessage = 'Feedback system unavailable. Please contact support directly.';
      } else if (error.message.includes('column') && error.message.includes('does not exist')) {
        errorMessage = 'System configuration error. Please contact support.';
      } else if (error.message.includes('table') && error.message.includes('does not exist')) {
        errorMessage = 'Feedback system not configured. Please contact support.';
      } else if (error.message) {
        errorMessage = `Error: ${error.message}`;
      }
      
      setSubmitMessage(errorMessage);
    } finally {
      setIsSubmitting(false);
    }
  };

  const toggleFAQ = (index) => {
    setActiveFAQ(activeFAQ === index ? null : index);
  };

  const handleScrollTo = (elementId) => {
    document.getElementById(elementId)?.scrollIntoView({ behavior: 'smooth' });
  };

  return (
    <div className="support-page">
      <div className="support-page-wrapper">
        <div className="hero-bg">
          <div className="support-header">
            <h1>We’re here to help</h1>
            <input type="text" placeholder="Search for help..." className="search-input" />
          </div>
        </div>
        <div className="support-main-content">
          <div className="top-card-row">
            {supportItems.map((item, index) => {
              const cardContent = (
                <>
                  <div className="icon-circle">{item.icon}</div>
                  <h3 className="card-title">{item.title}</h3>
                  <p className="card-desc">{item.description}</p>
                </>
              );

              if (item.type === 'link') {
                return (
                  <Link to={item.path} key={index} className="support-card-link">
                    <div className="support-card">{cardContent}</div>
                  </Link>
                );
              }
              if (item.type === 'scroll') {
                return (
                  <div key={index} className="support-card" onClick={() => handleScrollTo(item.path)}>
                    {cardContent}
                  </div>
                );
              }
              return (
                <div key={index} className="support-card inactive">
                  {cardContent}
                </div>
              );
            })}
          </div>
        </div>
        <div className="hearing-feedback-section">
          <div className="hearing-image-section">
            <img src={hearingImage} alt="Hearing Aid" />
          </div>
          <div className="feedback-form-section">
            <h3>Submit Your Feedback</h3>
            {submitMessage && (
              <div style={{
                backgroundColor: submitMessage.includes('Thank you') ? '#d1fae5' : '#fee2e2',
                border: submitMessage.includes('Thank you') ? '1px solid #6ee7b7' : '1px solid #fecaca',
                color: submitMessage.includes('Thank you') ? '#065f46' : '#dc2626',
                padding: '12px',
                borderRadius: '8px',
                marginBottom: '15px',
                fontSize: '14px'
              }}>
                {submitMessage}
              </div>
            )}
            <form onSubmit={handleFeedbackSubmit}>
              <input 
                type="text" 
                name="name"
                placeholder="Your Name" 
                value={feedbackForm.name}
                onChange={handleFeedbackChange}
                required 
              />
              <input 
                type="email" 
                name="email"
                placeholder="Your Email" 
                value={feedbackForm.email}
                onChange={handleFeedbackChange}
                required 
              />
              <textarea 
                name="feedback"
                placeholder="Your Feedback" 
                rows="4" 
                value={feedbackForm.feedback}
                onChange={handleFeedbackChange}
                required
              ></textarea>
              <button type="submit" disabled={isSubmitting}>
                {isSubmitting ? 'Sending...' : 'Send Feedback'}
              </button>
            </form>
          </div>
        </div>
        <div className="support-main-content pb-0">
          <div id="faq-section" className="faq-section">
            <h2>Frequently Asked Questions</h2>
            {faqs.map((faq, index) => (
              <div
                className="faq-item"
                key={index}
                onClick={() => toggleFAQ(index)}
              >
                <div className="faq-question">
                  {faq.question}
                  <span className="faq-toggle-icon">
                    {activeFAQ === index ? '-' : '+'}
                  </span>
                </div>
                {activeFAQ === index && <div className="faq-answer">{faq.answer}</div>}
              </div>
            ))}
          </div>
        </div>
      </div>
      <Footer />
    </div>
  );
};

export default Support;

