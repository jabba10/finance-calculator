// components/Contact.jsx
import React, { useState, useRef } from 'react';
import styles from './Contact.module.css';

const Contact = () => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    subject: '',
    message: ''
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitStatus, setSubmitStatus] = useState(null); // 'success' | 'error'

  const buttonRef = useRef(null);

  // Magnetic glow effect on button
  const handleMouseMove = (e) => {
    const el = buttonRef.current;
    if (!el) return;
    const rect = el.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    el.style.setProperty('--x', `${x}px`);
    el.style.setProperty('--y', `${y}px`);
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      const response = await fetch('https://formsubmit.co/ajax/YOUR_EMAIL_HERE', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Accept': 'application/json'
        },
        body: JSON.stringify({
          access_key: 'YOUR_FORMSUBMIT_ACCESS_KEY', // Replace in production
          subject: formData.subject,
          'Full Name': formData.name,
          'Email Address': formData.email,
          Message: formData.message,
          redirect_to: 'https://yourwebsite.com/thank-you' // Optional
        })
      });

      const result = await response.json();

      if (result.success) {
        setSubmitStatus('success');
        setFormData({ name: '', email: '', subject: '', message: '' });
      } else {
        throw new Error(result.message || 'Submission failed');
      }
    } catch (error) {
      console.error('Form submission error:', error);
      setSubmitStatus('error');
    } finally {
      setIsSubmitting(false);
      setTimeout(() => setSubmitStatus(null), 5000);
    }
  };

  return (
    <div className={styles.contactWrapper}>
      {/* Top Spacer (gap above card) */}
      <div className={styles.spacerTop}></div>

      {/* Centered Contact Card */}
      <div className={styles.contactCard}>
        {/* Header inside card */}
        <div className={styles.cardHeader}>
          <h2>We’re Here to Help</h2>
          <p>
            Have questions about our calculators? Drop us a message — we respond within 24 hours.
          </p>
        </div>

        <form className={styles.contactForm} onSubmit={handleSubmit}>
          {/* Success/Error Alerts */}
          {submitStatus === 'success' && (
            <div className={`${styles.alert} ${styles.success}`}>
              ✅ Message sent successfully!
            </div>
          )}
          {submitStatus === 'error' && (
            <div className={`${styles.alert} ${styles.error}`}>
              ❌ Failed to send. Please try again.
            </div>
          )}

          {/* Name Input */}
          <div className={styles.formGroup}>
            <input
              type="text"
              id="name"
              name="name"
              value={formData.name}
              onChange={handleChange}
              placeholder=" "
              required
            />
            <label htmlFor="name">Full Name</label>
          </div>

          {/* Email Input */}
          <div className={styles.formGroup}>
            <input
              type="email"
              id="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              placeholder=" "
              required
            />
            <label htmlFor="email">Email Address</label>
          </div>

          {/* Subject Input */}
          <div className={styles.formGroup}>
            <input
              type="text"
              id="subject"
              name="subject"
              value={formData.subject}
              onChange={handleChange}
              placeholder=" "
              required
            />
            <label htmlFor="subject">Subject</label>
          </div>

          {/* Message Textarea */}
          <div className={`${styles.formGroup} ${styles.textareaGroup}`}>
            <textarea
              id="message"
              name="message"
              value={formData.message}
              onChange={handleChange}
              placeholder=" "
              rows="4"
              required
            ></textarea>
            <label htmlFor="message">Your Message</label>
          </div>

          {/* Submit Button */}
          <button
            ref={buttonRef}
            type="submit"
            disabled={isSubmitting}
            onMouseMove={handleMouseMove}
            className={styles.submitBtn}
          >
            <span className={styles.buttonText}>
              {isSubmitting ? (
                <>
                  <span className={styles.spinner}></span> Sending...
                </>
              ) : (
                'Send Message'
              )}
            </span>
            <span className={styles.arrow}>→</span>
          </button>
        </form>
      </div>

      {/* Bottom Spacer (gap below card) */}
      <div className={styles.spacerBottom}></div>
    </div>
  );
};

export default Contact;