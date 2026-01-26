export default function About() {
  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
      <div className="space-y-16">
        
        <section>
          <h1 className="heading-xl mb-6">
            About B<span className="text-b59-blue">-</span>59
          </h1>
          <div className="body-lg space-y-4">
            <p>
              B<span className="text-b59-blue">-</span>59 Studio is a design consultancy focused on building and operating public-interest platforms.
            </p>
            <p>
              We help organizations navigate moments where the systems around them are strained, incomplete, or falling behind.
            </p>
            <p>
              Our guiding principle is simple: systems matter, but only when they're <i>Human<span className="text-b59-blue">-</span>Centered</i>.
            </p>
          </div>
        </section>

        <section>
          <h2 className="heading-lg mb-6">
            What does B<span className="text-b59-blue">-</span>59 mean?
          </h2>
          <div className="body-lg space-y-4">
            <p>
              In 1962, <a href="https://en.wikipedia.org/wiki/Soviet_submarine_B-59" className="text-link font-semibold">Soviet submarine B<span className="text-b59-blue">-</span>59</a> was pursued off the coast of Cuba by the US Navy.
            </p>
            <p>
              Cut off from communication and operating under faulty assumptions, the crew came close to launching a nuclear weapon. <a href="https://en.wikipedia.org/wiki/Vasily_Arkhipov" className="text-link font-semibold">Vice Admiral Vasili Arkhipov</a> chose restraint instead.
            </p>
            <p>
              That single act of human judgment changed the world for the better.
            </p>
            <p>
              We chose the name to honor Vice Admiral Arkhipov and acknowledge a truth that extends to modern work: unanticipated events happen, systems break down, and the most important decisions are often made under stress with incomplete information.
            </p>
            <p className="quote">
              B<span className="text-b59-blue">-</span>59 exists to be the human in the loop when it matters most.
            </p>
          </div>
        </section>

        <section>
          <h2 className="heading-lg mb-6">
            What We Do
          </h2>
          <div className="body-lg space-y-4">
            <p>
              We work with leaders and institutions facing high-stakes decisions under uncertainty, spanning from civic technology development, to service design, operations modernization, brand strategy, and more.
            </p>
            <p>Our role is to help teams:</p>
            <ul className="list-disc pl-6 space-y-2 text-secondary">
              <li>Understand the systems they're operating within</li>
              <li>Identify where those systems fall short</li>
              <li>Make clear, defensible decisions when the "right" answer isn't obvious</li>
            </ul>
            <p>
              We don't optimize for trends, speed, or attention. We optimize for clarity, accountability, and long-term results.
            </p>
            <p>
              Being <i>Human<span className="text-b59-blue">-</span>Centered</i> isn't a design aesthetic. It's an operating stance.
            </p>
            <div className="pt-4">
              <a href="/contact" className="btn-primary">
                How can we help you?
              </a>
            </div>
          </div>
        </section>

      </div>
    </div>
  );
}