import React from "react";
import "./teams.css";
import { Linkedin } from "lucide-react";
import { motion } from "framer-motion";
import team1 from "./assets/team1.jpeg";
import team2 from "./assets/team2.jpeg";
import team3 from "./assets/team3.png";
import team4 from "./assets/team4.png";
import team5 from "./assets/team5.png";

const teamMembers = [
  {
    name: "Nitin M",
    position: "CEO & Founder",
    description: "Leading innovation and strategy, driving vision, and fostering a culture of creativity.",
    image: team1,
    linkedin: "https://www.linkedin.com/in/nitin-m-7aa8441b8/",
  },
  {
    name: "J Nandini",
    position: "Co-founder",
    description: "Expert in hearing health, focused on research-driven personalized solutions.",
    image: team2,
    linkedin: "",
  },
  {
    name: "Janani S",
    position: "Technical Team Lead",
    description: "Builds scalable tech, ensuring reliable and user-friendly products.",
    image: team3,
    linkedin: "https://www.linkedin.com/in/janani-s-21b687274/",
  },
  {
    name: "Vishal Pranav",
    position: "Research & Development Lead",
    description: "Drives product innovation and user-centric research for effective solutions.",
    image: team4,
    linkedin: "https://www.linkedin.com/in/vishal-pranav-sivakumar/",
  },
  {
    name: "Shruthi Yuvnuv V",
    position: "Hardware Team Lead",
    description: "Oversees hardware development, ensuring durable and seamless devices.",
    image: team5,
    linkedin: "https://www.linkedin.com/in/shruthi-yuvnuv-23476432a/",
  },
];

const TeamSection = () => {
  return (
    <section className="team-section">
      <h2 className="team-title">Our Team</h2>

<div className="team-carousel">
  {teamMembers.map((member, idx) => (
    <motion.div
      className={`team-card ${idx === 3 ? "highlight-card" : ""}`} // 4th card
      key={idx}
      initial={{ opacity: 0, y: 30 }}
      whileInView={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay: idx * 0.1 }}
      viewport={{ once: true }}
    >
      <div className="team-image-wrapper">
        <img src={member.image} alt={member.name} className="team-image" />
      </div>
      <div className="team-info">
        <h3 className="team-name">{member.name}</h3>
        <p className="team-role">{member.position}</p>
        <p className="team-desc">{member.description}</p>
        {member.linkedin && (
          <div className="team-icons">
            <a href={member.linkedin} target="_blank" rel="noopener noreferrer">
              <Linkedin size={20} color="#0A66C2" />
            </a>
          </div>
        )}
      </div>
    </motion.div>
  ))}
</div>

    </section>
  );
};

export default TeamSection;
