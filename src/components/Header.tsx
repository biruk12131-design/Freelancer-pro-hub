import { Menu, Moon, Sun, Search } from "lucide-react";
import { useTheme } from "../contexts/ThemeContext";
import { useDataStore } from "../contexts/DataStoreContext";
import { useState, useRef, useEffect } from "react";
import { useNavigate } from "react-router-dom";

interface HeaderProps {
  setSidebarOpen: (open: boolean) => void;
}

export function Header({ setSidebarOpen }: HeaderProps) {
  const { theme, setTheme } = useTheme();
  const { clients, projects, invoices } = useDataStore();
  const navigate = useNavigate();

  const [searchQuery, setSearchQuery] = useState("");
  const [showResults, setShowResults] = useState(false);
  const searchRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (searchRef.current && !searchRef.current.contains(event.target as Node)) {
        setShowResults(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const filteredResults = (() => {
    if (!searchQuery) return [];
    const q = searchQuery.toLowerCase();
    const results = [];

    clients.forEach(c => {
      if (c.firstName.toLowerCase().includes(q) || c.lastName.toLowerCase().includes(q) || c.company.toLowerCase().includes(q)) {
        results.push({ type: "Client", label: `${c.firstName} ${c.lastName} (${c.company})`, url: "/clients" });
      }
    });
    projects.forEach(p => {
      if (p.title.toLowerCase().includes(q)) {
        results.push({ type: "Project", label: p.title, url: "/projects" });
      }
    });
    invoices.forEach(i => {
      if (i.invoiceNumber.toLowerCase().includes(q)) {
        results.push({ type: "Invoice", label: i.invoiceNumber, url: "/invoices" });
      }
    });

    return results.slice(0, 5); // limit to 5 results
  })();

  const handleResultClick = (url: string) => {
    navigate(url);
    setShowResults(false);
    setSearchQuery("");
  };

  return (
    <header className="sticky top-0 z-30 flex h-16 flex-shrink-0 items-center gap-x-4 border-b border-gray-200 dark:border-gray-800 bg-white/80 dark:bg-gray-900/80 px-4 shadow-sm backdrop-blur-sm sm:gap-x-6 sm:px-6 lg:px-8">
      <button
        type="button"
        className="-m-2.5 p-2.5 text-gray-700 dark:text-gray-300 md:hidden"
        onClick={() => setSidebarOpen(true)}
      >
        <span className="sr-only">Open sidebar</span>
        <Menu className="h-6 w-6" aria-hidden="true" />
      </button>

      {/* Separator */}
      <div className="h-6 w-px bg-gray-200 dark:bg-gray-800 md:hidden" aria-hidden="true" />

      <div className="flex flex-1 gap-x-4 self-stretch lg:gap-x-6">
        <div className="flex flex-1 items-center" ref={searchRef}>
           <div className="relative w-full max-w-md">
             <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3">
                <Search className="h-5 w-5 text-gray-400" aria-hidden="true" />
             </div>
             <input
                type="text"
                className="block w-full rounded-md border-0 py-1.5 pl-10 pr-3 text-gray-900 dark:text-gray-100 bg-gray-50 dark:bg-gray-800 ring-1 ring-inset ring-gray-300 dark:ring-gray-700 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
                placeholder="Search clients, projects, or invoices..."
                value={searchQuery}
                onChange={(e) => {
                  setSearchQuery(e.target.value);
                  setShowResults(true);
                }}
                onFocus={() => setShowResults(true)}
             />
             
             {showResults && searchQuery && (
               <div className="absolute top-full left-0 z-50 mt-1 w-full rounded-md bg-white dark:bg-gray-800 shadow-lg ring-1 ring-black ring-opacity-5 overflow-hidden">
                 {filteredResults.length > 0 ? (
                   <ul className="max-h-60 overflow-auto py-1 text-sm">
                     {filteredResults.map((result, idx) => (
                       <li 
                         key={idx}
                         onClick={() => handleResultClick(result.url)}
                         className="cursor-pointer px-4 py-2 hover:bg-gray-100 dark:hover:bg-gray-700"
                       >
                         <span className="font-medium text-indigo-600 dark:text-indigo-400 mr-2">{result.type}</span>
                         {result.label}
                       </li>
                     ))}
                   </ul>
                 ) : (
                   <div className="px-4 py-3 text-sm text-gray-500">No results found.</div>
                 )}
               </div>
             )}
           </div>
        </div>
        <div className="flex items-center gap-x-4 lg:gap-x-6">
          <button
            type="button"
            className="-m-2.5 p-2.5 text-gray-400 hover:text-gray-500 dark:hover:text-gray-300"
            onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
          >
            <span className="sr-only">Toggle dark mode</span>
            {theme === "dark" ? (
              <Sun className="h-5 w-5" aria-hidden="true" />
            ) : (
              <Moon className="h-5 w-5" aria-hidden="true" />
            )}
          </button>

          {/* Separator */}
          <div
            className="hidden lg:block lg:h-6 lg:w-px lg:bg-gray-200 dark:lg:bg-gray-800"
            aria-hidden="true"
          />

          {/* Profile dropdown Placeholder */}
          <div className="flex items-center gap-x-4">
            <span className="sr-only">Your profile</span>
            <img
              className="h-8 w-8 rounded-full bg-gray-50"
              src={`https://api.dicebear.com/9.x/notionists/svg?seed=Alex&backgroundColor=transparent`}
              alt="Avatar"
            />
          </div>
        </div>
      </div>
    </header>
  );
}
