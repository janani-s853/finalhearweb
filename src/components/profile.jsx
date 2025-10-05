import React, { useState, useEffect } from "react";
import "./profile.css";
import { useNavigate } from "react-router-dom";
import {
  User,
  Calendar,
  Package,
  LogOut,
  FileText,
  Camera,
  Clock,
  ShoppingCart,
} from "lucide-react";
import { supabase } from "../supabaseClient";
import { useAuth } from "../contexts/AuthContext";
import Footer from "./footer";

export default function ProfilePage() {
  const navigate = useNavigate();
  const { user, signOut } = useAuth();
  const [activeTab, setActiveTab] = useState("Profile");
  const [isEditing, setIsEditing] = useState(false);
  const [showPopup, setShowPopup] = useState(false);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const [appointments] = useState([]);
  const [orders] = useState([]);
  const [hearingTests, setHearingTests] = useState([]);
  const [testsLoading, setTestsLoading] = useState(false);

  const [profile, setProfile] = useState({
    name: "",
    email: "",
    gender: "",
    date_of_birth: "",
    address: "",
  });

  const [profilePic, setProfilePic] = useState(null);

  // Load profile data on component mount
  useEffect(() => {
    if (user) {
      loadProfileData();
      loadHearingTests();
    }
  }, [user]);

  const loadHearingTests = async () => {
    try {
      setTestsLoading(true);
      
      if (!user) {
        return;
      }
      
      const { data, error } = await supabase
        .from('hearing_tests')
        .select('*')
        .eq('user_id', user.id)
        .order('test_date', { ascending: false });

      if (error) {
        console.error('Error loading hearing tests:', error);
      } else {
        setHearingTests(data || []);
      }
    } catch (error) {
      console.error('Error loading hearing tests:', error);
    } finally {
      setTestsLoading(false);
    }
  };

  // Test database connection
  useEffect(() => {
    const testConnection = async () => {
      try {
        const { data, error } = await supabase
          .from('profiles')
          .select('count', { count: 'exact', head: true });
        
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

  const loadProfileData = async () => {
    try {
      setLoading(true);
      
      if (!user) {
        setLoading(false);
        return;
      }
      
      const { data, error: fetchError } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', user.id)
        .single();

      if (fetchError && fetchError.code !== 'PGRST116') {
        console.error('Error loading profile:', fetchError);
      }

      if (data) {
        setProfile({
          name: data.full_name || data.name || user.user_metadata?.full_name || "",
          email: data.email || user.email || "",
          gender: data.gender || user.user_metadata?.gender || "",
          date_of_birth: data.date_of_birth || user.user_metadata?.dob || "",
          address: data.address || "",
        });
      } else {
        // Use auth metadata if no database record
        setProfile({
          name: user.user_metadata?.full_name || "",
          email: user.email || "",
          gender: user.user_metadata?.gender || "",
          date_of_birth: user.user_metadata?.dob || "",
          address: "",
        });
      }
    } catch (error) {
      console.error('Error loading profile:', error);
      setError("Failed to load profile data");
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (e) => {
    setProfile({ ...profile, [e.target.name]: e.target.value });
  };

  const handlePicUpload = (e) => {
    const file = e.target.files[0];
    if (file) {
      setProfilePic(URL.createObjectURL(file));
    }
  };

  const handleSave = async () => {
    try {
      setLoading(true);
      setError("");

      if (!user) {
        throw new Error('User not authenticated');
      }

      console.log('Saving profile data:', profile);
      console.log('User ID:', user.id);

      const { data, error: updateError } = await supabase
        .from('profiles')
        .upsert({
          id: user.id,
          user_id: user.id,
          email: profile.email,
          full_name: profile.name,
          gender: profile.gender,
          date_of_birth: profile.date_of_birth,
          address: profile.address,
        })
        .select();

      if (updateError) {
        console.error('Supabase error:', updateError);
        throw updateError;
      }

      console.log('Profile saved successfully:', data);

      setIsEditing(false);
      setShowPopup(true);
      setTimeout(() => setShowPopup(false), 2000);
    } catch (error) {
      console.error('Error saving profile:', error);
      let errorMessage = "Failed to save profile data";
      
      if (error.message.includes('new row violates row-level security')) {
        errorMessage = "Permission denied. Please check your account permissions.";
      } else if (error.message.includes('duplicate key')) {
        errorMessage = "Profile already exists. Trying to update instead.";
      } else if (error.code === 'PGRST301') {
        errorMessage = "Database table not found. Please contact support.";
      } else if (error.message) {
        errorMessage = `Error: ${error.message}`;
      }
      
      setError(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="profile-page">
      {/* Reserved Navbar Space */}
      <div className="navbar-space"></div>

      <div className="profile-layout">
        {/* Sidebar */}
        <aside className="sidebar slide-in">
          <h2 className="sidebar-title">My Account</h2>
          <ul className="menu">
            <li
              className={`menu-item ${activeTab === "Profile" ? "active" : ""}`}
              onClick={() => setActiveTab("Profile")}
            >
              <User size={18} /> Profile
            </li>
            <li
              className={`menu-item ${activeTab === "Appointments" ? "active" : ""
                }`}
              onClick={() => setActiveTab("Appointments")}
            >
              <Calendar size={18} /> My Appointments
            </li>
            <li
              className={`menu-item ${activeTab === "Orders" ? "active" : ""}`}
              onClick={() => setActiveTab("Orders")}
            >
              <Package size={18} /> My Orders
            </li>
            <li
              className={`menu-item ${activeTab === "Tests" ? "active" : ""}`}
              onClick={() => setActiveTab("Tests")}
            >
              <FileText size={18} /> My Hearing Test
            </li>
            <li className="menu-item logout" onClick={() => { signOut(); navigate('/'); }}>
              <LogOut size={18} /> Logout
            </li>
          </ul>
        </aside>

        {/* Main Content */}
        <main className={`profile-content fade-in ${activeTab}`}>
          {activeTab === "Profile" && (
            <>
              <div className="profile-header pop-in">
                <div className="avatar-container">
                  <img
                    src={
                      profilePic ||
                      "https://cdn-icons-png.flaticon.com/512/847/847969.png"
                    }
                    alt="Profile"
                    className="profile-avatar"
                  />
                  <label htmlFor="file-upload" className="upload-icon">
                    <Camera size={18} />
                  </label>
                  <input
                    id="file-upload"
                    type="file"
                    accept="image/*"
                    onChange={handlePicUpload}
                    style={{ display: "none" }}
                  />
                </div>
                <div className="profile-info">
                  <h3>
                    {profile.name || "User"}
                  </h3>
                  <p>{profile.email}</p>
                </div>
              </div>

              {loading && (
                <div style={{ textAlign: 'center', padding: '20px' }}>
                  Loading profile data...
                </div>
              )}

              {error && (
                <div style={{
                  backgroundColor: '#fee2e2',
                  border: '1px solid #fecaca',
                  color: '#dc2626',
                  padding: '12px',
                  borderRadius: '8px',
                  marginBottom: '20px'
                }}>
                  {error}
                </div>
              )}

              <section className="profile-info card-animate">
                <h4 className="info-title">Personal Information</h4>
                <div className="form-grid">
                  <input
                    type="text"
                    name="name"
                    placeholder="Full Name"
                    value={profile.name}
                    onChange={handleChange}
                    disabled={!isEditing}
                  />
                  <input
                    type="email"
                    name="email"
                    placeholder="Email Address"
                    value={profile.email}
                    onChange={handleChange}
                    disabled={!isEditing}
                  />
                  <select
                    name="gender"
                    value={profile.gender}
                    onChange={handleChange}
                    disabled={!isEditing}
                  >
                    <option value="">Select Gender</option>
                    <option value="male">Male</option>
                    <option value="female">Female</option>
                    <option value="other">Other</option>
                  </select>
                  <input
                    type="date"
                    name="date_of_birth"
                    value={profile.date_of_birth}
                    onChange={handleChange}
                    disabled={!isEditing}
                  />
                  <textarea
                    name="address"
                    placeholder="Address"
                    value={profile.address}
                    onChange={handleChange}
                    disabled={!isEditing}
                    rows="3"
                  />
                </div>
                <button
                  className="edit-btn"
                  onClick={() =>
                    isEditing ? handleSave() : setIsEditing(true)
                  }
                >
                  {isEditing ? "Save Changes" : "Edit Profile"}
                </button>
              </section>
            </>
          )}

          {activeTab === "Appointments" &&
            (appointments.length === 0 ? (
              <div className="empty-state fade-in">
                <Calendar size={48} className="empty-state-icon" />
                <h3 className="empty-state-title">
                  No Appointments Available
                </h3>
                <p className="empty-state-text">
                  You don't have any appointments scheduled.
                  <br />
                  Book your first appointment to get started.
                </p>
                <button
                  className="empty-state-btn"
                  onClick={() => navigate("/consultation")}
                >
                  <Clock size={16} /> Book Appointment
                </button>
              </div>
            ) : (
              <h2>Your Appointments</h2>
            ))}

          {activeTab === "Orders" &&
            (orders.length === 0 ? (
              <div className="empty-state fade-in">
                <Package size={48} className="empty-state-icon" />
                <h3 className="empty-state-title">No Orders Found</h3>
                <p className="empty-state-text">
                  You haven't placed any orders yet. Start shopping
                  <br />
                  to see your orders here.
                </p>
                <button className="empty-state-btn">
                  <ShoppingCart size={16} /> Start Shopping
                </button>
              </div>
            ) : (
              <h2>Your Orders</h2>
            ))}

          {activeTab === "Tests" && (
            testsLoading ? (
              <div style={{ textAlign: 'center', padding: '40px' }}>
                Loading your hearing test results...
              </div>
            ) : hearingTests.length > 0 ? (
              <div className="tests-container">
                <h2 style={{ marginBottom: '20px' }}>Your Hearing Test Results</h2>
                {hearingTests.map((test, index) => (
                  <div key={test.id} className="test-card" style={{
                    border: '1px solid #e5e7eb',
                    borderRadius: '8px',
                    padding: '20px',
                    marginBottom: '16px',
                    backgroundColor: '#f9fafb'
                  }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '12px' }}>
                      <h3 style={{ margin: 0, color: '#1f2937' }}>
                        Test #{hearingTests.length - index}
                      </h3>
                      <span style={{ color: '#6b7280', fontSize: '14px' }}>
                        {new Date(test.test_date).toLocaleDateString()}
                      </span>
                    </div>
                    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(150px, 1fr))', gap: '12px' }}>
                      <div>
                        <span style={{ fontWeight: '500', color: '#374151' }}>Overall Score:</span>
                        <br />
                        <span style={{ color: '#059669' }}>{test.overall_score}/11 frequencies heard</span>
                      </div>
                      <div>
                        <span style={{ fontWeight: '500', color: '#374151' }}>Test Type:</span>
                        <br />
                        <span>{test.test_type || 'Online Audiometry'}</span>
                      </div>
                      <div>
                        <span style={{ fontWeight: '500', color: '#374151' }}>Result Category:</span>
                        <br />
                        <span style={{ 
                          color: test.overall_score === 11 ? '#059669' : 
                                test.overall_score >= 8 ? '#d97706' : '#dc2626' 
                        }}>
                          {test.overall_score === 11 ? 'Excellent' : 
                           test.overall_score >= 8 ? 'Mild Loss' : 'Moderate to Severe Loss'}
                        </span>
                      </div>
                    </div>
                  </div>
                ))}
                <button
                  className="empty-state-btn"
                  onClick={() => navigate("/hearingtest")}
                  style={{ marginTop: '20px' }}
                >
                  <FileText size={16} /> Take Another Test
                </button>
              </div>
            ) : (
              <div className="empty-state fade-in">
                <FileText size={48} className="empty-state-icon" />
                <h3 className="empty-state-title">No Previous Tests Found</h3>
                <p className="empty-state-text">
                  You have no saved hearing test results.
                  <br />
                  Take a test to check your hearing health.
                </p>
                <button
                  className="empty-state-btn"
                  onClick={() => navigate("/hearinginfo")}
                >
                  <FileText size={16} /> Take a Hearing Test
                </button>
              </div>
            )
          )}
        </main>
      </div>

      {showPopup && <div className="popup">✅ Changes Saved!</div>}

      <Footer />
    </div>
  );
}