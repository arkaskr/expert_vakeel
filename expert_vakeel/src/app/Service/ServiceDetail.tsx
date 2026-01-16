// src/app/Service/ServiceDetail.tsx
import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { serviceAPI, serviceBookedAPI, type Service } from "../../services/api";
import { useUser } from "../../context/UserContext";
import {
  ArrowLeft,
  Loader,
  Check,
  AlertCircle,
  Phone,
  FileText,
  Calendar,
  Shield,
  Clock,
  Search,
  Car,
  LogIn,
} from "lucide-react";

export default function ServiceDetail() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { user } = useUser();

  const [service, setService] = useState<Service | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Booking form state
  const [showBookingForm, setShowBookingForm] = useState(false);
  const [phoneNumber, setPhoneNumber] = useState("");
  const [description, setDescription] = useState("");
  const [selectedCategories, setSelectedCategories] = useState<string[]>([]);
  const [booking, setBooking] = useState(false);
  const [bookingStatus, setBookingStatus] = useState<"" | "success" | "error">(
    "",
  );
  const [bookingMessage, setBookingMessage] = useState("");

  // Traffic Challan specific state
  const [vehicleNumber, setVehicleNumber] = useState("");
  const [searchingChallan, setSearchingChallan] = useState(false);
  const [challanData, setChallanData] = useState<any>(null);
  const [challanError, setChallanError] = useState<string | null>(null);

  // Login prompt state
  const [showLoginPrompt, setShowLoginPrompt] = useState(false);
  const [loginRedirectMessage, setLoginRedirectMessage] = useState("");

  // Check if service is traffic challan related
  const isTrafficChallanService =
    service?.name?.toLowerCase().includes("traffic") ||
    service?.name?.toLowerCase().includes("challan") ||
    service?.categories?.some(
      (cat) =>
        cat.toLowerCase().includes("traffic") ||
        cat.toLowerCase().includes("challan"),
    );

  useEffect(() => {
    const loadService = async () => {
      if (!id) {
        setError("Invalid service ID");
        setLoading(false);
        return;
      }

      try {
        setLoading(true);
        setError(null);
        const response = await serviceAPI.getById(id);

        if (response.data.success && response.data.data) {
          setService(response.data.data);
        } else {
          throw new Error("Service not found");
        }
      } catch (err) {
        console.error("Error loading service:", err);
        setError("Unable to load service details. Please try again later.");
      } finally {
        setLoading(false);
      }
    };

    loadService();
  }, [id]);

  const handleCategoryToggle = (category: string) => {
    setSelectedCategories((prev) =>
      prev.includes(category)
        ? prev.filter((c) => c !== category)
        : [...prev, category],
    );
  };

  const handleBookNow = () => {
    if (!user) {
      navigate("/login");
      return;
    }
    setShowBookingForm(true);
    setDescription(service?.description || "");
  };

  const handleSubmitBooking = async () => {
    if (!user || !service) return;

    // Validation
    if (!phoneNumber.trim()) {
      setBookingStatus("error");
      setBookingMessage("Please enter a phone number");
      return;
    }

    if (selectedCategories.length === 0) {
      setBookingStatus("error");
      setBookingMessage("Please select at least one service");
      return;
    }

    setBooking(true);
    setBookingStatus("");

    try {
      const response = await serviceBookedAPI.create({
        clientId: user.id || user._id,
        phoneNumber: phoneNumber.trim(),
        title: service.name,
        description: description.trim() || service.description,
        servicesBooked: selectedCategories,
      });

      if (response.data.success) {
        setBookingStatus("success");
        setBookingMessage("Booking successful! Redirecting to WhatsApp...");

        // Construct WhatsApp URL
        const targetNumber = service.number
          ? service.number.replace(/\D/g, "")
          : "919711840150";
        const message = encodeURIComponent(
          `Hi, I just booked *${service.name}*.\n\n*My Details:*\nPhone: ${phoneNumber}\nServices: ${selectedCategories.join(", ")}\nNote: ${description}`,
        );
        const whatsappUrl = `https://wa.me/${targetNumber}?text=${message}`;

        // Open WhatsApp
        window.open(whatsappUrl, "_blank");

        // Reset form after delay
        setTimeout(() => {
          navigate("/my-bookings");
        }, 3000);
      } else {
        throw new Error("Failed to book service");
      }
    } catch (err) {
      console.error("Error booking service:", err);
      setBookingStatus("error");
      setBookingMessage("Failed to book service. Please try again.");
    } finally {
      setBooking(false);
    }
  };

  const handleSearchChallan = async () => {
    if (!user) {
      setLoginRedirectMessage("Please login to search for traffic challans");
      setShowLoginPrompt(true);
      return;
    }

    if (!vehicleNumber.trim()) {
      setChallanError("Please enter vehicle number");
      return;
    }

    setSearchingChallan(true);
    setChallanError(null);
    setChallanData(null);

    try {
      // Simulate API call with mock data
      await new Promise((resolve) => setTimeout(resolve, 1500));

      // Mock challan data (Replace with actual API call)
      const mockChallanData = {
        vehicleNumber: vehicleNumber.toUpperCase(),
        ownerName: "John Doe",
        vehicleType: "Car",
        registrationDate: "2022-05-15",
        pendingChallans: [
          {
            id: "CHL001",
            date: "2024-01-15",
            location: "MG Road, Delhi",
            violation: "Signal Jumping",
            amount: 500,
            status: "Pending",
          },
          {
            id: "CHL002",
            date: "2024-01-20",
            location: "Connaught Place, Delhi",
            violation: "No Parking",
            amount: 200,
            status: "Pending",
          },
          {
            id: "CHL003",
            date: "2024-02-01",
            location: "India Gate, Delhi",
            violation: "Speeding",
            amount: 1000,
            status: "Pending",
          },
        ],
        totalPending: 1700,
        paidChallans: [
          {
            id: "CHL004",
            date: "2023-12-10",
            violation: "Wrong Parking",
            amount: 200,
            status: "Paid",
          },
        ],
      };

      setChallanData(mockChallanData);
    } catch (err) {
      console.error("Error fetching challan:", err);
      setChallanError("Unable to fetch challan details. Please try again.");
    } finally {
      setSearchingChallan(false);
    }
  };

  const handleChallanInputClick = () => {
    if (!user) {
      setLoginRedirectMessage("Please login to check traffic challans");
      setShowLoginPrompt(true);
      // Prevent typing by focusing on login prompt instead
      return false;
    }
    return true;
  };

  const handleVehicleNumberChange = (value: string) => {
    if (!user) {
      setLoginRedirectMessage("Please login to check traffic challans");
      setShowLoginPrompt(true);
      return;
    }
    setVehicleNumber(value.toUpperCase());
  };

  const handleLoginRedirect = () => {
    navigate("/login", {
      state: {
        from: window.location.pathname,
        message: loginRedirectMessage,
      },
    });
  };

  if (loading) {
    return (
      <main className="min-h-[100dvh] bg-white flex items-center justify-center">
        <div className="text-center">
          <div className="relative mb-4">
            <div className="absolute inset-0 animate-ping rounded-full bg-blue-100 opacity-75"></div>
            <Loader className="relative inline-block animate-spin h-10 w-10 text-blue-600" />
          </div>
          <p className="text-sm font-medium text-gray-500">
            Loading service details...
          </p>
        </div>
      </main>
    );
  }

  if (error || !service) {
    return (
      <main className="min-h-[100dvh] bg-white flex items-center justify-center">
        <div className="text-center max-w-md px-4">
          <div className="mx-auto mb-6 flex h-20 w-20 items-center justify-center rounded-full bg-red-50">
            <span className="text-4xl">⚠️</span>
          </div>
          <h2 className="mb-2 text-xl font-bold text-gray-900">
            Service Not Found
          </h2>
          <p className="mb-6 text-gray-600">
            {error || "The service you are looking for does not exist."}
          </p>
          <button
            onClick={() => navigate("/services")}
            className="rounded-full bg-black px-8 py-3 text-sm font-semibold text-white transition-transform hover:scale-105 hover:shadow-lg"
          >
            Back to Services
          </button>
        </div>
      </main>
    );
  }

  return (
    <main className="min-h-[100dvh] bg-gray-50">
      {/* Hero Section */}
      <div className="relative bg-gradient-to-br from-blue-600 via-indigo-600 to-purple-700 pb-32 pt-20 text-white md:pt-28">
        <div className="absolute left-0 top-0 h-full w-full overflow-hidden opacity-30">
          <div className="absolute -right-20 -top-20 h-96 w-96 rounded-full bg-yellow-400 blur-3xl"></div>
          <div className="absolute left-0 bottom-0 h-64 w-64 rounded-full bg-pink-500 blur-3xl"></div>
        </div>

        <div className="relative mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <button
            onClick={() => navigate("/services")}
            className="mb-8 flex items-center gap-2 text-sm font-medium text-blue-100 hover:text-white transition-colors"
          >
            <ArrowLeft className="h-4 w-4" />
            Back to Services
          </button>

          <div className="flex flex-col md:flex-row md:items-start md:justify-between gap-6">
            <div>
              <h1 className="text-3xl font-bold tracking-tight md:text-5xl lg:text-6xl drop-shadow-sm">
                {service.name}
              </h1>
            </div>
          </div>
        </div>
      </div>

      {/* Content Section */}
      <div className="relative mx-auto -mt-20 max-w-7xl px-4 pb-20 sm:px-6 lg:px-8">
        <div className="grid gap-8 lg:grid-cols-3">
          {/* Left Column: Details */}
          <div className="lg:col-span-2 space-y-8">
            {/* Traffic Challan Search Box (only for traffic challan services) */}
            {isTrafficChallanService && (
              <div className="rounded-3xl bg-white p-8 shadow-sm ring-1 ring-gray-100">
                <h2 className="mb-6 text-xl font-bold text-gray-900">
                  Check Your Traffic Challan
                </h2>
                <p className="mb-6 text-gray-600">
                  Enter your vehicle number to check pending traffic challans
                  and fines.
                </p>

                <div className="mb-6">
                  <div className="flex flex-col sm:flex-row gap-3">
                    <div className="relative flex-1">
                      <Car className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400" />
                      <input
                        type="text"
                        value={user ? vehicleNumber : ""}
                        onChange={(e) =>
                          handleVehicleNumberChange(e.target.value)
                        }
                        onClick={() => handleChallanInputClick()}
                        onFocus={() => {
                          if (!user) {
                            handleChallanInputClick();
                            // Blur the input to prevent typing
                            const input = document.activeElement as HTMLElement;
                            if (input) input.blur();
                          }
                        }}
                        placeholder={
                          user
                            ? "Enter Vehicle Number (e.g., DL01AB1234)"
                            : "Login to check challan"
                        }
                        readOnly={!user}
                        className={`w-full rounded-xl border pl-12 pr-4 py-3.5 text-sm font-medium outline-none transition-all ${
                          user
                            ? "border-gray-200 bg-gray-50 focus:border-blue-500 focus:bg-white focus:ring-4 focus:ring-blue-500/10"
                            : "border-gray-300 bg-gray-100 cursor-not-allowed text-gray-500"
                        }`}
                      />
                    </div>
                    <button
                      onClick={handleSearchChallan}
                      disabled={searchingChallan || !user}
                      className={`rounded-xl px-8 py-3.5 text-sm font-bold shadow-lg transition-all hover:shadow-xl active:scale-95 disabled:opacity-50 flex items-center justify-center gap-2 min-w-[140px] ${
                        user
                          ? "bg-gradient-to-r from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700 text-white"
                          : "bg-gradient-to-r from-gray-400 to-gray-500 text-white cursor-not-allowed"
                      }`}
                    >
                      {searchingChallan ? (
                        <>
                          <Loader className="h-4 w-4 animate-spin" />
                          Searching...
                        </>
                      ) : !user ? (
                        <>
                          <LogIn className="h-4 w-4" />
                          Login First
                        </>
                      ) : (
                        <>
                          <Search className="h-4 w-4" />
                          Search Challan
                        </>
                      )}
                    </button>
                  </div>

                  {!user && (
                    <div className="mt-4 flex items-center gap-2 rounded-xl border border-amber-200 bg-amber-50 p-4">
                      <AlertCircle className="h-5 w-5 text-amber-600" />
                      <span className="text-sm text-amber-700">
                        Please login to check your traffic challans
                      </span>
                    </div>
                  )}

                  {challanError && (
                    <div className="mt-4 flex items-center gap-2 rounded-xl border border-red-200 bg-red-50 p-4">
                      <AlertCircle className="h-5 w-5 text-red-600" />
                      <span className="text-sm text-red-700">
                        {challanError}
                      </span>
                    </div>
                  )}
                </div>

                {/* Challan Results */}
                {challanData && (
                  <div className="space-y-6">
                    {/* Vehicle Summary */}
                    <div className="rounded-2xl bg-gradient-to-r from-blue-50 to-indigo-50 p-6">
                      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                        <div>
                          <h3 className="text-lg font-bold text-gray-900">
                            {challanData.vehicleNumber}
                          </h3>
                          <p className="text-sm text-gray-600">
                            Owner: {challanData.ownerName} • Type:{" "}
                            {challanData.vehicleType}
                          </p>
                        </div>
                        <div className="text-right">
                          <div className="text-2xl font-bold text-red-600">
                            ₹{challanData.totalPending}
                          </div>
                          <div className="text-sm text-gray-500">
                            Total Pending
                          </div>
                        </div>
                      </div>
                    </div>

                    {/* Pending Challans */}
                    {challanData.pendingChallans.length > 0 && (
                      <div>
                        <h4 className="mb-4 text-lg font-semibold text-gray-900">
                          Pending Challans
                        </h4>
                        <div className="space-y-3">
                          {challanData.pendingChallans.map(
                            (challan: any, index: number) => (
                              <div
                                key={index}
                                className="rounded-xl border border-red-200 bg-red-50/50 p-4"
                              >
                                <div className="flex flex-col md:flex-row md:items-center justify-between gap-3">
                                  <div>
                                    <div className="font-medium text-gray-900">
                                      {challan.violation}
                                    </div>
                                    <div className="text-sm text-gray-600">
                                      {challan.date} • {challan.location}
                                    </div>
                                  </div>
                                  <div className="flex items-center gap-4">
                                    <div className="text-lg font-bold text-red-700">
                                      ₹{challan.amount}
                                    </div>
                                    <span className="rounded-full bg-red-100 px-3 py-1 text-xs font-medium text-red-800">
                                      {challan.status}
                                    </span>
                                  </div>
                                </div>
                              </div>
                            ),
                          )}
                        </div>
                      </div>
                    )}

                    {/* Pay Now Button */}
                    <div className="rounded-2xl bg-gradient-to-r from-amber-500 to-orange-500 p-6 text-center">
                      <h4 className="mb-2 text-lg font-bold text-white">
                        Pay Your Challans Online
                      </h4>
                      <p className="mb-4 text-sm text-white/90">
                        Clear all pending challans instantly with secure online
                        payment
                      </p>
                      <button
                        onClick={handleBookNow}
                        className="rounded-xl bg-white px-8 py-3 text-sm font-bold text-amber-600 shadow-lg hover:bg-gray-50 transition-all hover:shadow-xl active:scale-95"
                      >
                        Pay Now ₹{challanData.totalPending}
                      </button>
                    </div>
                  </div>
                )}

                {/* No Challans Found */}
                {challanData && challanData.pendingChallans.length === 0 && (
                  <div className="rounded-2xl bg-gradient-to-r from-green-50 to-emerald-50 p-8 text-center">
                    <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-green-100">
                      <Check className="h-8 w-8 text-green-600" />
                    </div>
                    <h4 className="mb-2 text-xl font-bold text-gray-900">
                      No Pending Challans!
                    </h4>
                    <p className="text-gray-600">
                      Great news! There are no pending traffic challans for
                      vehicle {challanData.vehicleNumber}.
                    </p>
                  </div>
                )}
              </div>
            )}

            {/* Description Card */}
            <div className="rounded-3xl bg-white p-8 shadow-sm ring-1 ring-gray-100">
              <h2 className="mb-4 text-xl font-bold text-gray-900">
                About this Service
              </h2>
              <p className="text-lg leading-relaxed text-gray-600">
                {service.description}
              </p>

              <div className="mt-8 grid grid-cols-1 gap-4 sm:grid-cols-3">
                <div className="flex items-center gap-3 rounded-2xl bg-blue-50 p-4">
                  <div className="rounded-full bg-blue-100 p-2 text-blue-600">
                    <Shield className="h-5 w-5" />
                  </div>
                  <div>
                    <p className="text-xs font-medium text-gray-500">
                      Verified
                    </p>
                    <p className="text-sm font-semibold text-gray-900">
                      Expert Legal
                    </p>
                  </div>
                </div>
                <div className="flex items-center gap-3 rounded-2xl bg-purple-50 p-4">
                  <div className="rounded-full bg-purple-100 p-2 text-purple-600">
                    <Clock className="h-5 w-5" />
                  </div>
                  <div>
                    <p className="text-xs font-medium text-gray-500">
                      Response
                    </p>
                    <p className="text-sm font-semibold text-gray-900">
                      24-48 Hours
                    </p>
                  </div>
                </div>
                <div className="flex items-center gap-3 rounded-2xl bg-green-50 p-4">
                  <div className="rounded-full bg-green-100 p-2 text-green-600">
                    <Calendar className="h-5 w-5" />
                  </div>
                  <div>
                    <p className="text-xs font-medium text-gray-500">
                      Availability
                    </p>
                    <p className="text-sm font-semibold text-gray-900">
                      Mon - Sat
                    </p>
                  </div>
                </div>
              </div>
            </div>

            {/* Included Services */}
            <div className="rounded-3xl bg-white p-8 shadow-sm ring-1 ring-gray-100">
              <h2 className="mb-6 text-xl font-bold text-gray-900">
                What's Included
              </h2>
              <div className="grid gap-4 sm:grid-cols-2">
                {service.categories.map((category, index) => (
                  <div
                    key={index}
                    className="group flex items-start gap-4 rounded-2xl border border-gray-100 p-4 transition-all hover:border-blue-200 hover:bg-blue-50/50 hover:shadow-sm"
                  >
                    <div className="mt-1 rounded-full bg-green-100 p-1.5 text-green-600 group-hover:bg-green-500 group-hover:text-white transition-colors">
                      <Check className="h-3 w-3" />
                    </div>
                    <span className="font-medium text-gray-700 group-hover:text-blue-900">
                      {category}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Right Column: Sticky Booking Card */}
          <div className="lg:col-span-1">
            <div className="sticky top-8 rounded-3xl bg-white p-6 shadow-xl ring-1 ring-gray-100 border-t-4 border-blue-600">
              <div className="mb-6 rounded-2xl bg-gradient-to-br from-gray-50 to-blue-50 p-4 text-center">
                <p className="text-sm text-gray-500">Ready to proceed?</p>
                <p className="text-lg font-bold text-gray-900">
                  Book a Consultation
                </p>
              </div>

              <div className="space-y-4">
                <div className="flex items-center gap-3 text-sm text-gray-600">
                  <Check className="h-5 w-5 text-green-500" />
                  <span>Professional Guidance</span>
                </div>
                <div className="flex items-center gap-3 text-sm text-gray-600">
                  <Check className="h-5 w-5 text-green-500" />
                  <span>Secure & Confidential</span>
                </div>
                <div className="flex items-center gap-3 text-sm text-gray-600">
                  <Check className="h-5 w-5 text-green-500" />
                  <span>Expert Support</span>
                </div>
              </div>

              <div className="mt-8">
                <button
                  onClick={handleBookNow}
                  className="w-full rounded-xl bg-gradient-to-r from-amber-500 to-orange-600 py-4 text-base font-bold text-white shadow-lg transition-all hover:from-amber-600 hover:to-orange-700 hover:shadow-xl active:scale-95"
                >
                  Book Now
                </button>
                <p className="mt-4 text-center text-xs text-gray-400">
                  By booking, you agree to our terms of service.
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Login Prompt Modal */}
      {showLoginPrompt && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4 transition-all">
          <div className="w-full max-w-md transform overflow-hidden rounded-3xl bg-white shadow-2xl transition-all">
            <div className="p-6 md:p-8">
              <div className="mx-auto mb-6 flex h-20 w-20 items-center justify-center rounded-full bg-blue-50">
                <LogIn className="h-10 w-10 text-blue-600" />
              </div>

              <h3 className="mb-3 text-center text-2xl font-bold text-gray-900">
                Login Required
              </h3>

              <p className="mb-6 text-center text-gray-600">
                {loginRedirectMessage}
              </p>

              <p className="mb-8 text-center text-sm text-gray-500">
                You need to be logged in to access traffic challan services.
              </p>

              <div className="space-y-4">
                <button
                  onClick={handleLoginRedirect}
                  className="w-full rounded-xl bg-gradient-to-r from-blue-500 to-blue-600 py-3.5 text-base font-bold text-white shadow-lg hover:from-blue-600 hover:to-blue-700 hover:shadow-xl active:scale-95"
                >
                  Login to Continue
                </button>

                <button
                  onClick={() => setShowLoginPrompt(false)}
                  className="w-full rounded-xl border border-gray-200 bg-white py-3.5 text-base font-bold text-gray-700 hover:bg-gray-50 transition-colors"
                >
                  Cancel
                </button>
              </div>

              <p className="mt-6 text-center text-xs text-gray-400">
                Don't have an account?{" "}
                <button
                  onClick={() => navigate("/signup")}
                  className="font-semibold text-blue-600 hover:text-blue-700"
                >
                  Sign up here
                </button>
              </p>
            </div>
          </div>
        </div>
      )}

      {/* Booking Form Modal */}
      {showBookingForm && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4 transition-all">
          <div className="w-full max-w-2xl transform overflow-hidden rounded-3xl bg-white shadow-2xl transition-all max-h-[90vh] flex flex-col">
            {/* Modal Header */}
            <div className="border-b border-gray-100 bg-gray-50/50 p-6">
              <h2 className="text-2xl font-bold text-gray-900">
                Book {service.name}
              </h2>
              <p className="text-sm text-gray-500">
                Complete the details below to schedule your service.
              </p>
            </div>

            {/* Modal Body */}
            <div className="flex-1 overflow-y-auto p-6 md:p-8">
              {/* Status Message */}
              {bookingStatus && (
                <div
                  className={`mb-6 flex items-center gap-3 rounded-2xl border p-4 text-sm ${
                    bookingStatus === "success"
                      ? "border-green-200 bg-green-50 text-green-800"
                      : "border-red-200 bg-red-50 text-red-700"
                  }`}
                >
                  {bookingStatus === "success" ? (
                    <div className="rounded-full bg-green-100 p-1">
                      <Check className="h-4 w-4 text-green-600" />
                    </div>
                  ) : (
                    <div className="rounded-full bg-red-100 p-1">
                      <AlertCircle className="h-4 w-4 text-red-600" />
                    </div>
                  )}
                  <span className="font-medium">{bookingMessage}</span>
                </div>
              )}

              <div className="space-y-6">
                {/* Phone Number */}
                <div>
                  <label className="mb-2 block text-sm font-semibold text-gray-900">
                    Phone Number <span className="text-red-500">*</span>
                  </label>
                  <div className="relative">
                    <Phone className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400" />
                    <input
                      type="tel"
                      value={phoneNumber}
                      onChange={(e) => setPhoneNumber(e.target.value)}
                      placeholder="Enter your phone number"
                      className="w-full rounded-xl border border-gray-200 bg-gray-50 pl-12 pr-4 py-3.5 text-sm font-medium outline-none transition-all focus:border-blue-500 focus:bg-white focus:ring-4 focus:ring-blue-500/10"
                    />
                  </div>
                </div>

                {/* Description */}
                <div>
                  <label className="mb-2 block text-sm font-semibold text-gray-900">
                    Additional Details
                  </label>
                  <div className="relative">
                    <FileText className="absolute left-4 top-4 h-5 w-5 text-gray-400" />
                    <textarea
                      value={description}
                      onChange={(e) => setDescription(e.target.value)}
                      placeholder="Describe your specific requirements or questions..."
                      rows={4}
                      className="w-full rounded-xl border border-gray-200 bg-gray-50 pl-12 pr-4 py-3.5 text-sm font-medium outline-none transition-all focus:border-blue-500 focus:bg-white focus:ring-4 focus:ring-blue-500/10 resize-none"
                    />
                  </div>
                </div>

                {/* Select Services */}
                <div>
                  <label className="mb-2 block text-sm font-semibold text-gray-900">
                    Select Services <span className="text-red-500">*</span>
                  </label>
                  <div className="grid gap-2 sm:grid-cols-2 max-h-48 overflow-y-auto pr-2 custom-scrollbar">
                    {service.categories.map((category, index) => (
                      <label
                        key={index}
                        className={`flex cursor-pointer items-center gap-3 rounded-xl border p-3 transition-all ${
                          selectedCategories.includes(category)
                            ? "border-blue-500 bg-blue-50 ring-1 ring-blue-500"
                            : "border-gray-200 hover:bg-gray-50"
                        }`}
                      >
                        <div
                          className={`flex h-5 w-5 items-center justify-center rounded border ${
                            selectedCategories.includes(category)
                              ? "border-blue-500 bg-blue-500"
                              : "border-gray-300 bg-white"
                          }`}
                        >
                          {selectedCategories.includes(category) && (
                            <Check className="h-3 w-3 text-white" />
                          )}
                        </div>
                        <input
                          type="checkbox"
                          checked={selectedCategories.includes(category)}
                          onChange={() => handleCategoryToggle(category)}
                          className="hidden"
                        />
                        <span
                          className={`text-sm font-medium ${selectedCategories.includes(category) ? "text-blue-700" : "text-gray-700"}`}
                        >
                          {category}
                        </span>
                      </label>
                    ))}
                  </div>
                </div>
              </div>
            </div>

            {/* Modal Footer */}
            <div className="border-t border-gray-100 bg-gray-50/50 p-6">
              <div className="flex gap-4">
                <button
                  onClick={() => {
                    setShowBookingForm(false);
                    setBookingStatus("");
                  }}
                  disabled={booking}
                  className="flex-1 rounded-xl border border-gray-200 bg-white py-3.5 text-sm font-bold text-gray-700 hover:bg-gray-50 disabled:opacity-50 transition-colors"
                >
                  Cancel
                </button>
                {bookingStatus === "success" ? (
                  <button
                    onClick={() => {
                      const targetNumber = service.number
                        ? service.number.replace(/\D/g, "")
                        : "919711840150";
                      const message = encodeURIComponent(
                        `Hi, I just booked *${service.name}*.\n\n*My Details:*\nPhone: ${phoneNumber}\nServices: ${selectedCategories.join(", ")}\nNote: ${description}`,
                      );
                      window.open(
                        `https://wa.me/${targetNumber}?text=${message}`,
                        "_blank",
                      );
                    }}
                    className="flex-1 rounded-xl bg-green-500 py-3.5 text-sm font-bold text-white shadow-lg hover:bg-green-600 transition-all hover:shadow-xl active:scale-95 flex items-center justify-center gap-2"
                  >
                    <Phone className="h-4 w-4" />
                    Open WhatsApp
                  </button>
                ) : (
                  <button
                    onClick={handleSubmitBooking}
                    disabled={booking}
                    className="flex-1 rounded-xl bg-gradient-to-r from-amber-500 to-orange-600 py-3.5 text-sm font-bold text-white shadow-lg hover:bg-gray-900 disabled:opacity-50 transition-all hover:shadow-xl active:scale-95"
                  >
                    {booking ? (
                      <span className="flex items-center justify-center gap-2">
                        <Loader className="h-4 w-4 animate-spin" />
                        Processing...
                      </span>
                    ) : (
                      "Confirm Booking"
                    )}
                  </button>
                )}
              </div>
            </div>
          </div>
        </div>
      )}
    </main>
  );
}
