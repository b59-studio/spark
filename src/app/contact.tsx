import { sendContactEmail } from "./actions/sendContactEmail";

export default function Home() {
  return (
    <main className="min-h-screen flex items-center justify-center">
      <form
        action={sendContactEmail}
        className="flex flex-col gap-4 w-96"
      >
        <input name="name" placeholder="Name" required />
        <input name="email" type="email" placeholder="Email" required />
        <textarea name="message" placeholder="Message" required />
        <button type="submit">Send</button>
      </form>
    </main>
  );
}
