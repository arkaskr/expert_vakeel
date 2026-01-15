"use client";

import { useMemo, useRef, useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { FaHome, FaRegSmile, FaStar } from "react-icons/fa";
import { ChevronDown, X, Check } from "lucide-react";
import TopRatedProfiles from "../components/TopRatedProfiles";
import BrowseByCategory from "../components/BrowseByCategory";
import WhyExpertVakeel from "../components/whyexpertVakeel";
import { queryAPI, publicUserAPI } from "../services/api";
import type { Query } from "../services/api";
import useAuth from "../hooks/useAuth";
import ServiceList from "../app/Service/ServiceList";

// const QUERY_CATEGORIES = [
//   "All",
//   "Civil Matters",
//   "Criminal Matters",
//   "Family Matters",
//   "Labour/Employee Matters",
//   "Taxation Matters",
//   "Business Matters",
//   "Supreme Court Matters",
//   "High Court Matters",
// ];

export default function Home() {
  const navigate = useNavigate();
  const { user } = useAuth();
  const cityDropdownRef = useRef<HTMLDivElement>(null);

  const [category, setCategory] = useState("");
  const [city, setCity] = useState("");
  const [citySearch, setCitySearch] = useState("");
  const [cityDropdownOpen, setCityDropdownOpen] = useState(false);
  const [citySelected, setCitySelected] = useState(false);

  // Dynamic data from API
  const [dynamicCities, setDynamicCities] = useState<string[]>([]);
  const [dynamicCategories, setDynamicCategories] = useState<string[]>([]);
  const [dynamicLoading, setDynamicLoading] = useState(true);

  const onSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const params = new URLSearchParams();
    if (category) params.set("category", category);
    if (city) params.set("city", city);
    navigate(`/findprofile${params.toString() ? `?${params.toString()}` : ""}`);
  };

  const handleCategoryClick = (selectedCategory: string) => {
    navigate(`/findprofile?category=${encodeURIComponent(selectedCategory)}`);
  };

  const handleAnswerQuery = (queryId: string) => {
    if (!user) {
      navigate("/login");
      return;
    }
    navigate(`/queries/${queryId}`);
  };

  // City search functionality
  const filteredCities = useMemo(() => {
    if (!citySearch.trim()) return dynamicCities.slice(0, 5); // Show first 5 if no search

    const regex = new RegExp(
      citySearch.replace(/[.*+?^${}()|[\]\\]/g, "\\$&"),
      "i"
    );
    return dynamicCities.filter((city) => regex.test(city)).slice(0, 5); // Limit to 5 results for better UX
  }, [dynamicCities, citySearch]);

  const handleCityInputChange = (value: string) => {
    setCitySearch(value);
    setCityDropdownOpen(true);
    setCitySelected(false); // Mark as not selected when user types
  };

  const handleCitySelect = (selectedCity: string) => {
    setCity(selectedCity);
    setCitySearch(selectedCity);
    setCityDropdownOpen(false);
    setCitySelected(true); // Mark as selected when chosen from dropdown
  };

  const handleCityInputFocus = () => {
    setCityDropdownOpen(true);
  };

  const handleCityInputBlur = (e: React.FocusEvent) => {
    // Don't close dropdown if clicking on dropdown items
    const relatedTarget = e.relatedTarget as HTMLElement;
    if (
      cityDropdownRef.current &&
      relatedTarget &&
      cityDropdownRef.current.contains(relatedTarget)
    ) {
      return;
    }

    // Delay hiding dropdown to allow click selection
    setTimeout(() => setCityDropdownOpen(false), 200);
  };

  // ------------------------------
  // DYNAMIC DATA FROM API
  // ------------------------------
  useEffect(() => {
    const fetchDynamicData = async () => {
      try {
        setDynamicLoading(true);
        const response = await publicUserAPI.getAll();

        if (response.data.data) {
          const users = response.data.data;

          // Extract unique cities with regex cleanup
          const citiesSet = new Set<string>();
          const categoriesSet = new Set<string>();

          for (const user of users) {
            // Process cities with regex (clean whitespace, remove special chars, normalize)
            if (user.city) {
              const cleanedCity = user.city
                .trim()
                .replace(/\s+/g, " ") // normalize whitespace
                .replace(/[^\w\s-]/g, "") // remove special chars except hyphens
                .replace(/^\s*-\s*|\s*-\s*$/g, "") // remove leading/trailing hyphens
                .trim();

              if (cleanedCity) {
                citiesSet.add(cleanedCity);
              }
            }

            // Extract specializations (categories)
            if (user.specializations?.length) {
              user.specializations.forEach((spec) => {
                if (spec) categoriesSet.add(spec.trim());
              });
            }
          }

          // Sort and set the dynamic data
          setDynamicCities(Array.from(citiesSet).sort());
          setDynamicCategories(Array.from(categoriesSet).sort());
        } else {
          // Fallback to static data if API fails
          setDynamicCities([
            "Chandigarh",
            "Mohali",
            "Panchkula",
            "Delhi",
            "Mumbai",
            "Bengaluru",
            "Kolkata",
            "Chennai",
            "Hyderabad",
            "Pune",
          ]);
          setDynamicCategories([
            "Civil Matters",
            "Criminal Matters",
            "Family Matters",
            "Labour/Employee Matters",
            "Taxation Matters",
            "Documentation & Registration",
            "Trademark & Copyright Matters",
            "High Court Matters",
            "Supreme Court Matters",
            "Forums and Tribunal Matters",
            "Business Matters",
          ]);
        }
      } catch (err) {
        console.error("Error fetching dynamic data:", err);
        // Fallback to static data
        setDynamicCities([
          "Chandigarh",
          "Mohali",
          "Panchkula",
          "Delhi",
          "Mumbai",
          "Bengaluru",
          "Kolkata",
          "Chennai",
          "Hyderabad",
          "Pune",
        ]);
        setDynamicCategories([
          "Civil Matters",
          "Criminal Matters",
          "Family Matters",
          "Labour/Employee Matters",
          "Taxation Matters",
          "Documentation & Registration",
          "Trademark & Copyright Matters",
          "High Court Matters",
          "Supreme Court Matters",
          "Forums and Tribunal Matters",
          "Business Matters",
        ]);
      } finally {
        setDynamicLoading(false);
      }
    };

    fetchDynamicData();
  }, []);

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        cityDropdownRef.current &&
        !cityDropdownRef.current.contains(event.target as Node)
      ) {
        setCityDropdownOpen(false);
      }
    };

    if (cityDropdownOpen) {
      document.addEventListener("mousedown", handleClickOutside);
    }

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [cityDropdownOpen]);

  // ------------------------------
  // DYNAMIC QUERIES STATE
  // ------------------------------
  const [queries, setQueries] = useState<Query[]>([]);
  const [queriesLoading, setQueriesLoading] = useState(true);

  useEffect(() => {
    const fetchQueries = async () => {
      try {
        setQueriesLoading(true);
        const response = await queryAPI.getAll({ limit: 10 });
        if (response.data.success) setQueries(response.data.data);
        else setQueries([]);
      } catch (err) {
        console.error("Error fetching queries:", err);
        setQueries([]);
      } finally {
        setQueriesLoading(false);
      }
    };
    fetchQueries();
  }, []);

  const [selectedCat] = useState<string>("All");
  // const [catOpen, setCatOpen] = useState(false);
  const scrollerRef = useRef<HTMLDivElement>(null);

  const formatTimeAgo = (createdAt: any) => {
    if (!createdAt) return "Recently";
    let date: Date;
    if (createdAt?.toDate) date = createdAt.toDate();
    else if (createdAt instanceof Date) date = createdAt;
    else if (typeof createdAt === "string") date = new Date(createdAt);
    else return "Recently";

    const now = new Date();
    const diffInSeconds = Math.floor((now.getTime() - date.getTime()) / 1000);
    if (diffInSeconds < 60) return "Just now";
    if (diffInSeconds < 3600)
      return `About ${Math.floor(diffInSeconds / 60)} minutes ago`;
    if (diffInSeconds < 86400)
      return `About ${Math.floor(diffInSeconds / 3600)} hours ago`;
    if (diffInSeconds < 604800)
      return `About ${Math.floor(diffInSeconds / 86400)} days ago`;
    return date.toLocaleDateString();
  };

  const determineCategory = (query: Query): string => {
    const text = `${query.title} ${query.description}`.toLowerCase();
    if (
      text.includes("family") ||
      text.includes("divorce") ||
      text.includes("marriage")
    )
      return "Family Matters";
    if (
      text.includes("criminal") ||
      text.includes("bail") ||
      text.includes("police")
    )
      return "Criminal Matters";
    if (
      text.includes("civil") ||
      text.includes("property") ||
      text.includes("contract")
    )
      return "Civil Matters";
    if (text.includes("supreme court")) return "Supreme Court Matters";
    if (text.includes("high court")) return "High Court Matters";
    return "All";
  };

  const processedQueries = useMemo(() => {
    return queries.map((q) => ({
      id: q.id,
      title: q.title,
      description: q.description,
      answers: q.answersCount,
      askedBy: q.askedByName,
      timeAgo: formatTimeAgo(q.createdAt),
      category: determineCategory(q),
    }));
  }, [queries]);

  const filteredQueries = useMemo(() => {
    if (selectedCat === "All") return processedQueries;
    return processedQueries.filter((q) => q.category === selectedCat);
  }, [selectedCat, processedQueries]);

  const scrollBy = (dir: "left" | "right") => {
    const el = scrollerRef.current;
    if (!el) return;
    const amount = Math.min(320, el.clientWidth * 0.9);
    el.scrollBy({
      left: dir === "left" ? -amount : amount,
      behavior: "smooth",
    });
  };

  return (
    <main className="min-h-[100dvh] bg-white pb-safe pt-safe">
      {/* Hero Section */}
      <section className="mx-auto max-w-screen-xl px-4 py-6 sm:px-6 md:py-8">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-center">
          {/* Left Content */}
          <div>
            <h1 className="text-3xl md:text-4xl lg:text-5xl font-bold text-gray-900 leading-tight mb-4">
              Find the Right Legal Expertise
            </h1>
            <p className="text-lg text-gray-600 mb-6">
              Litigation • Advisory • Documentation
            </p>

            {/* Search bar */}
            <form
              onSubmit={onSubmit}
              className="rounded-xl border border-gray-200 bg-white p-4 shadow-sm"
            >
              <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 md:grid-cols-[1fr_1fr_auto] md:gap-4">
                {/* Category */}
                <div className="relative">
                  <select
                    value={category}
                    onChange={(e) => setCategory(e.target.value)}
                    disabled={dynamicLoading}
                    className="h-11 w-full appearance-none rounded-lg bg-white px-3 pr-9 text-sm text-gray-900 outline-none ring-1 ring-gray-200 focus:ring-2 focus:ring-[#FFA800] disabled:opacity-50 disabled:cursor-not-allowed"
                    aria-label="Select category"
                  >
                    <option value="">
                      {dynamicLoading
                        ? "Loading categories..."
                        : "Select Category"}
                    </option>
                    {dynamicCategories.map((cat) => (
                      <option key={cat} value={cat}>
                        {cat}
                      </option>
                    ))}
                  </select>
                  <ChevronDown className="pointer-events-none absolute right-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400" />
                </div>

                {/* City */}
                <div ref={cityDropdownRef} className="relative">
                  <input
                    type="text"
                    value={citySearch}
                    onChange={(e) => handleCityInputChange(e.target.value)}
                    onFocus={handleCityInputFocus}
                    onBlur={handleCityInputBlur}
                    disabled={dynamicLoading}
                    placeholder={
                      dynamicLoading ? "Loading cities..." : "Search City"
                    }
                    className={`h-11 w-full rounded-lg bg-white px-3 pr-16 text-sm outline-none ring-1 ring-gray-200 focus:ring-2 focus:ring-[#FFA800] disabled:opacity-50 disabled:cursor-not-allowed ${
                      citySelected && citySearch
                        ? "text-green-700 font-medium"
                        : "text-gray-900"
                    }`}
                    aria-label="Search city"
                  />
                  {citySearch && !dynamicLoading && (
                    <button
                      type="button"
                      onClick={() => {
                        setCitySearch("");
                        setCity("");
                        setCityDropdownOpen(false);
                        setCitySelected(false);
                      }}
                      className="absolute right-8 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
                      aria-label="Clear city search"
                    >
                      <X size={16} />
                    </button>
                  )}

                  {/* City Dropdown */}
                  {cityDropdownOpen &&
                    !dynamicLoading &&
                    filteredCities.length > 0 && (
                      <div className="absolute top-full z-50 mt-1 w-full max-h-40 overflow-y-auto rounded-lg border border-gray-200 bg-white shadow-lg">
                        {filteredCities.map((c) => (
                          <button
                            key={c}
                            onClick={() => handleCitySelect(c)}
                            className={`w-full px-3 py-2 text-left text-sm hover:bg-gray-50 focus:bg-gray-50 focus:outline-none first:rounded-t-lg last:rounded-b-lg transition-colors flex items-center justify-between ${
                              citySelected && c === city
                                ? "bg-green-50 text-green-700 font-medium"
                                : ""
                            }`}
                          >
                            <span>{c}</span>
                            {citySelected && c === city && (
                              <Check className="h-4 w-4 text-green-600" />
                            )}
                          </button>
                        ))}
                      </div>
                    )}

                  {/* No results message */}
                  {cityDropdownOpen &&
                    !dynamicLoading &&
                    citySearch.trim() &&
                    filteredCities.length === 0 && (
                      <div className="absolute top-full z-50 mt-1 w-full rounded-lg border border-gray-200 bg-white px-3 py-2 text-sm text-gray-500 shadow-lg">
                        No cities found
                      </div>
                    )}
                </div>

                {/* Button */}
                <button
                  type="submit"
                  className="h-11 w-full rounded-lg bg-[#FFA800] px-4 text-sm font-semibold text-black transition hover:bg-[#FFB524] md:min-w-[140px]"
                >
                  Search Now!
                </button>
              </div>
            </form>

            {/* Highlights */}
            <div className="mt-6 flex flex-wrap items-center gap-3">
              <div className="flex items-center gap-2 rounded-full bg-gray-100 px-4 py-2">
                <FaHome className="text-[#EC6325]" />
                <span className="text-sm font-medium">2M+ Profiles</span>
              </div>
              <div className="flex items-center gap-2 rounded-full bg-gray-100 px-4 py-2">
                <FaRegSmile className="text-[#EC6325]" />
                <span className="text-sm font-medium">46K+ Clients</span>
              </div>
              <div className="flex items-center gap-2 rounded-full bg-gray-100 px-4 py-2">
                <div className="flex gap-1">
                  {Array.from({ length: 5 }).map((_, i) => (
                    <FaStar key={i} className="text-yellow-400" />
                  ))}
                </div>
                <span className="text-sm font-medium">4.8 Rating</span>
              </div>
            </div>
          </div>

          {/* Right Image - You can add an image here if needed */}
          <div className="hidden md:block">
            <div className="rounded-xl bg-gradient-to-br from-blue-50 to-amber-50 p-8">
              <div className="aspect-square relative overflow-hidden rounded-lg">
                {/* You can add your image here */}
                <div className="absolute inset-0 flex items-center justify-center">
                  <div className="text-center">
                    <svg
                      className="h-24 w-24 text-gray-400 mx-auto mb-4"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={1.5}
                        d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4"
                      />
                    </svg>
                    <p className="text-gray-600">
                      Legal professionals across India
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Navigation Buttons Section */}
      <section className="mx-auto max-w-screen-xl px-4 py-8 sm:px-6 sm:py-10 md:py-12">
        <div className="ml-9 mb-8">
          <h2 className="text-2xl md:text-3xl font-bold text-gray-900 mb-2">
            Explore Our Services
          </h2>
          <p className="text-gray-600 text-sm md:text-base">
            Access all our legal services and resources in one place
          </p>
        </div>

        <ServiceList />

        {/* <div className="grid grid-cols-2 sm:grid-cols-2 lg:grid-cols-4 gap-4 md:gap-6">
          <button
            onClick={() => navigate("/findprofile")}
            className="group relative overflow-hidden rounded-2xl bg-gradient-to-br from-blue-50 to-blue-100 p-6 text-left transition-all duration-300 hover:scale-105 hover:shadow-xl border border-blue-200 hover:border-blue-300"
          >
            <div className="relative z-10">
              <div className="mb-3 flex h-12 w-12 items-center justify-center rounded-full bg-blue-500 text-white shadow-lg group-hover:bg-blue-600 transition-colors">
                <svg className="h-6 w-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                </svg>
              </div>
              <h3 className="text-lg font-semibold text-gray-900 mb-1">Find Lawyers & Law Firms</h3>
              <p className="text-sm text-gray-600">Connect with verified legal professionals across India</p>
            </div>
            <div className="absolute inset-0 bg-gradient-to-br from-blue-400/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
          </button>

          <button
            onClick={() => navigate("/querypage")}
            className="group relative overflow-hidden rounded-2xl bg-gradient-to-br from-green-50 to-green-100 p-6 text-left transition-all duration-300 hover:scale-105 hover:shadow-xl border border-green-200 hover:border-green-300"
          >
            <div className="relative z-10">
              <div className="mb-3 flex h-12 w-12 items-center justify-center rounded-full bg-green-500 text-white shadow-lg group-hover:bg-green-600 transition-colors">
                <svg className="h-6 w-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8.228 9c.549-1.165 2.03-2 3.772-2 2.21 0 4 1.343 4 3 0 1.4-1.278 2.575-3.006 2.907-.542.104-.994.54-.994 1.093m0 3h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
              <h3 className="text-lg font-semibold text-gray-900 mb-1">Ask Queries</h3>
              <p className="text-sm text-gray-600">Get answers to your legal questions from experts</p>
            </div>
            <div className="absolute inset-0 bg-gradient-to-br from-green-400/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
          </button>

          <button
            onClick={() => navigate("/blogs")}
            className="group relative overflow-hidden rounded-2xl bg-gradient-to-br from-purple-50 to-purple-100 p-6 text-left transition-all duration-300 hover:scale-105 hover:shadow-xl border border-purple-200 hover:border-purple-300"
          >
            <div className="relative z-10">
              <div className="mb-3 flex h-12 w-12 items-center justify-center rounded-full bg-purple-500 text-white shadow-lg group-hover:bg-purple-600 transition-colors">
                <svg className="h-6 w-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.746 0 3.332.477 4.5 1.253v13C19.832 18.477 18.246 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
                </svg>
              </div>
              <h3 className="text-lg font-semibold text-gray-900 mb-1">Blogs</h3>
              <p className="text-sm text-gray-600">Read legal insights and expert opinions</p>
            </div>
            <div className="absolute inset-0 bg-gradient-to-br from-purple-400/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
          </button>

          <button
            onClick={() => navigate("/support")}
            className="group relative overflow-hidden rounded-2xl bg-gradient-to-br from-orange-50 to-orange-100 p-6 text-left transition-all duration-300 hover:scale-105 hover:shadow-xl border border-orange-200 hover:border-orange-300"
          >
            <div className="relative z-10">
              <div className="mb-3 flex h-12 w-12 items-center justify-center rounded-full bg-orange-500 text-white shadow-lg group-hover:bg-orange-600 transition-colors">
                <svg className="h-6 w-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M18.364 5.636l-3.536 3.536m0 5.656l3.536 3.536M9.172 9.172L5.636 5.636m3.536 9.192L5.636 18.364M12 2.25a9.75 9.75 0 105.25 17.496A9.75 9.75 0 0112 2.25zm0 2.25a7.5 7.5 0 100 15 7.5 7.5 0 000-15z" />
                </svg>
              </div>
              <h3 className="text-lg font-semibold text-gray-900 mb-1">Help Centre</h3>
              <p className="text-sm text-gray-600">Get support and find answers to common questions</p>
            </div>
            <div className="absolute inset-0 bg-gradient-to-br from-orange-400/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
          </button>
        </div> */}
      </section>

      <TopRatedProfiles />

      {/* Service Promotion Section */}
      {/* <section className="mx-auto max-w-screen-xl px-4 py-8 sm:px-6 sm:py-12 md:py-16">
        <div className="overflow-hidden rounded-3xl bg-[#F8F9FA] md:grid md:grid-cols-2"> */}
      {/* Left: Image */}
      {/* <div className="relative h-64 w-full md:h-full">
            <img
              src="/assets/lawyer.webp"
              alt="Legal Services"
              className="absolute inset-0 h-full w-full object-cover"
            />
          </div> */}

      {/* Right: Content */}
      {/* <div className="flex flex-col justify-center p-8 md:p-12 lg:p-16">
            <h2 className="mb-4 text-3xl font-bold text-gray-900 md:text-4xl">
              Expert Legal Services at Your Fingertips
            </h2>
            <p className="mb-8 text-lg text-gray-600">
              Get professional legal assistance for all your needs. From documentation to representation, our verified experts are here to help you navigate the legal system with ease.
            </p>
            <div>
              <button
                onClick={() => navigate("/services")}
                className="rounded-full bg-black px-8 py-3.5 text-base font-semibold text-white transition-transform hover:scale-105 hover:shadow-lg active:scale-95"
              >
                Book Now
              </button>
            </div>
          </div>
        </div>
      </section> */}
      <BrowseByCategory onCategoryClick={handleCategoryClick} />

      {/* Explore Or Ask Legal Queries */}
      <section className="mx-auto max-w-screen-xl px-4 py-6 sm:px-6 sm:py-8 md:py-10 lg:py-12">
        {/* Header */}
        <div className="mb-5 text-center sm:mb-8 md:mb-10">
          <h2 className="font-bold leading-tight tracking-tight text-black text-[clamp(22px,6vw,40px)]">
            Explore Or Ask Legal Queries
          </h2>
          <p className="mt-2 text-xs text-gray-500 sm:text-sm md:text-base">
            Get Your Query Answered By Lawyers &amp; Firms
          </p>
        </div>

        {/* Controls + Row */}
        <div className="relative">
          {/* Left button (hidden on very small screens to avoid covering cards) */}
          <button
            aria-label="Scroll left"
            onClick={() => scrollBy("left")}
            className="absolute left-[-6px] top-1/2 z-10 hidden -translate-y-1/2 select-none items-center justify-center rounded-full border border-gray-200 bg-white shadow transition-colors hover:bg-gray-50 sm:flex h-9 w-9"
          >
            <svg width="18" height="18" viewBox="0 0 24 24">
              <path
                d="M15 18l-6-6 6-6"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
              />
            </svg>
          </button>

          {/* Cards scroller */}
          <div
            ref={scrollerRef}
            className="flex gap-3 overflow-x-auto pb-2 pt-1 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden sm:gap-4 md:gap-5"
          >
            {queriesLoading ? (
              Array.from({ length: 6 }).map((_, idx) => (
                <div
                  key={`loading-${idx}`}
                  className="min-w-[220px] max-w-[260px] rounded-2xl border bg-white px-3 py-3 shadow-sm ring-1 ring-transparent [border-color:#D9F4E0] sm:min-w-[240px] sm:max-w-[280px] md:min-w-[280px] md:max-w-[320px] animate-pulse"
                >
                  <div className="mb-2 h-4 rounded bg-gray-200" />
                  <div className="mb-1 h-4 rounded bg-gray-200" />
                  <div className="mb-3 h-4 w-3/4 rounded bg-gray-200" />
                  <div className="flex justify-between">
                    <div className="h-6 w-20 rounded bg-gray-200" />
                    <div className="h-4 w-16 rounded bg-gray-200" />
                  </div>
                  <div className="mt-3 flex justify-between">
                    <div className="h-3 w-16 rounded bg-gray-200" />
                    <div className="h-3 w-20 rounded bg-gray-200" />
                  </div>
                </div>
              ))
            ) : (
              <>
                {(filteredQueries.length
                  ? filteredQueries
                  : processedQueries
                ).map((item, idx) => (
                  <article
                    key={`${item.id}-${idx}`}
                    className="min-w-[220px] max-w-[260px] rounded-xl border bg-white px-3 py-3 transition-all hover:scale-[1.01] hover:shadow-md [border-color:#D9F4E0] sm:min-w-[240px] sm:max-w-[280px] sm:rounded-2xl sm:px-3.5 sm:py-3.5 md:min-w-[280px] md:max-w-[320px] md:px-4 md:py-4"
                  >
                    <h3 className="line-clamp-3 text-sm font-semibold leading-tight text-black sm:text-[16px] md:text-[17px]">
                      {item.title}
                    </h3>
                    <p className="line-clamp-3 text-sm text-grey-200">
                      {item.description}
                    </p>

                    <div className="mt-3 flex items-center justify-between sm:mt-4">
                      <button
                        onClick={() => handleAnswerQuery(item.id)}
                        className="rounded-full bg-black px-3 py-1.5 text-[11px] font-semibold text-white transition-opacity hover:opacity-90 sm:px-4 sm:text-[12px]"
                      >
                        Answer / Reply
                      </button>
                      <span className="text-[11px] text-gray-500 sm:text-[12px]">
                        {item.answers} Answers
                      </span>
                    </div>

                    <div className="mt-3 flex items-center justify-between text-[10px] text-gray-500 sm:mt-4 sm:text-[11px]">
                      <span>
                        Asked by{" "}
                        <span className="text-gray-700">
                          {item.askedBy || "Lawyer"}
                        </span>
                      </span>
                      <span>{item.timeAgo}</span>
                    </div>
                  </article>
                ))}

                {/* A small buffer at the end so last card isn't flush with edge */}
                <div className="min-w-[8px] sm:min-w-[12px]" />
              </>
            )}
          </div>

          {/* Right button */}
          <button
            aria-label="Scroll right"
            onClick={() => scrollBy("right")}
            className="absolute right-[-6px] top-1/2 z-10 hidden -translate-y-1/2 select-none items-center justify-center rounded-full border border-gray-200 bg-white shadow transition-colors hover:bg-gray-50 sm:flex h-9 w-9"
          >
            <svg width="18" height="18" viewBox="0 0 24 24">
              <path
                d="M9 6l6 6-6 6"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
              />
            </svg>
          </button>
        </div>

        {/* Mobile Category Select (touch friendly) */}
        <div className="mt-4 md:hidden">
          <div className="relative inline-block">
            {/* <button
              onClick={() => setCatOpen((v) => !v)}
              className="min-w-[200px] rounded-xl border border-gray-200 bg-gray-50 px-4 py-2.5 text-left text-sm text-gray-700 shadow-sm transition-colors hover:bg-white flex items-center justify-between gap-3"
            >
              <span
                className={
                  !selectedCat || selectedCat === "All" ? "text-gray-400" : ""
                }
              >
                {selectedCat === "All" ? "Select Category" : selectedCat}
              </span>
              <svg
                width="16"
                height="16"
                viewBox="0 0 24 24"
                className="opacity-60"
              >
                <path
                  d="M6 9l6 6 6-6"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                />
              </svg>
            </button> */}

            {/* {catOpen && (
              <div className="absolute left-0 z-10 mt-2 w-[220px] overflow-hidden rounded-xl border border-gray-200 bg-white shadow-lg">
                <ul className="max-h-64 overflow-auto py-1 text-sm">
                  {QUERY_CATEGORIES.map((c) => (
                    <li key={c}>
                      <button
                        onClick={() => {
                          setSelectedCat(c);
                          setCatOpen(false);
                        }}
                        className={`block w-full px-4 py-2 text-left hover:bg-gray-50 transition-colors ${
                          selectedCat === c ? "font-semibold" : ""
                        }`}
                      >
                        {c}
                      </button>
                    </li>
                  ))}
                </ul>
              </div>
            )} */}
          </div>
        </div>
      </section>

      {/* Why Expert Vakeel */}
      <WhyExpertVakeel />
    </main>
  );
}
