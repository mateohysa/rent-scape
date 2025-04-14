"use client";

export default function Loading() {
  return (
    <div className="h-screen w-full flex flex-col items-center justify-center bg-primary-50">
      <div className="text-center">
        <div className="inline-block h-8 w-8 animate-spin rounded-full border-4 border-solid border-primary-500 border-r-transparent align-[-0.125em] motion-reduce:animate-[spin_1.5s_linear_infinite]" 
          role="status">
          <span className="!absolute !-m-px !h-px !w-px !overflow-hidden !whitespace-nowrap !border-0 !p-0 ![clip:rect(0,0,0,0)]">
            Loading...
          </span>
        </div>
        <h2 className="mt-6 text-2xl font-semibold text-primary-700">
          Loading your content...
        </h2>
        <p className="mt-2 text-primary-500">
          Please wait while we prepare your experience
        </p>
      </div>
    </div>
  );
} 