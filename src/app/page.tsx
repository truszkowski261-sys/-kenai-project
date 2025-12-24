"use client";

import React, { useState, useEffect, useCallback, useRef } from "react";
import AnimatedButton from "@/components/AnimatedButton";
import Image from "next/image";

export default function Home() {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 10);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const [timeLeft, setTimeLeft] = useState({
    days: "08",
    hours: "21",
    minutes: "17",
    seconds: "36",
  });
  const [boooTime, setBoolTime] = useState({
    days: false,
    hours: false,
    minutes: false,
    seconds: false,
  });

  const [isButtonHovered, setIsButtonHovered] = useState(false);
  const [mousePos, setMousePos] = useState({ x: 0, y: 0 });
  const [activeSparkles, setActiveSparkles] = useState<Array<{
    id: number;
    x: number;
    y: number;
    size: number;
    duration: number;
  }>>([]);
  const sparkleIntervalRef = useRef<NodeJS.Timeout | null>(null);
  const sparkleCountRef = useRef(0);
  const buttonRef = useRef<HTMLButtonElement>(null);
  const mousePosRef = useRef({ x: 0, y: 0 });

  // Handle mouse move on button
  const handleMouseMove = useCallback((e: React.MouseEvent<HTMLButtonElement>) => {
    if (buttonRef.current) {
      const rect = buttonRef.current.getBoundingClientRect();
      const newPos = {
        x: e.clientX - rect.left,
        y: e.clientY - rect.top,
      };
      setMousePos(newPos);
      mousePosRef.current = newPos;
    }
  }, []);

  // Start spawning sparkles on hover
  const handleMouseEnter = useCallback((e: React.MouseEvent<HTMLButtonElement>) => {
    setIsButtonHovered(true);
    sparkleCountRef.current = 0;
    setActiveSparkles([]);
    
    if (buttonRef.current) {
      const rect = buttonRef.current.getBoundingClientRect();
      const initialPos = {
        x: e.clientX - rect.left,
        y: e.clientY - rect.top,
      };
      setMousePos(initialPos);
      mousePosRef.current = initialPos;
    }

    // Start interval to spawn sparkles
    sparkleIntervalRef.current = setInterval(() => {
      if (sparkleCountRef.current >= 20) {
        if (sparkleIntervalRef.current) {
          clearInterval(sparkleIntervalRef.current);
        }
        return;
      }

      const currentPos = mousePosRef.current;
      const offsetX = (Math.random() - 0.5) * 100; // Random offset -50 to 50px
      const offsetY = (Math.random() - 0.5) * 80; // Random offset -40 to 40px
      const newSparkle = {
        id: Date.now() + Math.random(),
        x: currentPos.x + offsetX,
        y: currentPos.y + offsetY,
        size: Math.random() * 20 + 30, // 30-50px
        duration: Math.random() * 0.4 + 0.6, // 0.6-1.0s
      };
      sparkleCountRef.current += 1;
      setActiveSparkles(prev => [...prev, newSparkle]);
    }, 300);
  }, []);

  // Stop spawning on mouse leave
  const handleMouseLeave = useCallback(() => {
    setIsButtonHovered(false);
    if (sparkleIntervalRef.current) {
      clearInterval(sparkleIntervalRef.current);
    }
    // Clear sparkles after animation completes
    setTimeout(() => {
      setActiveSparkles([]);
    }, 1500);
  }, []);

  // Cleanup interval on unmount
  useEffect(() => {
    return () => {
      if (sparkleIntervalRef.current) {
        clearInterval(sparkleIntervalRef.current);
      }
    };
  }, []);

  useEffect(() => {
    const targetDate = new Date("2026-01-01T00:00:00").getTime();
    const updateTimer = () => {
      const now = new Date().getTime();
      const difference = targetDate - now;
      if (difference > 0) {
        const days = Math.floor(difference / (1000 * 60 * 60 * 24));
        const hours = Math.floor(
          (difference % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60)
        );
        const minutes = Math.floor(
          (difference % (1000 * 60 * 60)) / (1000 * 60)
        );
        const seconds = Math.floor((difference % (1000 * 60)) / 1000);

        const newDays = days.toString().padStart(2, "0");
        const newHours = hours.toString().padStart(2, "0");
        const newMinutes = minutes.toString().padStart(2, "0");
        const newSeconds = seconds.toString().padStart(2, "0");

        setTimeLeft((prev) => {
          const changes = {
            days: newDays !== prev.days,
            hours: newHours !== prev.hours,
            minutes: newMinutes !== prev.minutes,
            seconds: newSeconds !== prev.seconds,
          };

          // Trigger animations for changed digits
          if (
            changes.days ||
            changes.hours ||
            changes.minutes ||
            changes.seconds
          ) {
            setBoolTime(changes);

            // Reset animations after 0.5s
            setTimeout(() => {
              setBoolTime({
                days: false,
                hours: false,
                minutes: false,
                seconds: false,
              });
            }, 500);
          }

          return {
            days: newDays,
            hours: newHours,
            minutes: newMinutes,
            seconds: newSeconds,
          };
        });
      }
    };
    const interval = setInterval(updateTimer, 1000);
    updateTimer(); // Initial call
    return () => clearInterval(interval);
  }, []);

  // Data for the features section
  const features = [
    {
      title: "Visual Sales Pipeline",
      desc: "Drag-and-drop Kanban board to manage leads from first contact to signed contract. Track every opportunity in real-time.",
    },
    {
      title: "AI-Powered Proposals",
      desc: "Generate professional, detailed proposals in minutes. Our AI calculates costs based on your production rates and materials.",
    },
    {
      title: "Project Scheduling",
      desc: "Visual calendar with crew assignments, project timelines, and automated reminders. Never miss a deadline again.",
    },
    {
      title: "Color Visualization",
      desc: "AI-powered color rendering lets customers visualize their project before you start. Increase close rates by 40%.",
    },
    {
      title: "Automated Follow-ups",
      desc: "Set up email and SMS sequences that nurture leads automatically. Focus on selling while we handle communication.",
    },
    {
      title: "Secure & Compliant",
      desc: "Bank-level encryption, automated backups, and compliance with industry standards. Your data is safe with us.",
    },
  ];

  // Data for the stats section
  const stats = [
    { value: "7+", label: "Years Industry Experience" },
    { value: "$1M+", label: "Revenue Managed" },
    { value: "50+", label: "Features Built" },
    { value: "100%", label: "Painter Focused" },
  ];

  return (
    <div id="root">
      <div className="min-h-screen bg-gradient-to-br from-slate-950 via-blue-950 to-slate-950 relative overflow-hidden">
        <div className="fixed top-0 left-0 right-0 z-[60] bg-gradient-to-r from-amber-600 via-orange-600 to-red-600 text-white py-2">
          <div className="fixed inset-0 pointer-events-none overflow-hidden z-0">
            <div
              className="absolute"
              style={{
                left: "45.1378%",
                top: "69.1801%",
                width: "9.31695px",
                height: "9.31695px",
                backgroundColor: "rgba(251, 191, 36, 0.5)",
                borderRadius: "2px",
                transform: "translateY(64.7019vh) rotate(262.724deg)",
              }}
            ></div>
            <div
              className="absolute"
              style={{
                left: "32.5925%",
                top: "20.128%",
                width: "9.76691px",
                height: "9.76691px",
                backgroundColor: "rgba(16, 185, 129, 0.6)",
                borderRadius: "50%",
                transform:
                  "translateX(82.5131px) translateY(98.0581vh) rotate(398.751deg)",
              }}
            ></div>
            <div
              className="absolute"
              style={{
                left: "56.3188%",
                top: "94.4442%",
                width: "10.6959px",
                height: "10.6959px",
                backgroundColor: "rgba(236, 72, 153, 0.6)",
                borderRadius: "50%",
                transform:
                  "translateX(83.4127px) translateY(91.7331vh) rotate(537.986deg)",
              }}
            ></div>
            <div
              className="absolute"
              style={{
                left: "25.7897%",
                top: "92.0705%",
                width: "6.92607px",
                height: "6.92607px",
                backgroundColor: "rgba(16, 185, 129, 0.6)",
                borderRadius: "50%",
                transform:
                  "translateX(5.39244px) translateY(38.2117vh) rotate(172.766deg)",
              }}
            ></div>
            <div
              className="absolute"
              style={{
                left: "2.18755%",
                top: "57.095%",
                width: "5.15359px",
                height: "5.15359px",
                backgroundColor: "rgba(251, 191, 36, 0.5)",
                borderRadius: "2px",
                transform:
                  "translateX(-59.3313px) translateY(78.3974vh) rotate(348.367deg)",
              }}
            ></div>
            <div
              className="absolute"
              style={{
                left: "87.9069%",
                top: "43.6141%",
                width: "6.49113px",
                height: "6.49113px",
                backgroundColor: "rgba(59, 130, 246, 0.6)",
                borderRadius: "50%",
                transform:
                  "translateX(-65.4618px) translateY(68.2659vh) rotate(365.938deg)",
              }}
            ></div>
            <div
              className="absolute"
              style={{
                left: "6.24198%",
                top: "41.0365%",
                width: "8.66438px",
                height: "8.66438px",
                backgroundColor: "rgba(168, 85, 247, 0.6)",
                borderRadius: "2px",
                transform:
                  "translateX(-26.388px) translateY(94.4401vh) rotate(569.18deg)",
              }}
            ></div>
            <div
              className="absolute"
              style={{
                left: "85.1789%",
                top: "96.8165%",
                width: "6.90924px",
                height: "6.90924px",
                backgroundColor: "rgba(168, 85, 247, 0.6)",
                borderRadius: "2px",
                transform:
                  "translateX(4.19358px) translateY(6.38306vh) rotate(156.451deg)",
              }}
            ></div>
            <div
              className="absolute"
              style={{
                left: "11.4923%",
                top: "19.0975%",
                width: "8.44291px",
                height: "8.44291px",
                backgroundColor: "rgba(236, 72, 153, 0.6)",
                borderRadius: "50%",
                transform:
                  "translateX(55.6416px) translateY(56.2401vh) rotate(494.583deg)",
              }}
            ></div>
            <div
              className="absolute"
              style={{
                left: "60.374%",
                top: "7.68589%",
                width: "5.53856px",
                height: "5.53856px",
                backgroundColor: "rgba(168, 85, 247, 0.6)",
                borderRadius: "50%",
                transform:
                  "translateX(29.0535px) translateY(70.498vh) rotate(290.222deg)",
              }}
            ></div>
            <div
              className="absolute"
              style={{
                left: "9.00875%",
                top: "4.38526%",
                width: "6.17933px",
                height: "6.17933px",
                backgroundColor: "rgba(251, 191, 36, 0.5)",
                borderRadius: "50%",
                transform:
                  "translateX(-21.8508px) translateY(40.1653vh) rotate(452.503deg)",
              }}
            ></div>
            <div
              className="absolute"
              style={{
                left: "57.0371%",
                top: "64.5891%",
                width: "7.81948px",
                height: "7.81948px",
                backgroundColor: "rgba(236, 72, 153, 0.6)",
                borderRadius: "2px",
                transform:
                  "translateX(-16.3828px) translateY(16.3829vh) rotate(102.841deg)",
              }}
            ></div>
            <div
              className="absolute"
              style={{
                left: "40.6982%",
                top: "33.9668%",
                width: "10.2494px",
                height: "10.2494px",
                backgroundColor: "rgba(168, 85, 247, 0.6)",
                borderRadius: "50%",
                transform:
                  "translateX(-26.6045px) translateY(49.5823vh) rotate(325.717deg)",
              }}
            ></div>
            <div
              className="absolute"
              style={{
                left: "4.03679%",
                top: "68.6226%",
                width: "8.02063px",
                height: "8.02063px",
                backgroundColor: "rgba(16, 185, 129, 0.6)",
                borderRadius: "2px",
                transform:
                  "translateX(34.2137px) translateY(81.4288vh) rotate(366.357deg)",
              }}
            ></div>
            <div
              className="absolute"
              style={{
                left: "36.6339%",
                top: "93.5563%",
                width: "10.3537px",
                height: "10.3537px",
                backgroundColor: "rgba(251, 191, 36, 0.5)",
                borderRadius: "2px",
                transform:
                  "translateX(10.7808px) translateY(10.883vh) rotate(298.201deg)",
              }}
            ></div>
            <div
              className="absolute"
              style={{
                left: "72.2671%",
                top: "13.6367%",
                width: "7.69273px",
                height: "7.69273px",
                backgroundColor: "rgba(251, 191, 36, 0.5)",
                borderRadius: "50%",
                transform:
                  "translateX(10.9555px) translateY(16.8472vh) rotate(351.416deg)",
              }}
            ></div>
            <div
              className="absolute"
              style={{
                left: "27.5998%",
                top: "86.4886%",
                width: "9.56523px",
                height: "9.56523px",
                backgroundColor: "rgba(59, 130, 246, 0.6)",
                borderRadius: "2px",
                transform:
                  "translateX(-12.6375px) translateY(43.8948vh) rotate(471.298deg)",
              }}
            ></div>
            <div
              className="absolute"
              style={{
                left: "88.8416%",
                top: "43.2735%",
                width: "7.37114px",
                height: "7.37114px",
                backgroundColor: "rgba(16, 185, 129, 0.6)",
                borderRadius: "2px",
                transform:
                  "translateX(-66.1692px) translateY(68.8261vh) rotate(477.048deg)",
              }}
            ></div>
            <div
              className="absolute"
              style={{
                left: "32.6366%",
                top: "7.12042%",
                width: "4.58746px",
                height: "4.58746px",
                backgroundColor: "rgba(236, 72, 153, 0.6)",
                borderRadius: "50%",
                transform:
                  "translateX(-40.2166px) translateY(53.5516vh) rotate(492.547deg)",
              }}
            ></div>
            <div
              className="absolute"
              style={{
                left: "86.3557%",
                top: "59.056%",
                width: "10.5045px",
                height: "10.5045px",
                backgroundColor: "rgba(251, 191, 36, 0.5)",
                borderRadius: "2px",
                transform:
                  "translateX(12.2602px) translateY(81.8013vh) rotate(488.095deg)",
              }}
            ></div>
            <div
              className="absolute top-1/4 left-1/4 w-96 h-96 bg-cyan-500/10 rounded-full blur-3xl"
              style={{ transform: "scale(1.18637)" }}
            ></div>
            <div
              className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-purple-500/10 rounded-full blur-3xl"
              style={{ transform: "scale(1.15813)" }}
            ></div>
            <div
              className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-gradient-to-r from-cyan-500/5 via-purple-500/5 to-pink-500/5 rounded-full blur-3xl"
              style={{ transform: "rotate(255.204deg)" }}
            ></div>
          </div>
          <div className="container mx-auto px-4 flex items-center justify-center gap-4">
            <span className="text-lg">🎆</span>
            <span className="font-bold text-sm md:text-base">
              Launching New Years 2026!
            </span>
            <div className="flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-cyan-500/20 to-purple-500/20 backdrop-blur-sm rounded-full border border-cyan-500/30">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="24"
                height="24"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
                className="lucide lucide-rocket h-4 w-4 text-cyan-400 animate-pulse"
              >
                <path d="M4.5 16.5c-1.5 1.26-2 5-2 5s3.74-.5 5-2c.71-.84.7-2.13-.09-2.91a2.18 2.18 0 0 0-2.91-.09z"></path>
                <path d="m12 15-3-3a22 22 0 0 1 2-3.95A12.88 12.88 0 0 1 22 2c0 2.72-.78 7.5-6 11a22.35 22.35 0 0 1-4 2z"></path>
                <path d="M9 12H4s.55-3.03 2-4c1.62-1.08 5 0 5 0"></path>
                <path d="M12 15v5s3.03-.55 4-2c1.08-1.62 0-5 0-5"></path>
              </svg>
              <span className="text-sm font-semibold text-cyan-300 hidden sm:inline">
                Launching in
              </span>
              <div className="flex items-center gap-1">
                <div className="flex flex-col items-center">
                  <div
                    className="text-xl md:text-2xl font-bold text-white tabular-nums "
                    style={
                      boooTime.days
                        ? {
                            position: "relative",
                            animationName: "counter",
                            animationDuration: "0.1s",
                          }
                        : {}
                    }
                  >
                    {timeLeft.days}
                  </div>
                  <span className="text-[10px] text-cyan-300 uppercase tracking-wider">
                    d
                  </span>
                </div>
                <span className="text-cyan-400 font-bold">:</span>
                <div className="flex flex-col items-center">
                  <div
                    className="text-xl md:text-2xl font-bold text-white tabular-nums"
                    style={
                      boooTime.hours
                        ? {
                            position: "relative",
                            animationName: "counter",
                            animationDuration: "0.1s",
                          }
                        : {}
                    }
                  >
                    {timeLeft.hours}
                  </div>
                  <span className="text-[10px] text-cyan-300 uppercase tracking-wider">
                    h
                  </span>
                </div>
                <span className="text-cyan-400 font-bold">:</span>
                <div className="flex flex-col items-center">
                  <div
                    className="text-xl md:text-2xl font-bold text-white tabular-nums"
                    style={
                      boooTime.minutes
                        ? {
                            position: "relative",
                            animationName: "counter",
                            animationDuration: "0.1s",
                          }
                        : {}
                    }
                  >
                    {timeLeft.minutes}
                  </div>
                  <span className="text-[10px] text-cyan-300 uppercase tracking-wider">
                    m
                  </span>
                </div>
                <span className="text-cyan-400 font-bold hidden sm:inline">
                  :
                </span>
                <span className="hidden sm:block">
                  <div className="flex flex-col items-center">
                    <div
                      className="text-xl md:text-2xl font-bold text-white tabular-nums"
                      style={
                        boooTime.seconds
                          ? {
                              position: "relative",
                              animationName: "counter",
                              animationDuration: "0.1s",
                            }
                          : {}
                      }
                    >
                      {timeLeft.seconds}
                    </div>
                    <span className="text-[10px] text-cyan-300 uppercase tracking-wider">
                      s
                    </span>
                  </div>
                </span>
              </div>
            </div>
            <span className="text-lg hidden sm:inline">🎆</span>
          </div>
        </div>
        <header
          style={{ paddingTop: "35px" }}
          className={`fixed top-8 left-0 right-0 z-50 transition-all duration-300 ${
            isScrolled
              ? "bg-black/80 backdrop-blur-xl border-b border-white/10 shadow-2xl"
              : "bg-transparent"
          }`}
        >
          <div className="container mx-auto px-4 py-4">
            <div className="hidden md:flex justify-between items-center">
              <div className="flex items-center gap-5">
                <Image
                  src="/assets/images/logo.png"
                  alt="SnapCoat CRM"
                  width={200}
                  height={80}
                  className="h-20 w-auto transition-transform duration-300 hover:scale-110 object-contain"
                />
                <div>
                  <div className="text-white font-bold text-2xl">
                    SnapCoat CRM
                  </div>
                  <div className="text-cyan-400 text-sm font-medium">
                    Powered by AI
                  </div>
                </div>
              </div>
              <nav className="flex items-center gap-8">
                <span className="text-white font-semibold text-lg border-b-2 border-cyan-400 pb-1 cursor-pointer hover:text-cyan-400 transition-colors">
                  Home
                </span>
                <a
                  href="/features"
                  className="text-white/80 hover:text-cyan-400 transition-colors text-lg font-semibold"
                >
                  Features
                </a>
              </nav>
              <div className="flex items-center gap-4">
                <a href="/auth">
                  <button className="inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-md text-sm ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 [&_svg]:pointer-events-none [&_svg]:size-4 [&_svg]:shrink-0 h-10 border-2 border-cyan-500 text-cyan-400 hover:bg-cyan-500/20 hover:text-white px-4 py-2 font-semibold bg-slate-900/50 backdrop-blur-sm">
                    Existing User? Sign In
                  </button>
                </a>
                <a href="/signup">
                  <button className="inline-flex items-center justify-center gap-2 whitespace-nowrap text-sm ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 [&_svg]:pointer-events-none [&_svg]:size-4 [&_svg]:shrink-0 bg-primary hover:bg-primary/90 h-10 relative overflow-visible bg-gradient-to-r from-cyan-500 to-purple-500 hover:from-cyan-600 hover:to-purple-600 text-white border-0 px-6 py-2 font-bold shadow-lg rounded-lg">
                    <span className="relative z-10 flex flex-row items-center">
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        width="24"
                        height="24"
                        viewBox="0 0 24 24"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="2"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        className="lucide lucide-sparkles mr-2 h-4 w-4"
                      >
                        <path d="M9.937 15.5A2 2 0 0 0 8.5 14.063l-6.135-1.582a.5.5 0 0 1 0-.962L8.5 9.936A2 2 0 0 0 9.937 8.5l1.582-6.135a.5.5 0 0 1 .963 0L14.063 8.5A2 2 0 0 0 15.5 9.937l6.135 1.581a.5.5 0 0 1 0 .964L15.5 14.063a2 2 0 0 0-1.437 1.437l-1.582 6.135a.5.5 0 0 1-.963 0z"></path>
                        <path d="M20 3v4"></path>
                        <path d="M22 5h-4"></path>
                        <path d="M4 17v2"></path>
                        <path d="M5 18H3"></path>
                      </svg>
                      Join Waitlist
                    </span>
                    <div className="absolute inset-0 rounded-[inherit] pointer-events-none"></div>
                  </button>
                </a>
              </div>
            </div>
          </div>
        </header>

        <section className="pt-40 min-h-screen pb-12 relative overflow-hidden flex flex-col justify-center">
          <div className="container mx-auto px-4 relative z-10">
            <div className="text-center mb-8 animate-fade-in">
              <div className="inline-flex items-center gap-3 bg-gradient-to-r from-amber-500/20 via-orange-500/20 to-red-500/20 backdrop-blur-sm border border-amber-500/50 rounded-full px-6 py-3 mb-6 shadow-lg shadow-amber-500/20">
                <span className="text-2xl">🎆</span>
                <span className="text-lg font-black bg-gradient-to-r from-amber-400 via-orange-400 to-red-400 bg-clip-text text-transparent uppercase tracking-wider">
                  Launching New Years 2026
                </span>
                <span className="text-2xl">🎆</span>
              </div>
              <h1 className="text-4xl md:text-6xl lg:text-7xl font-black mb-4 text-white leading-tight">
                The CRM Built for
                <br />
                <span className="bg-gradient-to-r from-cyan-400 via-purple-400 to-pink-400 bg-clip-text text-transparent">
                  Painting Contractors
                </span>
              </h1>
              <p className="text-lg md:text-xl mb-6 max-w-3xl mx-auto text-white/80 leading-relaxed font-medium">
                Transform your painting business with our all-in-one AI-powered
                platform. Join the waitlist to be among the first to experience
                the future of painting business management.
              </p>
              <div className="flex flex-col sm:flex-row gap-6 justify-center items-center">
                <a href="/signup">
                  <button className="inline-flex items-center justify-center gap-2 whitespace-nowrap ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 [&amp;_svg]:pointer-events-none [&amp;_svg]:size-4 [&amp;_svg]:shrink-0 bg-primary hover:bg-primary/90 h-10 relative overflow-visible bg-gradient-to-r from-cyan-500 to-purple-500 hover:from-cyan-600 hover:to-purple-600 text-white border-0 px-12 py-6 text-xl font-bold shadow-2xl shadow-cyan-500/50 hover:shadow-cyan-500/60 transition-all duration-300 rounded-xl group">
                    <span className="relative z-10 flex flex-row items-center">
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        width="24"
                        height="24"
                        viewBox="0 0 24 24"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="2"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        className="lucide lucide-sparkles mr-3 h-6 w-6"
                      >
                        <path d="M9.937 15.5A2 2 0 0 0 8.5 14.063l-6.135-1.582a.5.5 0 0 1 0-.962L8.5 9.936A2 2 0 0 0 9.937 8.5l1.582-6.135a.5.5 0 0 1 .963 0L14.063 8.5A2 2 0 0 0 15.5 9.937l6.135 1.581a.5.5 0 0 1 0 .964L15.5 14.063a2 2 0 0 0-1.437 1.437l-1.582 6.135a.5.5 0 0 1-.963 0z"></path>
                        <path d="M20 3v4"></path>
                        <path d="M22 5h-4"></path>
                        <path d="M4 17v2"></path>
                        <path d="M5 18H3"></path>
                      </svg>
                      Join the Waitlist
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        width="24"
                        height="24"
                        viewBox="0 0 24 24"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="2"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        className="lucide lucide-arrow-right ml-3 h-6 w-6 group-hover:translate-x-1 transition-transform"
                      >
                        <path d="M5 12h14"></path>
                        <path d="m12 5 7 7-7 7"></path>
                      </svg>
                    </span>
                    <div
                      className="absolute inset-0 rounded-[inherit] pointer-events-none"
                      style={{
                        background:
                          "radial-gradient(circle, rgba(255, 215, 0, 0.125) 0%, transparent 70%)",
                        filter: "blur(8px)",
                        opacity: "0",
                      }}
                    ></div>
                  </button>
                </a>
                <a href="/features">
                  <button className="inline-flex items-center justify-center gap-2 whitespace-nowrap ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 [&amp;_svg]:pointer-events-none [&amp;_svg]:size-4 [&amp;_svg]:shrink-0 hover:text-accent-foreground h-10 px-12 py-6 text-xl border-2 border-white/30 bg-white/5 backdrop-blur-sm text-white font-bold hover:bg-white/10 hover:border-white/50 transition-all duration-300 rounded-xl">
                    Explore Features
                  </button>
                </a>
              </div>
            </div>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-10">
              <div
                className="animate-float"
                style={{ animationDelay: "0s", animationDuration: "6s" }}
              >
                <div className="bg-white/5 backdrop-blur-xl rounded-xl p-4 border border-white/10 hover:border-white/30 transition-all duration-300 hover:scale-105 hover:shadow-xl hover:shadow-cyan-500/20 group">
                  <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-cyan-500 to-blue-600 flex items-center justify-center mb-2 group-hover:scale-110 transition-transform">
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      width="24"
                      height="24"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="2"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      className="lucide lucide-users h-5 w-5 text-white"
                    >
                      <path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2"></path>
                      <circle cx="9" cy="7" r="4"></circle>
                      <path d="M22 21v-2a4 4 0 0 0-3-3.87"></path>
                      <path d="M16 3.13a4 4 0 0 1 0 7.75"></path>
                    </svg>
                  </div>
                  <div className="text-2xl md:text-3xl font-black text-white mb-1">
                    7+
                  </div>
                  <div className="text-white/60 text-sm font-medium">
                    Years Industry Experience
                  </div>
                </div>
              </div>
              <div
                className="animate-float"
                style={{ animationDelay: "0.2s", animationDuration: "6s" }}
              >
                <div className="bg-white/5 backdrop-blur-xl rounded-xl p-4 border border-white/10 hover:border-white/30 transition-all duration-300 hover:scale-105 hover:shadow-xl hover:shadow-cyan-500/20 group">
                  <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-emerald-500 to-cyan-600 flex items-center justify-center mb-2 group-hover:scale-110 transition-transform">
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      width="24"
                      height="24"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="2"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      className="lucide lucide-trending-up h-5 w-5 text-white"
                    >
                      <polyline points="22 7 13.5 15.5 8.5 10.5 2 17"></polyline>
                      <polyline points="16 7 22 7 22 13"></polyline>
                    </svg>
                  </div>
                  <div className="text-2xl md:text-3xl font-black text-white mb-1">
                    $1M+
                  </div>
                  <div className="text-white/60 text-sm font-medium">
                    Revenue Managed
                  </div>
                </div>
              </div>
              <div
                className="animate-float"
                style={{ animationDelay: "0.4s", animationDuration: "6s" }}
              >
                <div className="bg-white/5 backdrop-blur-xl rounded-xl p-4 border border-white/10 hover:border-white/30 transition-all duration-300 hover:scale-105 hover:shadow-xl hover:shadow-cyan-500/20 group">
                  <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center mb-2 group-hover:scale-110 transition-transform">
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      width="24"
                      height="24"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="2"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      className="lucide lucide-zap h-5 w-5 text-white"
                    >
                      <path d="M4 14a1 1 0 0 1-.78-1.63l9.9-10.2a.5.5 0 0 1 .86.46l-1.92 6.02A1 1 0 0 0 13 10h7a1 1 0 0 1 .78 1.63l-9.9 10.2a.5.5 0 0 1-.86-.46l1.92-6.02A1 1 0 0 0 11 14z"></path>
                    </svg>
                  </div>
                  <div className="text-2xl md:text-3xl font-black text-white mb-1">
                    50+
                  </div>
                  <div className="text-white/60 text-sm font-medium">
                    Features Built
                  </div>
                </div>
              </div>
              <div
                className="animate-float"
                style={{ animationDelay: "0.6s", animationDuration: "6s" }}
              >
                <div className="bg-white/5 backdrop-blur-xl rounded-xl p-4 border border-white/10 hover:border-white/30 transition-all duration-300 hover:scale-105 hover:shadow-xl hover:shadow-cyan-500/20 group">
                  <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-purple-500 to-pink-600 flex items-center justify-center mb-2 group-hover:scale-110 transition-transform">
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      width="24"
                      height="24"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="2"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      className="lucide lucide-shield h-5 w-5 text-white"
                    >
                      <path d="M20 13c0 5-3.5 7.5-7.66 8.95a1 1 0 0 1-.67-.01C7.5 20.5 4 18 4 13V6a1 1 0 0 1 1-1c2 0 4.5-1.2 6.24-2.72a1.17 1.17 0 0 1 1.52 0C14.51 3.81 17 5 19 5a1 1 0 0 1 1 1z"></path>
                    </svg>
                  </div>
                  <div className="text-2xl md:text-3xl font-black text-white mb-1">
                    100%
                  </div>
                  <div className="text-white/60 text-sm font-medium">
                    Painter Focused
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>
        <section className="py-20 relative">
          <div className="container mx-auto px-4">
            <div className="text-center mb-16">
              <h2 className="text-5xl md:text-6xl font-black text-white mb-6">
                Everything You Need to{" "}
                <span className="bg-gradient-to-r from-cyan-400 to-blue-500 bg-clip-text text-transparent">
                  Succeed
                </span>
              </h2>
              <p className="text-xl text-white/70 max-w-3xl mx-auto">
                Powerful features designed specifically for painting contractors
              </p>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              <div className="group relative bg-white/5 backdrop-blur-xl rounded-2xl p-8 border border-white/10 hover:border-white/30 transition-all duration-500 hover:scale-105 hover:shadow-2xl hover:shadow-cyan-500/20">
                <div className="w-16 h-16 rounded-xl bg-gradient-to-br from-cyan-500 to-blue-600 flex items-center justify-center mb-6 group-hover:scale-110 transition-transform duration-300">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    width="24"
                    height="24"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    className="lucide lucide-chart-no-axes-column h-8 w-8 text-white"
                  >
                    <line x1="18" x2="18" y1="20" y2="10"></line>
                    <line x1="12" x2="12" y1="20" y2="4"></line>
                    <line x1="6" x2="6" y1="20" y2="14"></line>
                  </svg>
                </div>
                <h3 className="text-2xl font-bold text-white mb-4">
                  Visual Sales Pipeline
                </h3>
                <p className="text-white/70 text-lg leading-relaxed">
                  Drag-and-drop Kanban board to manage leads from first contact
                  to signed contract. Track every opportunity in real-time.
                </p>
                <div className="absolute inset-0 bg-gradient-to-r from-cyan-500/0 via-cyan-500/5 to-cyan-500/0 opacity-0 group-hover:opacity-100 transition-opacity duration-500 rounded-2xl"></div>
              </div>
              <div className="group relative bg-white/5 backdrop-blur-xl rounded-2xl p-8 border border-white/10 hover:border-white/30 transition-all duration-500 hover:scale-105 hover:shadow-2xl hover:shadow-cyan-500/20">
                <div className="w-16 h-16 rounded-xl bg-gradient-to-br from-emerald-500 to-cyan-600 flex items-center justify-center mb-6 group-hover:scale-110 transition-transform duration-300">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    width="24"
                    height="24"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    className="lucide lucide-file-text h-8 w-8 text-white"
                  >
                    <path d="M15 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V7Z"></path>
                    <path d="M14 2v4a2 2 0 0 0 2 2h4"></path>
                    <path d="M10 9H8"></path>
                    <path d="M16 13H8"></path>
                    <path d="M16 17H8"></path>
                  </svg>
                </div>
                <h3 className="text-2xl font-bold text-white mb-4">
                  AI-Powered Proposals
                </h3>
                <p className="text-white/70 text-lg leading-relaxed">
                  Generate professional, detailed proposals in minutes. Our AI
                  calculates costs based on your production rates and materials.
                </p>
                <div className="absolute inset-0 bg-gradient-to-r from-cyan-500/0 via-cyan-500/5 to-cyan-500/0 opacity-0 group-hover:opacity-100 transition-opacity duration-500 rounded-2xl"></div>
              </div>
              <div className="group relative bg-white/5 backdrop-blur-xl rounded-2xl p-8 border border-white/10 hover:border-white/30 transition-all duration-500 hover:scale-105 hover:shadow-2xl hover:shadow-cyan-500/20">
                <div className="w-16 h-16 rounded-xl bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center mb-6 group-hover:scale-110 transition-transform duration-300">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    width="24"
                    height="24"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    className="lucide lucide-calendar h-8 w-8 text-white"
                  >
                    <path d="M8 2v4"></path>
                    <path d="M16 2v4"></path>
                    <rect width="18" height="18" x="3" y="4" rx="2"></rect>
                    <path d="M3 10h18"></path>
                  </svg>
                </div>
                <h3 className="text-2xl font-bold text-white mb-4">
                  Project Scheduling
                </h3>
                <p className="text-white/70 text-lg leading-relaxed">
                  Visual calendar with crew assignments, project timelines, and
                  automated reminders. Never miss a deadline again.
                </p>
                <div className="absolute inset-0 bg-gradient-to-r from-cyan-500/0 via-cyan-500/5 to-cyan-500/0 opacity-0 group-hover:opacity-100 transition-opacity duration-500 rounded-2xl"></div>
              </div>
              <div className="group relative bg-white/5 backdrop-blur-xl rounded-2xl p-8 border border-white/10 hover:border-white/30 transition-all duration-500 hover:scale-105 hover:shadow-2xl hover:shadow-cyan-500/20">
                <div className="w-16 h-16 rounded-xl bg-gradient-to-br from-purple-500 to-pink-600 flex items-center justify-center mb-6 group-hover:scale-110 transition-transform duration-300">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    width="24"
                    height="24"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    className="lucide lucide-palette h-8 w-8 text-white"
                  >
                    <circle
                      cx="13.5"
                      cy="6.5"
                      r=".5"
                      fill="currentColor"
                    ></circle>
                    <circle
                      cx="17.5"
                      cy="10.5"
                      r=".5"
                      fill="currentColor"
                    ></circle>
                    <circle
                      cx="8.5"
                      cy="7.5"
                      r=".5"
                      fill="currentColor"
                    ></circle>
                    <circle
                      cx="6.5"
                      cy="12.5"
                      r=".5"
                      fill="currentColor"
                    ></circle>
                    <path d="M12 2C6.5 2 2 6.5 2 12s4.5 10 10 10c.926 0 1.648-.746 1.648-1.688 0-.437-.18-.835-.437-1.125-.29-.289-.438-.652-.438-1.125a1.64 1.64 0 0 1 1.668-1.668h1.996c3.051 0 5.555-2.503 5.555-5.554C21.965 6.012 17.461 2 12 2z"></path>
                  </svg>
                </div>
                <h3 className="text-2xl font-bold text-white mb-4">
                  Color Visualization
                </h3>
                <p className="text-white/70 text-lg leading-relaxed">
                  AI-powered color rendering lets customers visualize their
                  project before you start. Increase close rates by 40%.
                </p>
                <div className="absolute inset-0 bg-gradient-to-r from-cyan-500/0 via-cyan-500/5 to-cyan-500/0 opacity-0 group-hover:opacity-100 transition-opacity duration-500 rounded-2xl"></div>
              </div>
              <div className="group relative bg-white/5 backdrop-blur-xl rounded-2xl p-8 border border-white/10 hover:border-white/30 transition-all duration-500 hover:scale-105 hover:shadow-2xl hover:shadow-cyan-500/20">
                <div className="w-16 h-16 rounded-xl bg-gradient-to-br from-pink-500 to-rose-600 flex items-center justify-center mb-6 group-hover:scale-110 transition-transform duration-300">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    width="24"
                    height="24"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    className="lucide lucide-mail h-8 w-8 text-white"
                  >
                    <rect width="20" height="16" x="2" y="4" rx="2"></rect>
                    <path d="m22 7-8.97 5.7a1.94 1.94 0 0 1-2.06 0L2 7"></path>
                  </svg>
                </div>
                <h3 className="text-2xl font-bold text-white mb-4">
                  Automated Follow-ups
                </h3>
                <p className="text-white/70 text-lg leading-relaxed">
                  Set up email and SMS sequences that nurture leads
                  automatically. Focus on selling while we handle communication.
                </p>
                <div className="absolute inset-0 bg-gradient-to-r from-cyan-500/0 via-cyan-500/5 to-cyan-500/0 opacity-0 group-hover:opacity-100 transition-opacity duration-500 rounded-2xl"></div>
              </div>
              <div className="group relative bg-white/5 backdrop-blur-xl rounded-2xl p-8 border border-white/10 hover:border-white/30 transition-all duration-500 hover:scale-105 hover:shadow-2xl hover:shadow-cyan-500/20">
                <div className="w-16 h-16 rounded-xl bg-gradient-to-br from-rose-500 to-orange-600 flex items-center justify-center mb-6 group-hover:scale-110 transition-transform duration-300">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    width="24"
                    height="24"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    className="lucide lucide-shield h-8 w-8 text-white"
                  >
                    <path d="M20 13c0 5-3.5 7.5-7.66 8.95a1 1 0 0 1-.67-.01C7.5 20.5 4 18 4 13V6a1 1 0 0 1 1-1c2 0 4.5-1.2 6.24-2.72a1.17 1.17 0 0 1 1.52 0C14.51 3.81 17 5 19 5a1 1 0 0 1 1 1z"></path>
                  </svg>
                </div>
                <h3 className="text-2xl font-bold text-white mb-4">
                  Secure &amp; Compliant
                </h3>
                <p className="text-white/70 text-lg leading-relaxed">
                  Bank-level encryption, automated backups, and compliance with
                  industry standards. Your data is safe with us.
                </p>
                <div className="absolute inset-0 bg-gradient-to-r from-cyan-500/0 via-cyan-500/5 to-cyan-500/0 opacity-0 group-hover:opacity-100 transition-opacity duration-500 rounded-2xl"></div>
              </div>
            </div>
          </div>
        </section>
        <section className="py-20 relative">
          <div className="container mx-auto px-4">
            <div className="bg-gradient-to-br from-cyan-500/10 via-blue-500/10 to-purple-500/10 backdrop-blur-xl rounded-3xl p-12 border border-white/10">
              <div className="text-center mb-12">
                <h2 className="text-4xl md:text-5xl font-black text-white mb-4">
                  Why Painting Contractors Are Excited
                </h2>
                <p className="text-xl text-white/70">
                  The CRM that finally understands the painting industry
                </p>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                <div className="bg-white/5 backdrop-blur-sm rounded-2xl p-8 border border-white/10 hover:border-cyan-500/50 transition-all group">
                  <div className="flex items-center gap-3 mb-4">
                    <div className="p-3 rounded-xl bg-gradient-to-br from-cyan-500/20 to-purple-500/20 group-hover:from-cyan-500/30 group-hover:to-purple-500/30 transition-all">
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        width="24"
                        height="24"
                        viewBox="0 0 24 24"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="2"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        className="lucide lucide-trending-up h-6 w-6 text-cyan-400"
                      >
                        <polyline points="22 7 13.5 15.5 8.5 10.5 2 17"></polyline>
                        <polyline points="16 7 22 7 22 13"></polyline>
                      </svg>
                    </div>
                    <span className="text-xs font-bold text-cyan-400 uppercase tracking-wider">
                      Real Industry Experience
                    </span>
                  </div>
                  <h3 className="text-white font-bold text-xl mb-3">
                    Built by a Painter
                  </h3>
                  <p className="text-white/70 leading-relaxed">
                    Created by a 7-figure painting company owner who knows
                    exactly what you need to succeed.
                  </p>
                </div>
                <div className="bg-white/5 backdrop-blur-sm rounded-2xl p-8 border border-white/10 hover:border-cyan-500/50 transition-all group">
                  <div className="flex items-center gap-3 mb-4">
                    <div className="p-3 rounded-xl bg-gradient-to-br from-cyan-500/20 to-purple-500/20 group-hover:from-cyan-500/30 group-hover:to-purple-500/30 transition-all">
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        width="24"
                        height="24"
                        viewBox="0 0 24 24"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="2"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        className="lucide lucide-zap h-6 w-6 text-cyan-400"
                      >
                        <path d="M4 14a1 1 0 0 1-.78-1.63l9.9-10.2a.5.5 0 0 1 .86.46l-1.92 6.02A1 1 0 0 0 13 10h7a1 1 0 0 1 .78 1.63l-9.9 10.2a.5.5 0 0 1-.86-.46l1.92-6.02A1 1 0 0 0 11 14z"></path>
                      </svg>
                    </div>
                    <span className="text-xs font-bold text-cyan-400 uppercase tracking-wider">
                      Industry-Specific AI
                    </span>
                  </div>
                  <h3 className="text-white font-bold text-xl mb-3">
                    AI That Gets Painting
                  </h3>
                  <p className="text-white/70 leading-relaxed">
                    Smart proposals, accurate estimates, and automation designed
                    specifically for paint projects.
                  </p>
                </div>
                <div className="bg-white/5 backdrop-blur-sm rounded-2xl p-8 border border-white/10 hover:border-cyan-500/50 transition-all group">
                  <div className="flex items-center gap-3 mb-4">
                    <div className="p-3 rounded-xl bg-gradient-to-br from-cyan-500/20 to-purple-500/20 group-hover:from-cyan-500/30 group-hover:to-purple-500/30 transition-all">
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        width="24"
                        height="24"
                        viewBox="0 0 24 24"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="2"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        className="lucide lucide-clock h-6 w-6 text-cyan-400"
                      >
                        <circle cx="12" cy="12" r="10"></circle>
                        <polyline points="12 6 12 12 16 14"></polyline>
                      </svg>
                    </div>
                    <span className="text-xs font-bold text-cyan-400 uppercase tracking-wider">
                      Founding Member Perks
                    </span>
                  </div>
                  <h3 className="text-white font-bold text-xl mb-3">
                    Launch Day Benefits
                  </h3>
                  <p className="text-white/70 leading-relaxed">
                    Founding members get exclusive pricing, priority support,
                    and input on new features.
                  </p>
                </div>
              </div>
              <div className="mt-12 pt-8 border-t border-white/10">
                <div className="grid grid-cols-2 md:grid-cols-4 gap-8 text-center">
                  <div>
                    <div className="text-3xl md:text-4xl font-black bg-gradient-to-r from-cyan-400 to-blue-400 bg-clip-text text-transparent">
                      7+
                    </div>
                    <div className="text-white/60 text-sm">
                      Years Industry Experience
                    </div>
                  </div>
                  <div>
                    <div className="text-3xl md:text-4xl font-black bg-gradient-to-r from-purple-400 to-pink-400 bg-clip-text text-transparent">
                      $1M+
                    </div>
                    <div className="text-white/60 text-sm">Revenue Managed</div>
                  </div>
                  <div>
                    <div className="text-3xl md:text-4xl font-black bg-gradient-to-r from-emerald-400 to-cyan-400 bg-clip-text text-transparent">
                      50+
                    </div>
                    <div className="text-white/60 text-sm">Features Built</div>
                  </div>
                  <div>
                    <div className="text-3xl md:text-4xl font-black bg-gradient-to-r from-orange-400 to-rose-400 bg-clip-text text-transparent">
                      100%
                    </div>
                    <div className="text-white/60 text-sm">Painter Focused</div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>
        <section className="py-20 relative">
          <div className="container mx-auto px-4">
            <div
              className="relative max-w-3xl mx-auto"
              style={{ opacity: "1", transform: "none" }}
            >
              {/* Gradient background blur */}
              <div className="absolute -inset-4 bg-gradient-to-r from-cyan-500/10 via-purple-500/10 to-cyan-500/10 rounded-3xl blur-xl"></div>

              {/* Main quote card */}
              <div className="relative bg-slate-900/80 backdrop-blur-xl rounded-2xl border border-slate-700/50 p-8 md:p-10">
                {/* Quote icon */}
                <div className="absolute -top-4 left-8">
                  <div className="p-2 bg-gradient-to-br from-cyan-500 to-purple-500 rounded-lg">
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      width="24"
                      height="24"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="2"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      className="lucide lucide-quote h-5 w-5 text-white"
                    >
                      <path d="M16 3a2 2 0 0 0-2 2v6a2 2 0 0 0 2 2 1 1 0 0 1 1 1v1a2 2 0 0 1-2 2 1 1 0 0 0-1 1v2a1 1 0 0 0 1 1 6 6 0 0 0 6-6V5a2 2 0 0 0-2-2z"></path>
                      <path d="M5 3a2 2 0 0 0-2 2v6a2 2 0 0 0 2 2 1 1 0 0 1 1 1v1a2 2 0 0 1-2 2 1 1 0 0 0-1 1v2a1 1 0 0 0 1 1 6 6 0 0 0 6-6V5a2 2 0 0 0-2-2z"></path>
                    </svg>
                  </div>
                </div>

                {/* Content flex container */}
                <div className="flex flex-col md:flex-row items-center md:items-start gap-8 md:gap-10">
                  {/* Founder image */}
                  <div
                    className="flex-shrink-0"
                    style={{ opacity: "1", transform: "none" }}
                  >
                    <div className="w-44 h-44 md:w-56 md:h-56 rounded-full overflow-hidden bg-slate-900 relative">
                      {/* Replace with your actual image path */}
                      <Image
                        src="/assets/images/braiden-founder-photo.png"
                        alt="Braiden Smith - Founder & CEO"
                        fill
                        className="object-cover scale-[1.35]"
                      />
                    </div>
                  </div>

                  {/* Quote text */}
                  <div className="flex-1 text-center md:text-left">
                    <p
                      className="text-lg md:text-xl text-slate-200 leading-relaxed mb-6"
                      style={{ opacity: "1" }}
                    >
                      <span className="text-cyan-400 font-medium">
                        SnapCoat is personal.
                      </span>{" "}
                      It&apos;s built from what I&apos;ve learned running a{" "}
                      <span className="text-purple-400 font-medium">
                        7-figure painting business
                      </span>
                      —what actually works, what wastes time, and what creates a{" "}
                      <span className="text-pink-400 font-medium">
                        premium experience{" "}
                      </span>
                      clients can feel.
                    </p>

                    {/* Author signature */}
                    <div
                      className="flex items-center gap-3"
                      style={{ opacity: "1", transform: "none" }}
                    >
                      <span className="text-slate-400">—</span>
                      <div
                        className="text-2xl md:text-3xl bg-gradient-to-r from-cyan-400 to-purple-400 bg-clip-text text-transparent"
                        style={{
                          fontFamily: '"Dancing Script", cursive',
                          fontWeight: 700,
                        }}
                      >
                        Braiden Smith
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Waitlist section */}
            <div className="mt-12 text-center">
              <div
                className="relative max-w-md mx-auto"
                style={{ opacity: 1, transform: "none" }}
              >
                <div className="absolute -inset-2 bg-gradient-to-r from-cyan-500/20 via-purple-500/20 to-cyan-500/20 rounded-2xl blur-xl"></div>

                <div className="relative bg-slate-900/80 backdrop-blur-xl rounded-xl border border-slate-700/50 p-6">
                  {/* Waitlist header */}
                  <div className="text-center mb-6">
                    <div className="inline-flex items-center gap-2 px-3 py-1 bg-cyan-500/10 rounded-full border border-cyan-500/30 mb-3">
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        width="24"
                        height="24"
                        viewBox="0 0 24 24"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="2"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        className="lucide lucide-sparkles h-3 w-3 text-cyan-400"
                      >
                        <path d="M9.937 15.5A2 2 0 0 0 8.5 14.063l-6.135-1.582a.5.5 0 0 1 0-.962L8.5 9.936A2 2 0 0 0 9.937 8.5l1.582-6.135a.5.5 0 0 1 .963 0L14.063 8.5A2 2 0 0 0 15.5 9.937l6.135 1.581a.5.5 0 0 1 0 .964L15.5 14.063a2 2 0 0 0-1.437 1.437l-1.582 6.135a.5.5 0 0 1-.963 0z"></path>
                        <path d="M20 3v4"></path>
                        <path d="M22 5h-4"></path>
                        <path d="M4 17v2"></path>
                        <path d="M5 18H3"></path>
                      </svg>
                      <span className="text-xs font-medium text-cyan-300">
                        Limited Founding Member Spots
                      </span>
                    </div>
                    <h3 className="text-xl font-bold text-white">
                      Get Early Access
                    </h3>
                    <p className="text-sm text-slate-400 mt-1">
                      Be first to know when we launch. Founding members get
                      special perks!
                    </p>
                  </div>

                  {/* Waitlist form */}
                  <form className="space-y-4">
                    <div className="relative">
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        width="24"
                        height="24"
                        viewBox="0 0 24 24"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="2"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        className="lucide lucide-mail absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-slate-400"
                      >
                        <rect width="20" height="16" x="2" y="4" rx="2"></rect>
                        <path d="m22 7-8.97 5.7a1.94 1.94 0 0 1-2.06 0L2 7"></path>
                      </svg>
                      <input
                        type="email"
                        className="flex w-full rounded-md border px-3 py-2 text-base ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium file:text-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 md:text-sm pl-11 h-12 bg-slate-800/50 border-slate-600 text-white placeholder:text-slate-500 focus:border-cyan-500 focus:ring-cyan-500/20"
                        placeholder="Enter your email address"
                        required
                      />
                    </div>

                    <button
                      ref={buttonRef}
                      className="inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-md ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 [&_svg]:pointer-events-none [&_svg]:size-4 [&_svg]:shrink-0 bg-primary text-primary-foreground hover:bg-primary/90 px-4 py-2 relative overflow-visible w-full h-12 text-lg font-bold bg-gradient-to-r from-cyan-500 to-purple-500 hover:from-cyan-600 hover:to-purple-600 shadow-lg shadow-cyan-500/25 transition-all duration-300 hover:shadow-cyan-500/40"
                      type="submit"
                      onMouseEnter={handleMouseEnter}
                      onMouseMove={handleMouseMove}
                      onMouseLeave={handleMouseLeave}
                    >
                      {/* Sparkles */}
                      {activeSparkles.map((sparkle) => (
                        <div
                          key={sparkle.id}
                          className="absolute pointer-events-none z-20"
                          style={{
                            left: `${sparkle.x}px`,
                            top: `${sparkle.y}px`,
                            width: `${sparkle.size}px`,
                            height: `${sparkle.size}px`,
                            transform: 'translate(-50%, -50%)',
                          }}
                        >
                          <svg
                            viewBox="0 0 24 24"
                            fill="none"
                            xmlns="http://www.w3.org/2000/svg"
                            className="sparkle-star"
                            style={{
                              width: '100%',
                              height: '100%',
                              filter: 'drop-shadow(0 0 8px rgba(251, 191, 36, 1)) drop-shadow(0 0 12px rgba(251, 191, 36, 0.8))',
                              animationDuration: `${sparkle.duration}s`,
                            }}
                          >
                            <path
                              d="M12 0L14 9L24 12L14 15L12 24L10 15L0 12L10 9L12 0Z"
                              fill="#FCD34D"
                            />
                          </svg>
                        </div>
                      ))}
                      
                      <span className="relative z-10 flex flex-row items-center">
                        <svg
                          xmlns="http://www.w3.org/2000/svg"
                          width="24"
                          height="24"
                          viewBox="0 0 24 24"
                          fill="none"
                          stroke="currentColor"
                          strokeWidth="2"
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          className="lucide lucide-sparkles h-5 w-5 mr-2"
                        >
                          <path d="M9.937 15.5A2 2 0 0 0 8.5 14.063l-6.135-1.582a.5.5 0 0 1 0-.962L8.5 9.936A2 2 0 0 0 9.937 8.5l1.582-6.135a.5.5 0 0 1 .963 0L14.063 8.5A2 2 0 0 0 15.5 9.937l6.135 1.581a.5.5 0 0 1 0 .964L15.5 14.063a2 2 0 0 0-1.437 1.437l-1.582 6.135a.5.5 0 0 1-.963 0z"></path>
                          <path d="M20 3v4"></path>
                          <path d="M22 5h-4"></path>
                          <path d="M4 17v2"></path>
                          <path d="M5 18H3"></path>
                        </svg>
                        Join the Waitlist
                      </span>
                    </button>
                  </form>

                  <p className="text-xs text-slate-500 text-center mt-4">
                    No spam, ever. Unsubscribe anytime.
                  </p>
                </div>
              </div>
            </div>

            {/* Social sharing */}
            <div className="mt-8">
              <div
                className="text-center"
                style={{ opacity: 1, transform: "none" }}
              >
                <div className="inline-flex items-center gap-2 mb-4">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    width="24"
                    height="24"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    className="lucide lucide-share2 h-4 w-4 text-slate-400"
                  >
                    <circle cx="18" cy="5" r="3"></circle>
                    <circle cx="6" cy="12" r="3"></circle>
                    <circle cx="18" cy="19" r="3"></circle>
                    <line x1="8.59" x2="15.42" y1="13.51" y2="17.49"></line>
                    <line x1="15.41" x2="8.59" y1="6.51" y2="10.49"></line>
                  </svg>
                  <span className="text-sm text-slate-400">
                    Share the excitement
                  </span>
                </div>

                <div className="flex justify-center gap-3">
                  {/* Twitter button */}
                  <button className="inline-flex items-center justify-center gap-2 whitespace-nowrap text-sm font-medium ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 [&_svg]:pointer-events-none [&_svg]:size-4 [&_svg]:shrink-0 border h-11 rounded-md px-8 border-slate-700 bg-slate-800/50 hover:bg-[#1DA1F2]/20 hover:border-[#1DA1F2]/50 text-slate-300 hover:text-[#1DA1F2] transition-all">
                    <svg
                      className="h-5 w-5 mr-2"
                      fill="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z"></path>
                    </svg>
                    Twitter
                  </button>

                  {/* Facebook button */}
                  <button className="inline-flex items-center justify-center gap-2 whitespace-nowrap text-sm font-medium ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 [&_svg]:pointer-events-none [&_svg]:size-4 [&_svg]:shrink-0 border h-11 rounded-md px-8 border-slate-700 bg-slate-800/50 hover:bg-[#1877F2]/20 hover:border-[#1877F2]/50 text-slate-300 hover:text-[#1877F2] transition-all">
                    <svg
                      className="h-5 w-5 mr-2"
                      fill="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"></path>
                    </svg>
                    Facebook
                  </button>

                  {/* LinkedIn button */}
                  <button className="inline-flex items-center justify-center gap-2 whitespace-nowrap text-sm font-medium ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 [&_svg]:pointer-events-none [&_svg]:size-4 [&_svg]:shrink-0 border h-11 rounded-md px-8 border-slate-700 bg-slate-800/50 hover:bg-[#0A66C2]/20 hover:border-[#0A66C2]/50 text-slate-300 hover:text-[#0A66C2] transition-all">
                    <svg
                      className="h-5 w-5 mr-2"
                      fill="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z"></path>
                    </svg>
                    LinkedIn
                  </button>
                </div>
              </div>
            </div>
          </div>
        </section>
        <section className="py-32 relative">
          <div className="absolute inset-0 bg-gradient-to-r from-cyan-500/20 via-blue-500/20 to-purple-500/20"></div>
          <div className="container mx-auto px-4 relative z-10">
            <div className="text-center">
              <h2 className="text-5xl md:text-7xl font-black text-white mb-6">
                Be First to Experience
                <br />
                SnapCoat CRM
              </h2>
              <p className="text-2xl text-white/80 mb-12 max-w-3xl mx-auto">
                Join the waitlist today and be among the first to transform your
                painting business
              </p>
              <a href="/signup">
                <button className="inline-flex items-center justify-center gap-2 whitespace-nowrap ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 [&_svg]:pointer-events-none [&_svg]:size-4 [&_svg]:shrink-0 bg-primary hover:bg-primary/90 h-10 relative overflow-visible bg-gradient-to-r from-cyan-500 to-purple-500 hover:from-cyan-600 hover:to-purple-600 text-white border-0 px-16 py-8 text-2xl font-bold shadow-2xl shadow-cyan-500/50 hover:shadow-cyan-500/60 transition-all duration-300 rounded-2xl group">
                  <span className="relative z-10 flex flex-row items-center">
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      width="24"
                      height="24"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="2"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      className="lucide lucide-sparkles mr-4 h-8 w-8"
                    >
                      <path d="M9.937 15.5A2 2 0 0 0 8.5 14.063l-6.135-1.582a.5.5 0 0 1 0-.962L8.5 9.936A2 2 0 0 0 9.937 8.5l1.582-6.135a.5.5 0 0 1 .963 0L14.063 8.5A2 2 0 0 0 15.5 9.937l6.135 1.581a.5.5 0 0 1 0 .964L15.5 14.063a2 2 0 0 0-1.437 1.437l-1.582 6.135a.5.5 0 0 1-.963 0z"></path>
                      <path d="M20 3v4"></path>
                      <path d="M22 5h-4"></path>
                      <path d="M4 17v2"></path>
                      <path d="M5 18H3"></path>
                    </svg>
                    Join the Waitlist
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      width="24"
                      height="24"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="2"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      className="lucide lucide-arrow-right ml-4 h-8 w-8 group-hover:translate-x-2 transition-transform"
                    >
                      <path d="M5 12h14"></path>
                      <path d="m12 5 7 7-7 7"></path>
                    </svg>
                  </span>
                  <div
                    className="absolute inset-0 rounded-[inherit] pointer-events-none"
                    style={{
                      background:
                        "radial-gradient(circle, rgba(255, 215, 0, 0.125) 0%, transparent 70%)",
                      filter: "blur(8px)",
                      opacity: 0,
                    }}
                  ></div>
                </button>
              </a>
              <p className="text-white/60 mt-8 text-lg">
                Limited founding member spots available
              </p>
            </div>
          </div>
        </section>
        <footer className="py-12 relative border-t border-white/10 bg-black/20 backdrop-blur-sm">
          <div className="container mx-auto px-4">
            <div className="flex flex-col md:flex-row justify-between items-center gap-6">
              <div className="flex items-center gap-5">
                <Image
                  src="/assets/images/logo.png"
                  alt="SnapCoat CRM"
                  width={200}
                  height={64}
                  className="h-16 w-auto opacity-80 object-contain"
                />
                <div>
                  <div className="text-white font-bold text-xl">
                    SnapCoat CRM
                  </div>
                  <div className="text-white/40 text-sm">
                    © 2025 SnapCoat LLC
                  </div>
                </div>
              </div>
              <div className="flex gap-8">
                <a
                  href="/features"
                  className="text-white/60 hover:text-white transition-colors"
                >
                  Features
                </a>
                <a
                  href="/privacy"
                  className="text-white/60 hover:text-white transition-colors"
                >
                  Privacy
                </a>
                <a
                  href="/beta-bug-report"
                  className="text-white/60 hover:text-white transition-colors"
                >
                  Beta Feedback
                </a>
              </div>
            </div>
          </div>
        </footer>
      </div>
    </div>
  );
}

