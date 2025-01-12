import { useSettings } from '@/context/SettingsContext';
import React, { useEffect, useState } from 'react';

const CurrentPageListner = () => {

  const {setCurrentPage} = useSettings()

  // Function to detect the page currently in view
  const detectCurrentPage = () => {
    const allPages = document.querySelectorAll('[data-page-number]');
    let foundPage = null;

    allPages.forEach(page => {
      const rect = page.getBoundingClientRect();
      if (rect.top >= 0 && rect.top <= window.innerHeight) {
        foundPage = page;
      }
    });

    if (foundPage) {
      setCurrentPage(parseInt(foundPage.getAttribute('data-page-number')));
    }
  };

  useEffect(() => {
    // Add scroll event listener
    window.addEventListener('wheel', detectCurrentPage);

    // Clean up the event listener on component unmount
    return () => {
      window.removeEventListener('wheel', detectCurrentPage);
    };
  }, []);



  return null
};

export default CurrentPageListner;
