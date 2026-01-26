import { sendContactEmail } from "@/app/actions/sendContactEmail";

export default function Contact() {
  return (
    <main className="min-h-screen flex flex-col items-center justify-center px-4 py-20">
      <h1 className="heading-lg mb-4 text-center">
        Let's Talk
      </h1>
      <p className="body-lg text-secondary text-center mb-8 max-w-2xl">
        Have a problem worth solving? Want to share an idea for a platform? Need strategic advice? We want to hear from you.
      </p>
      
      <form 
        action={sendContactEmail} 
        className="flex flex-col gap-4 w-full max-w-md"
      >
        <div>
          <label htmlFor="inquiry-type" className="form-label block mb-2">
            What brings you here?
          </label>
          <select 
            name="inquiryType" 
            id="inquiry-type"
            required
            className="form-input w-full"
          >
            <option value="">Select one...</option>
            <option value="civic-problem">I have a civic/public good problem to solve</option>
            <option value="strategic-advice">I need strategic advice for my organization</option>
            <option value="platform-idea">I want to suggest a platform idea</option>
            <option value="partnership">I'm interested in partnering</option>
            <option value="general">General inquiry</option>
            <option value="exploring">Just exploring your work</option>
          </select>
        </div>

        <div className="grid grid-cols-2 gap-4">
          <input 
            name="fname" 
            placeholder="First Name" 
            required 
            className="form-input"
          />
          <input 
            name="lname" 
            placeholder="Last Name" 
            required 
            className="form-input"
          />
        </div>

        <input 
          name="email" 
          type="email" 
          placeholder="Email" 
          required 
          className="form-input"
        />
        
        <input 
          name="organization" 
          placeholder="Organization (optional)" 
          className="form-input"
        />

        <input 
          name="phone" 
          type="tel" 
          placeholder="Phone Number (optional)" 
          className="form-input"
        />

        <textarea 
          name="message" 
          placeholder="Tell us more about what you're working on..." 
          required 
          rows={6}
          className="form-input"
        />

        <button 
          type="submit"
          className="btn-primary"
        >
          Send Message
        </button>
      </form>
    </main>
  );
}