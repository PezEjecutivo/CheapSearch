"use client";

import FastSearch from "@/components/FastSearch";
import Cookies from "js-cookie";
import Trends from "@/components/Trends";
import { useState } from "react";

export default function ScrapePage() {
    const [data, setData] = useState(null);
    const [url, setUrl] = useState("");
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);
    const [updateFastSearch, setUpdateFastSearch] = useState(false);

    const handleScrape = async () => {
        setLoading(true);
        setError(null);
        try {
            const response = await fetch(`/api/scrape?url=${encodeURIComponent(url)}`);
            if (!response.ok) {
                throw new Error("Error al obtener los datos. Revisa que sea un enlace valido de instantGaming");
            }
            const result = await response.json();
            setData(result);

            const title = result.title;

            const existingData = Cookies.get("recentSearchs") ? JSON.parse(Cookies.get("recentSearchs")) : [];

            const isDuplicate = existingData.some((search) => search.url === url || search.title === title);

            if (!isDuplicate) {
                existingData.push({ url, title });
                Cookies.set("recentSearchs", JSON.stringify(existingData), { expires: 7 });
            } else {
                console.log("El valor ya existe en las búsquedas recientes.");
            }
        } catch (err) {
            setError(err.message);
        } finally {
            setLoading(false);
            setUpdateFastSearch((prev) => !prev);
        }
    };

    return (
        <div className="min-h-screen bg-cover bg-center opacity-80" style={{ backgroundImage: "url('/pattern.png')" }}>
            <div className="flex justify-between h-screen px-4 py-8 ">
                <Trends />
                <div className="w-1/3 h-auto p-4 bg-gray-800  rounded-lg shadow-md mx-4">
                    <h1 className="text-2xl font-bold text-white text-center mb-4">CheapSearch</h1>
                    <input
                        type="text"
                        value={url}
                        onChange={(e) => setUrl(e.target.value)}
                        placeholder="Ingresa la URL"
                        className="w-full p-2 border border-gray-600 bg-gray-700 text-white rounded mb-4"
                    />
                    <button
                        onClick={handleScrape}
                        disabled={loading}
                        className={`w-full p-2 text-white rounded ${
                            loading ? "bg-gray-600" : "bg-blue-600 hover:bg-blue-700"
                        }`}
                    >
                        {loading ? "Cargando..." : "Scrapear"}
                    </button>

                    {error && <p className="text-red-400 mt-2">{error}</p>}

                    {data && (
                        <div className="mt-4">
                            <h2 className="text-xl font-semibold text-white">Resultado:</h2>
                            {data.imageSrc && (
                                <img src={data.imageSrc} alt="Imagen extraída" className="mt-2 mb-2 rounded" />
                            )}
                            <p className="text-white">Total: {data.total}</p>
                            <p className="text-white">Descuento: {data.discounted}</p>
                            <p className="text-white">Precio de venta: {data.retail}</p>
                        </div>
                    )}
                </div>
                <FastSearch update={updateFastSearch} />
            </div>
        </div>
    );
}
