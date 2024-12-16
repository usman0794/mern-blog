import { Link } from "react-router-dom";
import { Label, TextInput, Button } from "flowbite-react";

export default function SignUp() {
  return (
    <div className="min-h-screen mt-20">
      <div className="flex p-3 max-w-3xl mx-auto flex-col md:flex-row md:items-center">
        {/* Left Section */}
        <div className="flex-1 mb-8 md:mb-0 md:mr-8">
          <Link
            to="/"
            className="font-bold dark:text-white text-4xl"
          >
            <span className="px-2 py-2 bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500 rounded-lg text-white">
              TechCrunch
            </span>
            Blog
          </Link>
          <p className="mt-4 text-lg text-gray-700 dark:text-gray-300">
            Welcome to TechCrunch Blog
          </p>
        </div>

        {/* Right Section */}
        <div className="flex-1 w-full md:w-1/2">
          <form className="flex flex-col gap-4">
            <div>
              <Label htmlFor="username" value="Your Username" />
              <TextInput type="text" placeholder="Username" id="username" required />
            </div>
            <div>
              <Label htmlFor="email" value="Your Email" />
              <TextInput type="email" placeholder="Email" id="email" required />
            </div>
            <div>
              <Label htmlFor="password" value="Your Password" />
              <TextInput type="password" placeholder="Password" id="password" required />
            </div>
            <Button type="submit" gradientDuoTone="purpleToBlue">
              Sign Up
            </Button>
          </form>
          <div className="flex gap-2 text-sm mt-5">
            <span>Have an account?</span>
            <Link to="/signin" className="text-blue-500">
            Sign In
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
