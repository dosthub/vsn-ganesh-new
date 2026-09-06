"use client";
import { useState } from "react";
export function ContactForm() {
  const [submitted, setSubmitted] = useState(false);
  return (
    <form
      className="panel contact-form"
      onSubmit={(e) => {
        e.preventDefault();
        setSubmitted(true);
      }}
    >
      <h2>Leave a message</h2>
      <p className="muted">
        Message functionality will be connected soon. This preview does not send
        or store messages.
      </p>
      <label>
        Your name
        <input
          name="name"
          autoComplete="name"
          required
          placeholder="Enter your name"
        />
      </label>
      <label>
        Email address
        <input
          name="email"
          type="email"
          autoComplete="email"
          required
          placeholder="you@example.com"
        />
      </label>
      <label>
        Message
        <textarea
          name="message"
          rows={5}
          minLength={10}
          required
          placeholder="How can the community committee help?"
        />
      </label>
      <button className="button primary" type="submit">
        Preview message
      </button>
      {submitted && (
        <p className="form-feedback" role="status">
          Your message is ready, but delivery is not connected yet. Nothing has
          been sent or saved.
        </p>
      )}
    </form>
  );
}
