import React, { useState, useEffect, useRef } from "react";
import {
  CheckCircle,
  Award,
  ShieldCheck,
  MessageSquarePlus,
  Calendar,
} from "lucide-react";
import { supabase } from "../supabaseClient";
import "./consultation.css";
import Footer from "../components/footer"; // <-- import footer

// Local images for carousel
import hero1 from "./assets/consultion1.jpg";
import hero2 from "./assets/consultaion2.jpg";
import hero3 from "./assets/consultaion3.jpg";

const images = [hero1, hero2, hero3];

const indianStates = [
  "Andhra Pradesh",
  "Arunachal Pradesh",
  "Assam",
  "Bihar",
  "Chhattisgarh",
  "Goa",
  "Gujarat",
  "Haryana",
  "Himachal Pradesh",
  "Jharkhand",
  "Karnataka",
  "Kerala",
  "Madhya Pradesh",
  "Maharashtra",
  "Manipur",
  "Meghalaya",
  "Mizoram",
  "Nagaland",
  "Odisha",
  "Punjab",
  "Rajasthan",
  "Sikkim",
  "Tamil Nadu",
  "Telangana",
  "Tripura",
  "Uttar Pradesh",
  "Uttarakhand",
  "West Bengal",
  "Andaman and Nicobar Islands",
  "Chandigarh",
  "Dadra and Nagar Haveli and Daman and Diu",
  "Delhi",
  "Jammu and Kashmir",
  "Ladakh",
  "Lakshadweep",
  "Puducherry",
];

const ConsultationPage = () => {
  const [form, setForm] = useState({
    name: "",
    mobile: "",
    location: "",
  });

  const [currentImg, setCurrentImg] = useState(0);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showSuccess, setShowSuccess] = useState(false);
  const [error, setError] = useState("");
  const intervalRef = useRef();

  useEffect(() => {
    intervalRef.current = setInterval(() => {
      setCurrentImg((prev) => (prev + 1) % images.length);
    }, 4000);
    return () => clearInterval(intervalRef.current);
  }, []);

  // Test database connection on component mount
  useEffect(() => {
    const testConnection = async () => {
      try {
        const { error } = await supabase.from('consultations').select('count', { count: 'exact', head: true });
        if (error) {
          console.error('Database connection test failed:', error);
        } else {
          console.log('Database connection successful');
        }
      } catch (err) {
        console.error('Connection test error:', err);
      }
    };
    testConnection();
  }, []);

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    setError("");

    try {
      // Validate form data
      if (!form.name.trim() || !form.mobile.trim() || !form.location.trim()) {
        throw new Error('Please fill in all required fields');
      }

      // Insert data into Supabase
      const { data, error: supabaseError } = await supabase
        .from('consultations')
        .insert([
          {
            name: form.name.trim(),
            mobile: form.mobile.trim(),
            location: form.location.trim()
          }
        ])
        .select();

      if (supabaseError) {
        console.error('Supabase error details:', supabaseError);
        
        // Handle specific error cases
        if (supabaseError.code === '42P01') {
          throw new Error('Database table not found. Please contact support.');
        } else if (supabaseError.code === '23505') {
          throw new Error('This consultation request already exists.');
        } else {
          throw new Error(`Database error: ${supabaseError.message}`);
        }
      }

      console.log('Consultation submitted successfully:', data);
      
      // Success: Show success message
      setIsSubmitting(false);
      setShowSuccess(true);

      // Reset form after 3 seconds
      setTimeout(() => {
        setShowSuccess(false);
        setForm({ name: "", mobile: "", location: "" });
      }, 3000);

    } catch (error) {
      console.error('Error submitting consultation:', error);
      setError(error.message || "Failed to submit consultation. Please try again.");
      setIsSubmitting(false);
    }
  };

  return (
    <div className="page-wrapper">
      <div className="consultation-container">
        {/* Left image carousel */}
        <div className="image-panel">
          <div className="image-carousel-wrapper">
            <img
              key={currentImg}
              src={images[currentImg]}
              alt="Hearing Aid Consultation"
              className="info-image"
            />
          </div>
        </div>

        {/* Right form section */}
        <div className="form-panel">
          <div className="form-card">
            {showSuccess ? (
              <div className="what-next-timeline">
                <h3 className="what-next-title">Thank You!</h3>
                <p className="what-next-subtitle">
                  Here's what will happen next:
                </p>
                <ul>
                  <li className="timeline-item">
                    <div className="timeline-icon">
                      <CheckCircle size={20} />
                    </div>
                    <div className="timeline-content">
                      <h4>Request Received</h4>
                      <p>We've successfully got your details.</p>
                    </div>
                  </li>

                  <li className="timeline-item">
                    <div className="timeline-icon">
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        width="20"
                        height="20"
                        viewBox="0 0 24 24"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="2"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                      >
                        <path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z"></path>
                      </svg>
                    </div>
                    <div className="timeline-content">
                      <h4>Confirmation Call</h4>
                      <p>Expect a call from our team within 24 hours.</p>
                    </div>
                  </li>

                  <li className="timeline-item">
                    <div className="timeline-icon">
                      <Calendar size={20} />
                    </div>
                    <div className="timeline-content">
                      <h4>we'll give you a callback</h4>
                      <p>We'll finalize your consultation slot.</p>
                    </div>
                  </li>
                </ul>
              </div>
            ) : (
              <>
                <div className="form-header">
                  <h1 className="hero-title">Free Hearing Consultation</h1>
                  <p className="info-subtitle">
                    Get a personalized check-up and expert guidance.
                  </p>
                </div>

                {error && (
                  <div className="error-message" style={{
                    backgroundColor: '#fee2e2',
                    border: '1px solid #fecaca',
                    color: '#dc2626',
                    padding: '12px',
                    borderRadius: '8px',
                    marginBottom: '20px',
                    fontSize: '14px'
                  }}>
                    {error}
                  </div>
                )}

                <form onSubmit={handleSubmit}>
                  <div className="input-group">
                    <input
                      id="name"
                      type="text"
                      name="name"
                      value={form.name}
                      onChange={handleChange}
                      required
                      placeholder=" "
                    />
                    <label htmlFor="name">Your Name*</label>
                  </div>

                  <div className="input-group">
                    <input
                      id="mobile"
                      type="tel"
                      name="mobile"
                      value={form.mobile}
                      onChange={handleChange}
                      required
                      placeholder=" "
                    />
                    <label htmlFor="mobile">Mobile Number*</label>
                  </div>

                  <div className="input-group">
                    <select
                      id="location"
                      name="location"
                      value={form.location}
                      onChange={handleChange}
                      required
                    >
                      <option value="">Choose State</option>
                      {indianStates.map((state) => (
                        <option key={state} value={state}>
                          {state}
                        </option>
                      ))}
                    </select>
                    <label htmlFor="location" className="select-label">
                      Location
                    </label>
                  </div>

                  <button
                    type="submit"
                    className="submit-button"
                    disabled={isSubmitting}
                  >
                    {isSubmitting ? "Submitting..." : "Give a CallBack"}
                  </button>
                </form>

                <div className="key-benefits">
                  <div className="benefit-item">
                    <Award size={20} />
                    <span>Certified Experts</span>
                  </div>
                  <div className="benefit-item">
                    <ShieldCheck size={20} />
                    <span>No Obligation</span>
                  </div>
                  <div className="benefit-item">
                    <MessageSquarePlus size={20} />
                    <span>Free Guidance</span>
                  </div>
                </div>
              </>
            )}
          </div>
        </div>
      </div>
        <Footer />

    </div>
  );
};

export default ConsultationPage;
