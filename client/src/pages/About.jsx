export default function About() {
  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 flex items-center justify-center">
      <div className="max-w-4xl mx-auto px-6 py-12">
        <div className="text-center">
          <h1 className="text-4xl font-bold text-gray-800 dark:text-white mb-4">
            About <span className="text-teal-500">TechCrunch Blog</span>
          </h1>
          <p className="text-lg text-gray-600 dark:text-gray-300">
            Discover the world of technology, innovation, and creativity.
          </p>
        </div>

        <div className="mt-10 space-y-8">
          <p className="text-lg text-gray-700 dark:text-gray-300 leading-relaxed">
            Welcome to <strong>TechCrunch Blog</strong>, your go-to destination for insightful articles, tutorials, and guides on all things technology. Whether you're a seasoned developer or a curious beginner, we have something for everyone.
          </p>

          <p className="text-lg text-gray-700 dark:text-gray-300 leading-relaxed">
            Our mission is to empower tech enthusiasts and professionals with the knowledge they need to thrive in the digital age. From web development and software engineering to emerging trends and programming languages, we cover it all.
          </p>

          <p className="text-lg text-gray-700 dark:text-gray-300 leading-relaxed">
            At TechCrunch Blog, we believe in making technology accessible to everyone. That's why our content is crafted with clarity, depth, and practicality, ensuring you can apply what you learn in real-world scenarios.
          </p>

          <p className="text-lg text-gray-700 dark:text-gray-300 leading-relaxed">
            Join us on this journey of discovery, and let's build the future together. Stay curious, stay inspired, and keep exploring!
          </p>
        </div>

        <div className="mt-12">
          <img
            src="/public/about-tech.jpg"
            alt="About TechCrunch Blog"
            className="rounded-lg shadow-md mx-auto"
          />
        </div>

        <div className="mt-12 text-center">
          <a
            href="/about"
            className="inline-block px-6 py-3 bg-teal-500 text-white text-lg font-medium rounded-md shadow-md hover:bg-teal-600 transition-all"
          >
            Contact Us
          </a>
        </div>
      </div>
    </div>
  );
}
