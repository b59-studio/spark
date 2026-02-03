import { sendContactEmail } from "@/app/actions/sendContactEmail";

export default function Contact() {
  return (
    <main className="min-h-screen flex flex-col items-center justify-center px-4 py-20">
      <h1 className="heading-xl mb-6 text-center">
        Share your ideas.
      </h1>
      <p className="body-lg text-secondary text-center mb-4 max-w-2xl">
        We build and operate civic technology platforms and sometimes consult.
      </p>
      <p className="body-lg text-secondary text-center mb-8 max-w-2xl">
        Whether you have an idea for a new platform, feedback on something we've built, or a project you'd like to explore<span className="text-b59-blue">—</span>we want to hear from you.
      </p>
      
      <form 
        action={sendContactEmail} 
        className="flex flex-col gap-5 w-full max-w-md"
      >
        <div>
          <label htmlFor="inquiry-type" className="form-label block mb-2">
            I'm reaching out because...
          </label>
          <select 
            name="inquiryType" 
            id="inquiry-type"
            required
            className="form-input w-full appearance-none cursor-pointer"
            aria-label="I'm reaching out because..."
          >
            <option value="">Select one...</option>
            <option value="platform-idea">I have an idea for a civic tech platform or feature</option>
            <option value="feedback">I have feedback on a platform you've built or operate</option>
            <option value="customer-feedback">I'm a user/customer and want to share my experience</option>
            <option value="consulting">My organization needs consulting or wants to partner</option>
            <option value="civic-problem">I have a civic problem I'd like to explore solving together</option>
            <option value="general">Something else</option>
          </select>
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
              className="form-input w-full"
            />
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
              className="form-input w-full"
            />
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
            className="form-input w-full"
          />
        </div>

        <div>
          <label htmlFor="organization" className="form-label block mb-2">
            Organization <span className="text-secondary font-normal">(optional)</span>
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
            Phone <span className="text-secondary font-normal">(optional)</span>
          </label>
          <input 
            name="phone" 
            id="phone"
            type="tel" 
            placeholder="(555) 123-4567"
            className="form-input w-full"
          />
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
            rows={6}
            className="form-input w-full resize-y min-h-[8rem]"
          />
        </div>

        <button 
          type="submit"
          className="btn-secondary"
        >
          Send Message
        </button>
      </form>
    </main>
  );
}