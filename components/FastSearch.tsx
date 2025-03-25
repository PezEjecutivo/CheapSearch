import React, { useEffect, useState } from "react";
import { ToastContainer, toast, Bounce } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

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

    const copyToClipboard = (url) => {
        navigator.clipboard
            .writeText(url)
            .then(() => {
                toast.success("URL copiada al portapapeles! Pegala y haz la busqueda!");
            })
            .catch((error) => {
                console.error("Error al copiar la URL:", error);
                toast.error("Error al copiar la URL.");
            });
    };

    return (
        <div className="w-1/6 h-auto p-4 bg-gray-800 rounded-lg shadow-md text-right">
            <h2 className="text-xl font-semibold text-white">Búsquedas recientes</h2>
            <ul className="text-white">
                {recentSearches.map((search, index) => (
                    <li
                        key={index}
                        onClick={() => copyToClipboard(search.url)}
                        className="cursor-pointer hover:underline"
                    >
                        {search.title}
                    </li>
                ))}
            </ul>
            <ToastContainer
                position="bottom-right"
                autoClose={2000}
                hideProgressBar={false}
                newestOnTop={false}
                closeOnClick={false}
                rtl={false}
                pauseOnFocusLoss
                draggable
                pauseOnHover
                theme="dark"
                transition={Bounce}
            />
        </div>
    );
};

export default FastSearch;
