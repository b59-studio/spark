"use client";

import { useActionState } from "react";
import { useFormStatus } from "react-dom";
import { sendContactEmail, type ContactFormState } from "@/app/actions/sendContactEmail";

const initialState: ContactFormState = {
  status: "idle",
  message: "",
};

function SubmitButton() {
  const { pending } = useFormStatus();

  return (
    <button
      type="submit"
      disabled={pending}
      className="btn-secondary disabled:cursor-not-allowed disabled:opacity-70"
    >
      {pending ? "Sending..." : "Send Message"}
    </button>
  );
}

export default function ContactForm() {
  const [state, formAction] = useActionState(sendContactEmail, initialState);

  return (
    <form action={formAction} className="flex flex-col gap-5 w-full max-w-md">
      <div>
        <label htmlFor="inquiry-type" className="form-label block mb-2">
          I am reaching out because...
        </label>
        <select
          name="inquiryType"
          id="inquiry-type"
          required
          className="form-input w-full appearance-none cursor-pointer"
          aria-label="I am reaching out because..."
        >
          <option value="">Select one...</option>
          <option value="coalition-support">Our coalition could use organizing support</option>
          <option value="tool-request">We need a practical tool or resource</option>
          <option value="event-collaboration">We want to collaborate on an event or training</option>
          <option value="partnership">Our organization wants to partner with TX*SPARK</option>
          <option value="feedback">I have feedback on current TX*SPARK resources</option>
          <option value="general">General question or idea</option>
        </select>
        <p className="form-error" aria-live="polite">
          Please choose a reason for contacting us.
        </p>
      </div>

      <div className="grid grid-cols-2 gap-5">
        <div>
          <label htmlFor="fname" className="form-label block mb-2">
            First name
          </label>
          <input
            name="fname"
            id="fname"
            placeholder="e.g. Jane"
            required
            minLength={2}
            pattern="[A-Za-z][A-Za-z' -]{1,}"
            title="First name must have at least 2 letters."
            className="form-input w-full"
          />
          <p className="form-error" aria-live="polite">
            First name must contain at least 2 letters.
          </p>
        </div>
        <div>
          <label htmlFor="lname" className="form-label block mb-2">
            Last name
          </label>
          <input
            name="lname"
            id="lname"
            placeholder="e.g. Smith"
            required
            minLength={2}
            pattern="[A-Za-z][A-Za-z' -]{1,}"
            title="Last name must have at least 2 letters."
            className="form-input w-full"
          />
          <p className="form-error" aria-live="polite">
            Last name must contain at least 2 letters.
          </p>
        </div>
      </div>

      <div>
        <label htmlFor="email" className="form-label block mb-2">
          Email
        </label>
        <input
          name="email"
          id="email"
          type="email"
          placeholder="you@example.com"
          required
          title="Please enter a valid email address (example: you@example.com)."
          className="form-input w-full"
        />
        <p className="form-error" aria-live="polite">
          Please enter a valid email address (example: you@example.com).
        </p>
      </div>

      <div>
        <label htmlFor="organization" className="form-label block mb-2">
          Organization <span className="font-normal">(optional)</span>
        </label>
        <input
          name="organization"
          id="organization"
          placeholder="Your company or organization"
          className="form-input w-full"
        />
      </div>

      <div>
        <label htmlFor="phone" className="form-label block mb-2">
          Phone <span className="font-normal">(optional)</span>
        </label>
        <input
          name="phone"
          id="phone"
          type="tel"
          placeholder="(555) 123-4567"
          inputMode="tel"
          pattern="^(\\+?1[\\s.-]?)?(\\(?\\d{3}\\)?[\\s.-]?)\\d{3}[\\s.-]?\\d{4}$"
          title="Please use a valid phone format, like (555) 123-4567."
          className="form-input w-full"
        />
        <p className="form-error" aria-live="polite">
          Please use a valid phone format, like (555) 123-4567.
        </p>
      </div>

      <div>
        <label htmlFor="message" className="form-label block mb-2">
          Message
        </label>
        <textarea
          name="message"
          id="message"
          placeholder="Your idea, feedback on a platform, or what you'd like to explore..."
          required
          minLength={10}
          title="Please enter at least 10 characters so we can help effectively."
          rows={6}
          className="form-input w-full resize-y min-h-[8rem]"
        />
        <p className="form-error" aria-live="polite">
          Please add at least 10 characters to your message.
        </p>
      </div>

      <SubmitButton />

      {state.status !== "idle" ? (
        <p
          role="status"
          aria-live="polite"
          className={`text-sm ${state.status === "error" ? "text-spark-red" : "text-spark-gold"}`}
        >
          {state.message}
        </p>
      ) : null}
    </form>
  );
}
