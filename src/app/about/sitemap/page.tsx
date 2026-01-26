export default function SiteMap() {
  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
      <div className="text-center">
        <h1 className="text-5xl md:text-7xl font-bold mb-6">
          B<span className="text-b59-blue">-</span>59
        </h1>
        <p className="heading-lg">
          Human<span className="text-b59-blue">-</span>Centered.
        </p>
        <br/>
        <div className="flex gap-4 justify-center flex-wrap">
          <a href="/contact" className="btn-primary">
            Talk to Us
          </a>
          <a href="/about" className="btn-secondary">
            Learn More
          </a>
        </div>
      </div>
    </div>
  );
}