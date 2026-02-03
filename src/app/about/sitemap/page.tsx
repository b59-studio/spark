export default function SiteMap() {
  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
      <div className="text-center">
        <h1 className="heading-xl">
          B<span className="text-b59-blue">-</span>59
        </h1>
        <p className="body-lg">
          Human<span className="text-b59-blue">-</span>Centered.
        </p>
        <br/>
        <div className="flex gap-4 justify-center flex-wrap">
          <a href="/contact" className="btn-secondary">
            Talk to Us
          </a>
          <a href="/about" className="btn-primary">
            Learn More
          </a>
        </div>
      </div>
    </div>
  );
}