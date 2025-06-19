export const NewHero = () => {
  return (
    <section
      id="hero"
      className="min-h-screen flex flex-col justify-center items-center text-center px-6 py-20"
    >
      <div className="container mx-auto">
        <h1 className="text-5xl font-bold text-gray-900 mb-6">
          Streamline Your Workflow, Amplify Your Results.
        </h1>
        <p className="text-xl text-gray-700 max-w-3xl mx-auto mb-10">
          Our intuitive platform empowers you to automate tedious tasks,
          manage complex projects seamlessly, and achieve your strategic
          goals faster than ever before.
        </p>
        <div className="flex flex-col sm:flex-row justify-center items-center gap-4">
          <button
            className="bg-blue-600 text-white font-semibold py-3 px-8 rounded-lg hover:bg-blue-700 transition duration-150 ease-in-out text-lg"
          >
            Get Started Free
          </button>
          <button
            className="bg-transparent text-blue-600 font-semibold py-3 px-8 rounded-lg border-2 border-blue-600 hover:bg-blue-50 transition duration-150 ease-in-out text-lg"
          >
            Watch a Quick Video
          </button>
        </div>
        {/* Visual element (e.g., illustration or product mockup) will go here later */}
        {/* Example: <div className="mt-12 w-full max-w-4xl h-96 bg-gray-200 rounded-lg shadow-xl">Placeholder for Visual</div> */}
      </div>
    </section>
  );
};
