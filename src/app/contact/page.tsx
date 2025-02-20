export default function Contact() {
  return (
    <section className="max-w-4xl mx-auto p-6 text-gray-800" style={{ padding: '50px 0 200px 0' }}>
      {/* Title */}
      <h1 className="text-4xl font-extrabold text-center text-blue-600 mb-6">
        Contact Us
      </h1>

      {/* Introduction */}
      <p className="text-lg text-gray-700 text-center mb-8">
        We would love to hear from you! If you have any questions, inquiries, or would like to discuss a project, feel free to reach out.
      </p>

      {/* Contact Details */}
      <div className="grid md:grid-cols-2 gap-6 mb-8">
        {/* Email 1 */}
        <div className="flex items-center p-4 border rounded-lg shadow-sm bg-white">
          <span className="text-blue-500 text-2xl mr-3">📧</span>
          <div>
            <p className="text-gray-700 font-semibold">Email 1</p>
            <a href="mailto:gusmt66@gmail.com" className="text-blue-500 hover:text-blue-700">
              gusmt66@gmail.com
            </a>
          </div>
        </div>
        {/* Email 2 */}
        <div className="flex items-center p-4 border rounded-lg shadow-sm bg-white">
          <span className="text-blue-500 text-2xl mr-3">📧</span>
          <div>
            <p className="text-gray-700 font-semibold">Email 2</p>
            <a href="mailto:juansneak@gmail.com" className="text-blue-500 hover:text-blue-700">
              juansneak@gmail.com
            </a>
          </div>
        </div>
      </div>

      {/* Contact Form Section */}
      <div className="bg-gray-50 p-6 rounded-lg shadow-md">
        <h2 className="text-2xl font-semibold text-blue-600 mb-4">Send Us a Message</h2>

        <form action="#" method="POST" className="space-y-6">
          {/* Name Field */}
          <div>
            <label htmlFor="name" className="block text-gray-700 font-medium mb-2">
              Your Name
            </label>
            <input
              type="text"
              id="name"
              name="name"
              required
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>

          {/* Email Field */}
          <div>
            <label htmlFor="email" className="block text-gray-700 font-medium mb-2">
              Your Email
            </label>
            <input
              type="email"
              id="email"
              name="email"
              required
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>

          {/* Message Field */}
          <div>
            <label htmlFor="message" className="block text-gray-700 font-medium mb-2">
              Your Message
            </label>
            <textarea
              id="message"
              name="message"
              rows="6"
              required
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            ></textarea>
          </div>

          {/* Submit Button */}
          <button
            type="submit"
            className="w-full px-6 py-3 bg-blue-600 text-white font-bold rounded-lg shadow-lg hover:bg-blue-700 transition-all"
          >
            Send Message
          </button>
        </form>
      </div>
    </section>
  );
}

