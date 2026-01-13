import React from "react";
import { Link } from "react-router-dom";

export default function NotFound() {
  return (
    <div
      className="min-h-screen flex items-center justify-center px-4"
      style={{
        background: "linear-gradient(to bottom right, #fff1f2, #ffe0e2)",
      }}
    >
      <div className="max-w-2xl w-full text-center">
        <div className="mb-8">
          <h1 className="text-9xl font-bold mb-4" style={{ color: "#ec1c24" }}>
            404
          </h1>
          <h2 className="text-4xl font-semibold text-gray-800 mb-4">
            Page Not Found
          </h2>
          <p className="text-lg text-gray-600 mb-8">
            Oops! The page you're looking for doesn't exist. It might have been
            moved or deleted.
          </p>
        </div>

        <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
          <Link
            to="/"
            className="inline-flex items-center px-6 py-3 text-white font-semibold rounded-lg shadow-lg transition-colors duration-200"
            style={{ backgroundColor: "#ec1c24" }}
            onMouseEnter={(e) =>
              (e.currentTarget.style.backgroundColor = "#d0161e")
            }
            onMouseLeave={(e) =>
              (e.currentTarget.style.backgroundColor = "#ec1c24")
            }
          >
            <svg
              className="w-5 h-5 mr-2"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6"
              />
            </svg>
            Go to Homepage
          </Link>

          <button
            onClick={() => window.history.back()}
            className="inline-flex items-center px-6 py-3 bg-white font-semibold rounded-lg shadow-lg transition-colors duration-200"
            style={{
              color: "#ec1c24",
              borderWidth: "2px",
              borderColor: "#ec1c24",
            }}
            onMouseEnter={(e) =>
              (e.currentTarget.style.backgroundColor = "#fff1f2")
            }
            onMouseLeave={(e) =>
              (e.currentTarget.style.backgroundColor = "#ffffff")
            }
          >
            <svg
              className="w-5 h-5 mr-2"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M10 19l-7-7m0 0l7-7m-7 7h18"
              />
            </svg>
            Go Back
          </button>
        </div>

        <div className="mt-12">
          <p className="text-sm text-gray-500">
            Need help? Contact our support team or visit our{" "}
            <Link
              to="/about-us"
              className="hover:underline"
              style={{ color: "#ec1c24" }}
            >
              About Us
            </Link>{" "}
            page.
          </p>
        </div>
      </div>
    </div>
  );
}
