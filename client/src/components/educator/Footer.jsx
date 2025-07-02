import React from 'react';
import { assets } from '../../assets/assets';

const Footer = () => {
  return (
    <footer className="flex md:flex-row flex-col-reverse items-center justify-between text-left w-full px-8 border-t border-emerald-100 bg-emerald-50 py-4">
      {/* Left Side: Logo + Copyright */}
      <div className='flex items-center gap-4'>
        <img className='hidden md:block w-20' src={assets.logo} alt="logo" />
        <div className='hidden md:block h-7 w-px bg-gray-400/50'></div> {/* light divider */}
        <p className="text-xs md:text-sm text-gray-600">
          Copyright 2025 © ElevateX. All Rights Reserved.
        </p>
      </div>

      {/* Right Side: Social Icons */}
      <div className='flex items-center gap-3 max-md:mb-4'>
        <a href="#" className="hover:scale-110 transition-transform">
          <img src={assets.facebook_icon} alt="facebook_icon" />
        </a>
        <a href="#" className="hover:scale-110 transition-transform">
          <img src={assets.twitter_icon} alt="twitter_icon" />
        </a>
        <a href="#" className="hover:scale-110 transition-transform">
          <img src={assets.instagram_icon} alt="instagram_icon" />
        </a>
      </div>
    </footer>
  );
};

export default Footer;
