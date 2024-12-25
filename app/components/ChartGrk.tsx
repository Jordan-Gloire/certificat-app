import React from "react";

export default function ChartGrk() {
  return (
    <>
      {/* <!-- Card --> */}
      <div className="p-4 md:p-5 min-h-[410px] flex flex-col bg-white border shadow-sm rounded-xl dark:bg-neutral-800 dark:border-neutral-700">
        {/* <!-- Header --> */}
        <div className="flex justify-between items-center">
          <div>
            <h2 className="text-sm text-gray-500 dark:text-neutral-500">
              Visitors
            </h2>
            <p className="text-xl sm:text-2xl font-medium text-gray-800 dark:text-neutral-200">
              80.3k
            </p>
          </div>
          <div>
            <span className="py-[5px] px-1.5 inline-flex items-center gap-x-1 text-xs font-medium rounded-md bg-red-100 text-red-800 dark:bg-red-500/10 dark:text-red-500">
              <svg
                className="inline-block size-3.5"
                xmlns="http://www.w3.org/2000/svg"
                width="24"
                height="24"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <path d="M12 5v14" />
                <path d="m19 12-7 7-7-7" />
              </svg>
              2%
            </span>
          </div>
        </div>
        {/* <!-- End Header --> */}

        <div id="hs-single-area-chart"></div>
      </div>
      {/* <!-- End Card --> */}
    </>
  );
}
