"use client";

import { useEffect, useState } from "react";
import {
  NavBar,
  Hero,
  Trending,
  Upcoming,
  CallToAction,
  SpotlightArticles,
  Footer,
} from "./others/components/Home";
import { useRouter } from "next/navigation";
import OrbClient from "./others/components/Home/OrbClient";
import Orb from "./others/components/ReactBits/Orb";
import RouteGuard from "./others/components/Auth/common/RouteGuard";
import toast from "react-hot-toast";
import { updateLocation } from "./others/services/userServices/userServices";
import { useSelector } from "react-redux";
import { RootState } from "./others/redux/store";

interface Movie {
  id: string;
  title: string;
  genre: string;
  rating: number;
  duration: string;
  poster: string;
  trailer: string;
  showtimes: string[];
  price: number;
}

export default function LandingPage() {

  const [selectedMovie, setSelectedMovie] = useState<Movie | null>(null);
  const router = useRouter();
  useEffect(() => {
    requestLocationAccess();
  }, []);
  const isAuthenticated = useSelector(
    (state: RootState
    ) => state.auth.isAuthenticated
  );

  const requestLocationAccess = () => {
    if (!navigator.geolocation) {
      toast.error("Sorry Geolocation not supported");
      return;
    }

    navigator.geolocation.getCurrentPosition(
      (position) => {
        const locationData = {
          latitude: position.coords.latitude,
          longitude: position.coords.longitude,
        };

        localStorage.setItem('userLocation', JSON.stringify(locationData));
        console.log('Location accessed:', locationData);

        async function updateLocationApi(locationData: { latitude: number, longitude: number }) {
          try {
            const data = await updateLocation(locationData)
            console.log(data.data);
            toast.success('location updated')
          } catch (error) {
            console.log(error);


          }
        }
        if (isAuthenticated) {
          updateLocationApi(locationData)
        }
      },
      (error) => {
        console.error('Location access denied or failed:', error);
      },
      {
        enableHighAccuracy: true,
        timeout: 10000,
        maximumAge: 300000
      }
    );
  };


  return (
    <RouteGuard allowUnauthenticated={true} allowedRoles={["user"]}>
    <div className="relative min-h-screen bg-black overflow-hidden">
      <div className="fixed inset-0 z-0 pointer-events-none">
        <Orb
          hoverIntensity={0.5}
          rotateOnHover={true}
          hue={0}
          forceHoverState={false}
        />
      </div>

      <div className="relative z-10">
        <NavBar />
        <Hero />
        <Trending />
        <Upcoming />
        <CallToAction />
        <SpotlightArticles />
        <Footer />
      </div>
    </div>
    </RouteGuard>
  );
}
