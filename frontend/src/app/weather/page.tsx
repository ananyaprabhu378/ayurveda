"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Cloud, Sun, CloudRain, Thermometer, Wind, Droplets, Sparkles, Leaf, Info, AlertTriangle, MapPin, RefreshCw } from "lucide-react";
import ForestBackground from "@/components/3d/ForestBackground";

interface WeatherData {
  temperature: number;
  windspeed: number;
  weathercode: number;
  time: string;
}

export default function WeatherDoshaPage() {
  const [weather, setWeather] = useState<WeatherData | null>(null);
  const [loading, setLoading] = useState(true);
  const [location, setLocation] = useState<{ lat: number; lon: number } | null>(null);

  useEffect(() => {
    // Attempt to get user location
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          const { latitude, longitude } = position.coords;
          setLocation({ lat: latitude, lon: longitude });
          fetchWeather(latitude, longitude);
        },
        () => {
          // Fallback to New Delhi if geolocation fails
          const lat = 28.6139;
          const lon = 77.2090;
          setLocation({ lat, lon });
          fetchWeather(lat, lon);
        }
      );
    } else {
      // Fallback
      const lat = 28.6139;
      const lon = 77.2090;
      setLocation({ lat, lon });
      fetchWeather(lat, lon);
    }
  }, []);

  const fetchWeather = async (lat: number, lon: number) => {
    try {
      const response = await fetch(
        `https://api.open-meteo.com/v1/forecast?latitude=${lat}&longitude=${lon}&current_weather=true`
      );
      const data = await response.json();
      setWeather(data.current_weather);
    } catch (error) {
      console.error("Failed to fetch weather:", error);
    } finally {
      setLoading(false);
    }
  };

  const getWeatherDescription = (code: number) => {
    if (code === 0) return "Clear Sky";
    if (code >= 1 && code <= 3) return "Partly Cloudy";
    if (code >= 45 && code <= 48) return "Foggy";
    if (code >= 51 && code <= 67) return "Rainy";
    if (code >= 71 && code <= 77) return "Snowy";
    if (code >= 80 && code <= 82) return "Rain Showers";
    if (code >= 95) return "Thunderstorm";
    return "Variable";
  };

  const getDoshaAnalysis = (temp: number, wind: number, code: number) => {
    let aggravation = "";
    let recommendations = {
      herbs: [] as string[],
      foods: [] as string[],
      routine: [] as string[],
    };

    if (temp < 15) {
      aggravation = "Vata & Kapha";
      recommendations = {
        herbs: ["Ginger", "Ashwagandha", "Tulsi"],
        foods: ["Warm soups", "Spicy stews", "Hot herbal teas"],
        routine: ["Dry massage (Garshana)", "Warm baths", "Morning Sun exposure"],
      };
    } else if (temp > 30) {
      aggravation = "Pitta";
      recommendations = {
        herbs: ["Shatavari", "Aloe Vera", "Brahmi"],
        foods: ["Cucumber", "Coconut water", "Sweet fruits"],
        routine: ["Moonlight walks", "Cooling Pranayama", "Avoid intense midday sun"],
      };
    } else {
      aggravation = "Pitta & Kapha (Seasonal balance)";
      recommendations = {
        herbs: ["Triphala", "Turmeric", "Amla"],
        foods: ["Seasonal vegetables", "Whole grains", "Ghee"],
        routine: ["Moderate exercise", "Pranayama", "Abhyanga (Oil massage)"],
      };
    }

    if (wind > 20) aggravation += " (High Vata risk due to wind)";

    return { aggravation, recommendations };
  };

  const analysis = weather ? getDoshaAnalysis(weather.temperature, weather.windspeed, weather.weathercode) : null;

  return (
    <div className="relative min-h-screen pt-20 pb-12 px-6 overflow-hidden">
      <ForestBackground />

      <div className="relative z-10 max-w-5xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-10 text-center lg:text-left"
        >
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 text-xs font-medium uppercase tracking-wider mb-4">
            <Cloud className="w-3 h-3" /> Seasonal Intelligence
          </div>
          <h1 className="text-4xl md:text-5xl font-serif font-bold text-white mb-4">
            Weather <span className="text-emerald-400 text-gradient">& Dosha</span>
          </h1>
          <p className="text-emerald-100/60 max-w-2xl">
            The environment outside mirrors the environment within. Discover how today's atmospheric conditions affect your Ayurvedic constitution.
          </p>
        </motion.div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Weather Display */}
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="lg:col-span-1 bg-card/30 backdrop-blur-xl rounded-3xl border border-emerald-500/20 p-8 shadow-2xl relative overflow-hidden"
          >
            {loading ? (
              <div className="h-64 flex flex-col items-center justify-center">
                <RefreshCw className="w-10 h-10 text-emerald-400 animate-spin mb-4" />
                <p className="text-emerald-100/40 text-sm italic">Sensing the atmosphere...</p>
              </div>
            ) : weather ? (
              <>
                <div className="flex items-center gap-2 text-emerald-400/70 text-xs font-bold uppercase tracking-tighter mb-8">
                  <MapPin className="w-3 h-3" /> Current Atmosphere
                </div>

                <div className="flex flex-col items-center mb-10">
                  <div className="w-24 h-24 rounded-full bg-emerald-500/10 flex items-center justify-center mb-6 shadow-[0_0_40px_rgba(80,200,120,0.1)]">
                    {weather.weathercode === 0 ? <Sun className="w-12 h-12 text-orange-400" /> :
                     weather.weathercode >= 51 ? <CloudRain className="w-12 h-12 text-blue-400" /> :
                     <Cloud className="w-12 h-12 text-emerald-100/60" />}
                  </div>
                  <h2 className="text-5xl font-serif font-bold text-white mb-2">{weather.temperature}°C</h2>
                  <p className="text-emerald-400 font-medium tracking-wide">{getWeatherDescription(weather.weathercode)}</p>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div className="bg-white/5 rounded-2xl p-4 border border-white/5">
                    <Wind className="w-4 h-4 text-emerald-400/70 mb-2" />
                    <p className="text-[10px] text-white/40 uppercase font-bold tracking-tighter">Wind Speed</p>
                    <p className="text-white text-sm font-medium">{weather.windspeed} km/h</p>
                  </div>
                  <div className="bg-white/5 rounded-2xl p-4 border border-white/5">
                    <Droplets className="w-4 h-4 text-emerald-400/70 mb-2" />
                    <p className="text-[10px] text-white/40 uppercase font-bold tracking-tighter">Humidity</p>
                    <p className="text-white text-sm font-medium">Moderate</p>
                  </div>
                </div>
                
                <p className="mt-8 text-[10px] text-emerald-100/30 text-center italic">Updated: {new Date(weather.time).toLocaleTimeString()}</p>
              </>
            ) : (
              <div className="text-center py-20">
                <AlertTriangle className="w-12 h-12 text-amber-500 mx-auto mb-4" />
                <p className="text-white">Could not sync with the cosmic winds.</p>
              </div>
            )}
            
            {/* Background reactive light */}
            {weather && (
              <div className={`absolute -bottom-20 -right-20 w-40 h-40 rounded-full blur-[100px] opacity-30 ${
                weather.temperature > 30 ? "bg-orange-500" : weather.temperature < 15 ? "bg-blue-500" : "bg-emerald-500"
              }`} />
            )}
          </motion.div>

          {/* Dosha Analysis & Recommendations */}
          <div className="lg:col-span-2 space-y-8">
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              className="bg-card/30 backdrop-blur-xl rounded-3xl border border-emerald-500/20 p-8"
            >
              <h3 className="text-emerald-400 text-xs font-bold uppercase tracking-widest mb-6 flex items-center gap-2">
                <Thermometer className="w-4 h-4" /> Dosha Aggravation Alert
              </h3>
              
              {!loading && analysis && (
                <div className="flex flex-col md:flex-row gap-8 items-center">
                  <div className="relative w-32 h-32 flex-shrink-0">
                    <div className="absolute inset-0 rounded-full bg-emerald-500/10 border border-emerald-500/30 animate-pulse" />
                    <div className="absolute inset-0 flex items-center justify-center">
                      <Sparkles className="w-10 h-10 text-emerald-400" />
                    </div>
                  </div>
                  <div>
                    <h4 className="text-2xl font-serif font-bold text-white mb-3">Today's conditions primarily affect <span className="text-emerald-400">{analysis.aggravation}</span>.</h4>
                    <p className="text-emerald-100/60 leading-relaxed text-sm">
                      Ayurveda teaches that external environment dictates our internal rhythm. Today's {getWeatherDescription(weather?.weathercode || 0).toLowerCase()} weather requires specific adjustments to maintain equilibrium.
                    </p>
                  </div>
                </div>
              )}
            </motion.div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {[
                { title: "Herbal Support", items: analysis?.recommendations.herbs || [], icon: <Leaf className="text-emerald-400" /> },
                { title: "Seasonal Diet", items: analysis?.recommendations.foods || [], icon: <Droplets className="text-blue-400" /> },
                { title: "Daily Rituals", items: analysis?.recommendations.routine || [], icon: <Sparkles className="text-amber-400" /> },
              ].map((section, idx) => (
                <motion.div
                  key={idx}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.2 + idx * 0.1 }}
                  className="bg-card/20 backdrop-blur-xl rounded-3xl border border-white/5 p-6 flex flex-col"
                >
                  <div className="flex items-center gap-2 mb-4">
                    <div className="p-2 rounded-lg bg-white/5 border border-white/10">
                      {section.icon}
                    </div>
                    <h4 className="text-white font-serif font-semibold">{section.title}</h4>
                  </div>
                  <ul className="space-y-3 mt-auto">
                    {section.items.map((item, i) => (
                      <li key={i} className="text-xs text-emerald-100/60 flex items-start gap-2">
                        <span className="w-1.5 h-1.5 rounded-full bg-emerald-500/50 mt-1" />
                        {item}
                      </li>
                    ))}
                  </ul>
                </motion.div>
              ))}
            </div>

            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.6 }}
              className="p-6 rounded-2xl bg-emerald-500/5 border border-emerald-500/20 flex gap-4 items-center"
            >
              <Info className="w-6 h-6 text-emerald-400 flex-shrink-0" />
              <p className="text-xs text-emerald-100/60 leading-relaxed italic">
                Pro Tip: In {weather?.temperature && weather.temperature > 30 ? "hot" : "cooler"} weather like today, your "Agni" (digestive fire) behaves differently. Aligning your meals with atmospheric temperature is key to longevity.
              </p>
            </motion.div>
          </div>
        </div>
      </div>
    </div>
  );
}
