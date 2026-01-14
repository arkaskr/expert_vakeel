// src/app/Service/ServiceList.tsx
import { useEffect, useState, useMemo } from "react";
import { useNavigate } from "react-router-dom";
import { serviceAPI, type Service } from "../../services/api";
import { ChevronRight, Loader, Search, ArrowRight } from "lucide-react";

export default function ServiceList() {
    const navigate = useNavigate();
    const [services, setServices] = useState<Service[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [searchQuery, setSearchQuery] = useState("");

    useEffect(() => {
        const loadServices = async () => {
            try {
                setLoading(true);
                setError(null);
                const response = await serviceAPI.getAll();

                if (response.data.success && response.data.data) {
                    setServices(response.data.data);
                } else {
                    throw new Error("Failed to load services");
                }
            } catch (err) {
                console.error("Error loading services:", err);
                setError("Unable to load services. Please try again later.");
            } finally {
                setLoading(false);
            }
        };

        loadServices();
    }, []);

    useEffect(() => {
        const refreshKey = 'service_list_refresh';
        let refreshCount = parseInt(sessionStorage.getItem(refreshKey) || '0');
        const maxRefreshes = 2;

        console.log(`Current refresh count: ${refreshCount}/${maxRefreshes}`);

        if (refreshCount < maxRefreshes) {
            refreshCount++;
            sessionStorage.setItem(refreshKey, refreshCount.toString());

            console.log(`Refreshing page (${refreshCount}/${maxRefreshes})`);

            // Small delay before refresh to ensure component is fully loaded
            const timer = setTimeout(() => {
                window.location.reload();
            }, 500);

            return () => clearTimeout(timer);
        } else {
            // Reset the counter after max refreshes are done
            sessionStorage.removeItem(refreshKey);
            console.log('Reached maximum refreshes, stopping auto-refresh');
        }
    }, []);

    const filteredServices = useMemo(() => {
        if (!searchQuery.trim()) return services;
        const query = searchQuery.toLowerCase();
        return services.filter(
            (service) =>
                service.name.toLowerCase().includes(query) ||
                service.description.toLowerCase().includes(query) ||
                service.categories.some((cat) => cat.toLowerCase().includes(query))
        );
    }, [services, searchQuery]);

    const handleServiceClick = (serviceId: string) => {
        navigate(`/service/${serviceId}`);
    };

    if (loading) {
        return (
            <main className="min-h-[100dvh] bg-white flex items-center justify-center">
                <div className="text-center">
                    <div className="relative mb-4">
                        <div className="absolute inset-0 animate-ping rounded-full bg-blue-100 opacity-75"></div>
                        <Loader className="relative inline-block animate-spin h-10 w-10 text-blue-600" />
                    </div>
                    <p className="text-sm font-medium text-gray-500">Finding the best services for you...</p>
                </div>
            </main>
        );
    }

    if (error) {
        return (
            <main className="min-h-[100dvh] bg-white flex items-center justify-center">
                <div className="text-center max-w-md px-4">
                    <div className="mx-auto mb-6 flex h-20 w-20 items-center justify-center rounded-full bg-red-50">
                        <span className="text-4xl">⚠️</span>
                    </div>
                    <h2 className="mb-2 text-xl font-bold text-gray-900">Something went wrong</h2>
                    <p className="mb-6 text-gray-600">{error}</p>
                    <button
                        onClick={() => window.location.reload()}
                        className="rounded-full bg-black px-8 py-3 text-sm font-semibold text-white transition-transform hover:scale-105 hover:shadow-lg"
                    >
                        Try Again
                    </button>
                </div>
            </main>
        );
    }

    return (
        <main>
            {/* Content Section */}
            <div className="relative mx-auto mt-16 max-w-7xl px-4 pb-20 sm:px-6 lg:px-8">
                {filteredServices.length === 0 ? (
                    <div className="rounded-3xl bg-white p-12 text-center shadow-xl">
                        <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-blue-50">
                            <Search className="h-8 w-8 text-blue-400" />
                        </div>
                        <h3 className="text-lg font-medium text-gray-900">No services found</h3>
                        <p className="mt-2 text-gray-500">
                            We couldn't find any services matching "{searchQuery}". Try a different search term.
                        </p>
                        <button
                            onClick={() => setSearchQuery("")}
                            className="mt-6 text-sm font-semibold text-blue-600 hover:text-blue-500"
                        >
                            Clear Search
                        </button>
                    </div>
                ) : (
                    <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
                        {filteredServices.map((service) => (
                            <div
                                key={service.id}
                                onClick={() => handleServiceClick(service.id)}
                                className="group relative flex flex-col justify-between overflow-hidden rounded-3xl bg-white p-6 shadow-sm transition-all duration-300 hover:-translate-y-1 hover:shadow-xl cursor-pointer border border-gray-100"
                            >
                                <div>
                                    {/* Header with Number/Icon */}
                                    <div className="mb-6 flex items-start justify-between">
                                        <h3 className="mb-1 text-xl font-bold text-gray-900 group-hover:text-blue-600 transition-colors">
                                            {service.name}
                                        </h3>
                                        <div className="rounded-full bg-blue-50 p-2 transition-colors group-hover:bg-blue-100">
                                            <ArrowRight className="h-5 w-5 text-blue-400 transition-colors group-hover:text-blue-600" />
                                        </div>
                                    </div>

                                    {/* Content */}

                                    <p className="mb-6 text-sm leading-relaxed text-gray-500 line-clamp-3">
                                        {service.description}
                                    </p>
                                </div>

                                {/* Footer */}
                                <div>
                                    <div className="mb-6 flex flex-wrap gap-2">
                                        {service.categories.slice(0, 3).map((cat, idx) => (
                                            <span
                                                key={idx}
                                                className="inline-flex items-center rounded-lg bg-blue-50 px-2.5 py-1 text-xs font-medium text-blue-700 ring-1 ring-inset ring-blue-700/10"
                                            >
                                                {cat}
                                            </span>
                                        ))}
                                        {service.categories.length > 3 && (
                                            <span className="inline-flex items-center rounded-lg bg-gray-50 px-2.5 py-1 text-xs font-medium text-gray-600 ring-1 ring-inset ring-gray-500/10">
                                                +{service.categories.length - 3} more
                                            </span>
                                        )}
                                    </div>

                                    <button className="w-full rounded-xl bg-gradient-to-r from-amber-500 to-orange-600  py-3 text-sm font-semibold text-white transition-all hover:from-blue-700 hover:to-indigo-700 hover:shadow-lg active:scale-95 flex items-center justify-center gap-2">
                                        View Details
                                        <ChevronRight className="h-4 w-4" />
                                    </button>
                                </div>
                            </div>
                        ))}
                    </div>
                )}
            </div>
        </main>
    );
}
