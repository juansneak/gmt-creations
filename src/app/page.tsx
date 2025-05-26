import ThreeScene from "./components/common/ThreeScene";

export default function Home() {
  return (
    <section className="max-w-4xl mx-auto p-6" style={{ padding: '50px 0 200px 0' }}>
      {/* Title */}
      <h1 className="text-4xl font-extrabold text-center text-sky-600 mb-6">
        GMT Creations
      </h1>

      {/* Introduction */}
      <p className="text-center mb-8">
        At <span className="font-semibold text-sky-500">GMT Creations</span>, we transform ideas into{" "}
        <span className="font-bold">cutting-edge digital solutions</span>.
        As a forward-thinking <span className="text-sky-500 font-medium">IT company</span>,
        we specialize in <span className="font-semibold">software development,
                web applications, cloud solutions, and AI-driven technologies</span> that help businesses thrive.
      </p>

      {/* Mission Section */}
      <div className="mb-8">
        <h2 className="text-2xl font-bold text-sky-600 mb-3">Our Mission</h2>
        <p className="">
          We believe in <span className="font-semibold">innovation, precision, and excellence</span>.
          Our mission is to empower businesses with{" "}
          <span className="font-bold">scalable, secure, and high-performance technology solutions</span>
          that drive growth and efficiency.
        </p>
      </div>

      {/* Services Section */}
      <div className="mb-8">
        <h2 className="text-2xl font-bold text-sky-600 mb-3">What We Do</h2>
        <ul className="space-y-3">
          <li className="flex items-center">
            <span className="text-sky-500 text-xl mr-2">✅</span>
            <span className=""><strong>Custom Software Development</strong> – Tailored solutions designed to fit your business needs.</span>
          </li>
          <li className="flex items-center">
            <span className="text-sky-500 text-xl mr-2">✅</span>
            <span className=""><strong>Web & Mobile Applications</strong> – Stunning, responsive, and user-friendly applications.</span>
          </li>
          <li className="flex items-center">
            <span className="text-sky-500 text-xl mr-2">✅</span>
            <span className=""><strong>Cloud & DevOps Solutions</strong> – Scalable cloud architecture and seamless deployments.</span>
          </li>
          <li className="flex items-center">
            <span className="text-sky-500 text-xl mr-2">✅</span>
            <span className=""><strong>AI & Automation</strong> – Smart technologies that streamline operations and improve decision-making.</span>
          </li>
        </ul>
      </div>

      {/* Why Choose Us Section */}
      <div className="mb-8">
        <h2 className="text-2xl font-bold text-sky-600 mb-3">Why Choose Us?</h2>
        <div className="grid md:grid-cols-2 gap-4">
          <div className="flex items-center p-4 border rounded-lg shadow-sm">
            <span className="text-sky-500 text-2xl mr-3">🚀</span>
            <p className=""><strong>Expert Team</strong> – A group of passionate developers, designers, and strategists.</p>
          </div>
          <div className="flex items-center p-4 border rounded-lg shadow-sm">
            <span className="text-sky-500 text-2xl mr-3">💡</span>
            <p className=""><strong>Innovative Approach</strong> – We leverage the latest technologies to build future-proof solutions.</p>
          </div>
          <div className="flex items-center p-4 border rounded-lg shadow-sm">
            <span className="text-sky-500 text-2xl mr-3">🔒</span>
            <p className=""><strong>Security & Reliability</strong> – Your data and systems are in safe hands.</p>
          </div>
          <div className="flex items-center p-4 border rounded-lg shadow-sm">
            <span className="text-sky-500 text-2xl mr-3">🤝</span>
            <p className=""><strong>Client-Centric Mindset</strong> – We collaborate closely with clients to deliver impactful results.</p>
          </div>
        </div>
      </div>

      {/* Call to Action */}
      <div className="text-center mt-10">
        <p className="mb-4">
          At <span className="font-semibold text-sky-500">GMT Creations</span>, we don’t just build software—we create{" "}
          <span className="font-bold">experiences, opportunities, and digital transformations</span>.
        </p>
        <p className="">
          Whether you're a startup or an enterprise, we're here to help you turn your vision into reality.
        </p>
        <button className="mt-6 px-6 py-3 bg-sky-600 text-white font-bold rounded-lg shadow-lg hover:bg-sky-700 transition-all">
          Let’s Build Something Great Together!
        </button>
      </div>
    </section>
  );
}
