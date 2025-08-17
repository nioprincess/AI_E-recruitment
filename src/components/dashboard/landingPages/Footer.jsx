import React from 'react';

const Footer = () => {
  return (
    <footer className="bg-white dark:bg-gray-900 text-gray-800 dark:text-white px-6 py-12">
      <div className="max-w-7xl mx-auto grid grid-cols-1 grid-cols-2 lg:grid-cols-4 gap-8">
        
        <div>
          <h3 className="text-lg font-semibold mb-4">Platform</h3>
          <ul>
            <li className="text-sm mb-2"><a href="#">Browse Jobs</a></li>
            <li className="text-sm mb-2"><a href="#">Post a Job</a></li>
            <li className="text-sm mb-2"><a href="#">Find Candidates</a></li>
            <li className="text-sm mb-2"><a href="#">Recruiter Dashboard</a></li>
          </ul>
        </div>

        <div>
          <h3 className="text-lg font-semibold mb-4">Company</h3>
          <ul>
            <li className="text-sm mb-2"><a href="#">About Us</a></li>
            <li className="text-sm mb-2"><a href="#">Careers</a></li>
            <li className="text-sm mb-2"><a href="#">Blog</a></li>
            <li className="text-sm mb-2"><a href="#">Press</a></li>
            <li className="text-sm mb-2"><a href="#">Contact</a></li>
          </ul>
        </div>

        <div>
          <h3 className="text-lg font-semibold mb-4">Support</h3>
          <ul>
            <li className="text-sm mb-2"><a href="#">Help Center</a></li>
            <li className="text-sm mb-2"><a href="#">FAQs</a></li>
            <li className="text-sm mb-2"><a href="#">Privacy Policy</a></li>
            <li className="text-sm mb-2"><a href="#">Terms of Service</a></li>
          </ul>
        </div>

        <div>
          <h3 className="text-lg font-semibold mb-4">Stay Connected</h3>
          <ul>
            <li className="text-sm mb-2"><a href="#">LinkedIn</a></li>
            <li className="text-sm mb-2"><a href="#">Twitter</a></li>
            <li className="text-sm mb-2"><a href="#">Facebook</a></li>
            <li className="text-sm mb-2"><a href="#">Newsletter</a></li>
          </ul>
        </div>

      </div>

      <div className="text-center text-sm text-gray-500 dark:text-gray-400 mt-10">
        © {new Date().getFullYear()} YourCompany. All rights reserved.
      </div>
    </footer>
  );
};

export default Footer;
