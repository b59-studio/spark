import { sendContactEmail } from "@/app/actions/sendContactEmail";

export default function Contact() {
  return (
    <main className="min-h-screen flex flex-col items-center justify-center px-4">
      <h1 className="text-5xl md:text-7xl font-bold mb-6 text-center form-heading">
        Send Us a Message
      </h1>
      <form 
        action={sendContactEmail as any} 
        className="flex flex-col gap-4 w-full max-w-md"
      >
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
        <input 
          name="email" 
          type="email" 
          placeholder="Email" 
          required 
          className="form-input"
        />
        <input 
          name="phone" 
          type="tel" 
          placeholder="Phone Number" 
          required 
          className="form-input"
        />
        <textarea 
          name="message" 
          placeholder="Message" 
          required 
          rows={5}
          className="form-input"
        />
        <button 
          type="submit"
          className="btn-primary"
        >
          Send
        </button>
      </form>
    </main>
  );
}