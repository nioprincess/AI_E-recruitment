import React, { useState, useEffect } from 'react';
import './HeroSection.css';
import { ChevronRightIcon } from '@heroicons/react/24/solid';

const slides = [
  {
    title: "Hiretrust finds jobs",
    subtitle: "that work for you",
    description: "Create a free profile to access hundreds of jobs",
    button: "Sign up today →"
  },
  {
    title: "Smart hiring, fast results",
    subtitle: "AI-driven recruitment",
    description: "Let intelligent algorithms match you with top roles",
    button: "Get Started →"
  },
  {
    title: "Your dream job awaits",
    subtitle: "We're here to help you find it",
    description: "Reliable matches for serious professionals",
    button: "Explore Now →"
  }
];

const Hero = () => {
  const [index, setIndex] = useState(0);

  // Manual next
  const nextSlide = () => {
    setIndex((prevIndex) => (prevIndex + 1) % slides.length);
  };

  // Auto-slide every 6 seconds
  useEffect(() => {
    const interval = setInterval(() => {
      setIndex((prevIndex) => (prevIndex + 1) % slides.length);
    }, 6000);

    return () => clearInterval(interval);
  }, []);

  const { title, subtitle, description, button } = slides[index];

  return (
    <div
      className="hero-section"
      style={{
        background: "linear-gradient(to bottom, #b3f0ff, #74d9f7)",
        backgroundImage: `
          linear-gradient(to right, rgba(0,0,0,0.15) 3px, transparent 3px),
          linear-gradient(to bottom, rgba(0,0,0,0.15) 3px, transparent 3px),
          linear-gradient(to bottom, #d6e6ef, #62d0f2)
        `,
        backgroundSize: "40px 40px, 40px 40px, cover",
        backgroundBlendMode: "overlay",
        minHeight: "60vh",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        textAlign: "center",
        padding: "2rem",
        position: "relative",
        overflow: "hidden",
      }}
    >
      <div className="hero-content slide-fade">
        <h1>
          {title} <br></br><span className="highlight ">{subtitle}</span>
        </h1>
        <p>{description}</p>
        <a href="#" className="cta-button">{button}</a>
      </div>

      {/* Fixed Next Icon */}
      {/* <button className="next-icon-fixed" onClick={nextSlide}>
        <ChevronRightIcon className="h-6 w-6" />
      </button> */}
    </div>
  );
};

export default Hero;
