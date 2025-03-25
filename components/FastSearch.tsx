import React, { useEffect, useState } from "react";

const FastSearch = ({ update }) => {
    const [recentSearches, setRecentSearches] = useState([]);

    useEffect(() => {
        const getRecentSearches = () => {
            const cookieValue = document.cookie
                .split("; ")
                .find((row) => row.startsWith("recentSearchs="))
                ?.split("=")[1];

            if (cookieValue) {
                try {
                    const decodedValue = decodeURIComponent(cookieValue);
                    const searches = JSON.parse(decodedValue);
                    setRecentSearches(searches);
                } catch (error) {
                    console.error("Error parsing recentSearchs cookie:", error);
                }
            }
        };

        getRecentSearches();
    }, [update]);

    return (
        <div className="w-1/6 h-auto p-4 bg-gray-800 rounded-lg shadow-md text-right">
            <h2 className="text-xl font-semibold text-white">Búsquedas recientes</h2>
            <ul className="text-white">
                {recentSearches.map((search, index) => (
                    <li key={index}>
                        <a href={search.url} className="hover:underline">
                            {search.title}
                        </a>
                    </li>
                ))}
            </ul>
        </div>
    );
};

export default FastSearch;
