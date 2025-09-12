import React, { useState } from "react";

const ContactUs = () => {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    message: "",
  });

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log("Form submitted:", formData);
    // 🚀 Here you can connect with backend or email service (e.g., EmailJS)
    alert("Thank you! We'll get back to you soon.");
    setFormData({ name: "", email: "", message: "" });
  };

  return (
    <section id="contact_us" className="bg-gray-50 dark:bg-gray-900 py-16 px-6 sm:px-10 md:px-16 lg:px-20 transition-colors duration-300">
      <div className="max-w-7xl mx-auto">
        {/* Section Title */}
        <div className="text-center mb-12">
          <h2 className="text-4xl font-bold text-gray-900 dark:text-white mb-4">
            Contact Us
          </h2>
          <p className="text-gray-600 dark:text-gray-300 text-lg">
            Have questions or need assistance? We're here to help.  
            Reach out to us and we’ll respond as quickly as possible.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
          {/* Contact Info */}
          <div className="space-y-6">
            <h3 className="text-2xl font-semibold text-gray-900 dark:text-white">
              Get in Touch
            </h3>
            <p className="text-gray-600 dark:text-gray-300">
              You can reach us directly via phone, email, or by filling out the
              form. We look forward to hearing from you.
            </p>
            <div className="space-y-3 text-gray-700 dark:text-gray-300">
              <p>
                <span className="font-semibold">📍 Address:</span> Kigali, Rwanda
              </p>
              <p>
                <span className="font-semibold">📞 Phone:</span> +250 789 123 456
              </p>
              <p>
                <span className="font-semibold">📧 Email:</span>{" "}
                <a
                  href="mailto:info@nexus.com"
                  className="text-blue-600 dark:text-blue-400 hover:underline"
                >
                  info@hiretrust.com
                </a>
              </p>
            </div>
          </div>

          {/* Contact Form */}
          <form
            onSubmit={handleSubmit}
            className="bg-white dark:bg-gray-800 p-6 rounded-xl shadow-lg space-y-6 border border-gray-300 dark:border-gray-700"
          >
            <div>
              <label
                htmlFor="name"
                className="block text-sm font-medium text-gray-700 dark:text-gray-300"
              >
                Your Name
              </label>
              <input
                type="text"
                id="name"
                name="name"
                value={formData.name}
                onChange={handleChange}
                required
                className="mt-1 block w-full px-4 py-2 border rounded-lg shadow-sm
                  border-gray-300 dark:border-gray-700 
                  focus:ring-2 focus:ring-blue-500 focus:outline-none
                  bg-gray-50 dark:bg-gray-700 
                  text-gray-900 dark:text-white"
              />
            </div>

            <div>
              <label
                htmlFor="email"
                className="block text-sm font-medium text-gray-700 dark:text-gray-300"
              >
                Your Email
              </label>
              <input
                type="email"
                id="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                required
                className="mt-1 block w-full px-4 py-2 border rounded-lg shadow-sm
                  border-gray-300 dark:border-gray-700 
                  focus:ring-2 focus:ring-blue-500 focus:outline-none
                  bg-gray-50 dark:bg-gray-700 
                  text-gray-900 dark:text-white"
              />
            </div>

            <div>
              <label
                htmlFor="message"
                className="block text-sm font-medium text-gray-700 dark:text-gray-300"
              >
                Message
              </label>
              <textarea
                id="message"
                name="message"
                rows="4"
                value={formData.message}
                onChange={handleChange}
                required
                className="mt-1 block w-full px-4 py-2 border rounded-lg shadow-sm
                  border-gray-300 dark:border-gray-700 
                  focus:ring-2 focus:ring-blue-500 focus:outline-none
                  bg-gray-50 dark:bg-gray-700 
                  text-gray-900 dark:text-white"
              ></textarea>
            </div>

            <button
              type="submit"
              className="w-full bg-blue-600 hover:bg-blue-700 text-white font-semibold py-2 px-4 rounded-lg transition-colors"
            >
              Send Message
            </button>
          </form>
        </div>
      </div>
    </section>
  );
};

export default ContactUs;
