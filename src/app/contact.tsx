import { sendContactEmail } from "./actions/sendContactEmail";

async function legacyContactAction(formData: FormData): Promise<void> {
  "use server";

  const fullName = String(formData.get("name") ?? "").trim();
  const [fname = "", ...rest] = fullName.split(" ");
  const lname = rest.join(" ") || "N/A";

  const mappedFormData = new FormData();
  mappedFormData.set("fname", fname || "Friend");
  mappedFormData.set("lname", lname);
  mappedFormData.set("email", String(formData.get("email") ?? ""));
  mappedFormData.set("phone", "");
  mappedFormData.set("message", String(formData.get("message") ?? ""));

  await sendContactEmail({ status: "idle", message: "" }, mappedFormData);
}

export default function Home() {
  return (
    <main className="min-h-screen flex items-center justify-center">
      <form
        action={legacyContactAction}
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
