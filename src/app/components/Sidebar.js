import Search from "./Search";
import Category2 from "./Category2";
import Category3 from "./Category3";

export default function Sidebar({handleCategoryClick, isDrawerOpen, activeCategory, setPosition}) {
    return (
        <div>
                  {/* Sidebar */}
      <div
        className={`fixed top-[4rem] left-0 h-[calc(100vh-4rem)] w-[620px] bg-base-200 shadow-lg transition-transform duration-300 z-50 flex ${
          isDrawerOpen ? "translate-x-0" : "-translate-x-full"
        }`}
      >
        {/* Left Sidebar (80px) */}
        <div className="w-[80px] bg-base-300 flex flex-col items-center p-6">
          {/* Button 1 */}
          <button
            className={`mb-4 p-2 ${activeCategory === "category1" ? "text-green-300" : "text-white"}`}
            onClick={() => handleCategoryClick("category1")}
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 24 24"
              fill="currentColor"
              className="size-6"
            >
              <path d="M6 3a3 3 0 0 0-3 3v1.5a.75.75 0 0 0 1.5 0V6A1.5 1.5 0 0 1 6 4.5h1.5a.75.75 0 0 0 0-1.5H6ZM16.5 3a.75.75 0 0 0 0 1.5H18A1.5 1.5 0 0 1 19.5 6v1.5a.75.75 0 0 0 1.5 0V6a3 3 0 0 0-3-3h-1.5ZM12 8.25a3.75 3.75 0 1 0 0 7.5 3.75 3.75 0 0 0 0-7.5ZM4.5 16.5a.75.75 0 0 0-1.5 0V18a3 3 0 0 0 3 3h1.5a.75.75 0 0 0 0-1.5H6A1.5 1.5 0 0 1 4.5 18v-1.5ZM21 16.5a.75.75 0 0 0-1.5 0V18a1.5 1.5 0 0 1-1.5 1.5h-1.5a.75.75 0 0 0 0 1.5H18a3 3 0 0 0 3-3v-1.5Z" />
            </svg>
          </button>

          {/* Button 2 */}
          <button
            className={`mb-4 p-2 ${activeCategory === "category2" ? "text-green-300" : "text-white"}`}
            onClick={() => handleCategoryClick("category2")}
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 24 24"
              fill="currentColor"
              className="size-6"
            >
              <path
                fillRule="evenodd"
                d="M2.25 13.5a8.25 8.25 0 0 1 8.25-8.25.75.75 0 0 1 .75.75v6.75H18a.75.75 0 0 1 .75.75 8.25 8.25 0 0 1-16.5 0Z"
                clipRule="evenodd"
              />
              <path
                fillRule="evenodd"
                d="M12.75 3a.75.75 0 0 1 .75-.75 8.25 8.25 0 0 1 8.25 8.25.75.75 0 0 1-.75.75h-7.5a.75.75 0 0 1-.75-.75V3Z"
                clipRule="evenodd"
              />
            </svg>
          </button>

          {/* Button 3 */}
          <button
            className={`mb-4 p-2 ${activeCategory === "category3" ? "text-green-300" : "text-white"}`}
            onClick={() => handleCategoryClick("category3")}
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 24 24"
              fill="currentColor"
              className="size-6"
            >
              <path
                fillRule="evenodd"
                d="M7.5 6a4.5 4.5 0 1 1 9 0 4.5 4.5 0 0 1-9 0ZM3.751 20.105a8.25 8.25 0 0 1 16.498 0 .75.75 0 0 1-.437.695A18.683 18.683 0 0 1 12 22.5c-2.786 0-5.433-.608-7.812-1.7a.75.75 0 0 1-.437-.695z"
                clipRule="evenodd"
              />
            </svg>
          </button>
        </div>

        {/* Right Sidebar content */}
        <div className="flex-1 p-6 bg-base-200">
          {activeCategory === "category1" && <Search setPosition={setPosition} />}
          {activeCategory === "category2" && <Category2 />}
          {activeCategory === "category3" && <Category3 />}
        </div>
      </div>
        </div>
    )
}