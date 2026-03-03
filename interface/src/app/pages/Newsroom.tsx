import { useState } from "react";
import {
  Globe,
  Search,
  ChevronLeft,
  ChevronRight,
  Heart,
} from "lucide-react";
import { Footer } from "@/app/components/Footer";
import { ImageWithFallback } from "@/app/components/figma/ImageWithFallback";

interface NewsroomProps {
  onNavigate: (page: string) => void;
}

export function Newsroom({ onNavigate }: NewsroomProps) {
  const [currentSlide, setCurrentSlide] = useState(0);
  const [activeFilter, setActiveFilter] = useState("All");

  const latestNews = [
    {
      image:
        "https://images.unsplash.com/photo-1611849793043-e080fc18205e?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHx3aW50ZXIlMjBjYWJpbiUyMHNub3d8ZW58MXx8fHwxNzY4OTgzMjM3fDA&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral",
      title:
        "The winter destinations defining Canadian travel this season",
      date: "January 14, 2026",
    },
    {
      image:
        "https://images.unsplash.com/photo-1560250097-0b93528c311a?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxidXNpbmVzc21hbiUyMHBvcnRyYWl0fGVufDF8fHx8MTc2ODkyNDYzOHww&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral",
      title:
        "HOMIQIO announces Ahmad Al-Dahle as Chief Technology Officer",
      date: "January 14, 2026",
      underline: true,
    },
    {
      image:
        "https://images.unsplash.com/photo-1765200231155-11e6ca7cb772?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHx3b21hbiUyMGNvb2tpbmclMjBob21lfGVufDF8fHx8MTc2ODk4MzIzN3ww&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral",
      title:
        "HOMIQIO.org and 211 LA announce disaster response partnership",
      date: "January 13, 2026",
    },
    {
      image:
        "https://images.unsplash.com/photo-1558002038-1055907df827?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxzbWFydCUyMGxvY2slMjBkb29yfGVufDF8fHx8MTc2ODk4MzIzOHww&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral",
      title:
        "Launching our anti-party technology for New Year's Eve stays",
      date: "December 20, 2025",
    },
  ];

  const originals = [
    {
      image:
        "https://images.unsplash.com/photo-1739272135664-0c6342ffd470?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxsdXh1cnklMjB0aGVhdGVyJTIwc3RhZ2V8ZW58MXx8fHwxNzY4OTgzMjM4fDA&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral",
      title:
        "Sabrina Carpenter invites fans to step into her Short n' Sweet Show set",
      date: "October 15, 2025",
    },
    {
      image:
        "https://images.unsplash.com/photo-1757190412440-80e3bf8d7d0f?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxncmFuZCUyMG11c2V1bSUyMGFyY2hpdGVjdHVyZXxlbnwxfHx8fDE3Njg5ODMyMzl8MA&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral",
      title:
        "Announcing our landmark multi-year global partnership with Art Basel",
      date: "September 19, 2025",
    },
    {
      image:
        "https://images.unsplash.com/photo-1765845216367-b78f8eac3100?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxtb2Rlcm4lMjBjb25jZXJ0JTIwdmVudWV8ZW58MXx8fHwxNzY4OTgzMjM5fDA&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral",
      title:
        "Step into the Short n' Sweet Show with Sabrina Carpenter's glam team in LA",
      date: "October 20, 2025",
    },
  ];

  const topicFilters = [
    "All",
    "Company",
    "Stays",
    "Experiences",
    "Product",
    "Policy",
    "Homiqio.org",
  ];

  const newsByTopic = [
    {
      image:
        "https://images.unsplash.com/photo-1562003487-7409c78f7f60?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxldXJvcGVhbiUyMGNpdHklMjB0b3VyaXN0c3xlbnwxfHx8fDE3Njg5ODQyNDh8MA&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral",
      title:
        "Calling on EU cities to tackle the 'overwhelming impact' of hotels on overtourism",
      date: "June 14, 2025",
      category: "Policy",
    },
    {
      image:
        "https://images.unsplash.com/photo-1605108222700-0d605d9ebafe?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxtb2JpbGUlMjBhcHAlMjBpbnRlcmZhY2V8ZW58MXx8fHwxNzY4ODk0MzIzfDA&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral",
      title:
        "2025 Summer Release: Now you can Airbnb more than an Airbnb",
      date: "May 13, 2025",
      category: "Product",
    },
    {
      image:
        "https://images.unsplash.com/photo-1647025475422-096283e43be9?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxuZXclMjB5b3JrJTIwYnJpZGdlJTIwcml2ZXJ8ZW58MXx8fHwxNzY4OTg0MjQ5fDA&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral",
      title:
        "NYC sees record rents, hotel rates as short-term rental law continues",
      date: "May 5, 2025",
      category: "Policy",
    },
    {
      image:
        "https://images.unsplash.com/photo-1759132317197-4dd225c628f3?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHx0cmF2ZWxlcnMlMjBsdWdnYWdlJTIwZG9vcndheXxlbnwxfHx8fDE3Njg5ODQyNDl8MA&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral",
      title:
        "Total price display is now standard for guests worldwide",
      date: "April 20, 2025",
      category: "Product",
    },
    {
      image:
        "https://images.unsplash.com/photo-1757861212219-9ae3d9eaffbf?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxjYWJpbiUyMHBvcmNoJTIwcGVvcGxlfGVufDF8fHx8MTc2ODk4NDI1MHww&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral",
      title:
        "Airbnb has generated $13.5B in tourism taxes for communities around the world",
      date: "April 8, 2025",
      category: "Company",
    },
    {
      image:
        "https://images.unsplash.com/photo-1592431167425-3bb3d0cab2ca?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHx5ZWxsb3clMjBkb29yJTIwZW50cmFuY2V8ZW58MXx8fHwxNzY4OTg0MjUwfDA&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral",
      title:
        "HotelTonight launches new perk: Earn Airbnb credit with every hotel stay",
      date: "March 25, 2025",
      category: "Product",
    },
    {
      image:
        "https://images.unsplash.com/photo-1631631813771-5e041d6be4b1?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxtb250cmVhbCUyMHN0cmVldCUyMGJ1aWxkaW5nc3xlbnwxfHx8fDE3Njg5ODQyNTF8MA&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral",
      title:
        "Montreal's extreme regulations risk over $400 million in economic activity",
      date: "March 20, 2025",
      category: "Policy",
    },
    {
      image:
        "https://images.unsplash.com/photo-1625578782042-3f2ad4f42956?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxsdXh1cnklMjBiZWRyb29tJTIwaW50ZXJpb3J8ZW58MXx8fHwxNzY4OTIxNDU2fDA&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral",
      title:
        "Our commitment to providing the highest quality stays",
      date: "February 26, 2025",
      category: "Stays",
    },
    {
      image: "placeholder",
      title: "The actions we're taking on pricing in LA",
      date: "January 15, 2025",
      category: "Policy",
    },
    {
      image:
        "https://images.unsplash.com/photo-1739298061740-5ed03045b280?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHx0ZWFtJTIwbWVldGluZyUyMGNvbGxhYm9yYXRpb258ZW58MXx8fHwxNzY4OTg0MjU3fDA&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral",
      title:
        "Airbnb 2024 Winter Release: Introducing Co-Host Network—the best local hosts to manage your Airbnb",
      date: "October 15, 2024",
      category: "Product",
    },
    {
      image:
        "https://images.unsplash.com/photo-1591084261819-7c967caf7d06?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxwYXJpcyUyMHBhcmFseW1waWMlMjB3aGVlbGNoYWlyfGVufDF8fHx8MTc2ODk4NDI1Mnww&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral",
      title:
        "Paris 2024 Paralympic Games countdown: Tips to book last-minute on Airbnb",
      date: "August 7, 2024",
      category: "Experiences",
    },
    {
      image:
        "https://images.unsplash.com/photo-1723110994499-df46435aa4b3?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxsdXh1cnklMjBob21lJTIwZXh0ZXJpb3J8ZW58MXx8fHwxNzY4ODg1MjQwfDA&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral",
      title:
        "Revealing 10 of the top 1% homes around the world",
      date: "June 9, 2024",
      category: "Stays",
    },
    {
      image:
        "https://images.unsplash.com/photo-1738970361018-848be032aa09?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxsaXNib24lMjBjb2xvcmZ1bCUyMHN0cmVldHxlbnwxfHx8fDE3Njg5ODM3MTd8MA&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral",
      title:
        "Lisbon overturns short-term rental rules that failed to cut housing costs",
      date: "December 17, 2025",
      category: "Policy",
    },
    {
      image:
        "https://images.unsplash.com/photo-1643186774328-a72c1bbe74ec?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxtb3VudGFpbiUyMGNhYmluJTIwc3Vuc2V0fGVufDF8fHx8MTc2ODk4MzcxOHww&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral",
      title: "2026 travel predictions revealed",
      date: "December 8, 2025",
      category: "Stays",
    },
    {
      image:
        "https://images.unsplash.com/photo-1764046176038-4503f91c450e?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxjb21tdW5pdHklMjBwZW9wbGUlMjBvdXRkb29yfGVufDF8fHx8MTc2ODk4MzcxOHww&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral",
      title:
        "Airbnb announces over $1M historic investment into Houston community alongside FIFA World Cup 26™ Houston Host Committee",
      date: "December 2, 2025",
      category: "Homiqio.org",
    },
    {
      image:
        "https://images.unsplash.com/photo-1594873604892-b599f847e859?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxtb2Rlcm4lMjBhcGFydG1lbnQlMjBpbnRlcmlvcnxlbnwxfHx8fDE3Njg5MjYwMjZ8MA&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral",
      title:
        "Three years of growth: The state of Airbnb-friendly real estate",
      date: "November 20, 2025",
      category: "Company",
    },
    {
      image:
        "https://images.unsplash.com/photo-1737231803078-329cfea6ab4c?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxzYW4lMjBkaWVnbyUyMGNvbW11bml0eXxlbnwxfHx8fDE3Njg5ODM3MTh8MA&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral",
      title:
        "San Diego community nonprofits receive $425,000 from Airbnb",
      date: "November 17, 2025",
      category: "Homiqio.org",
    },
    {
      image:
        "https://images.unsplash.com/photo-1638250105171-ab4c570e7923?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHx2YW5jb3V2ZXIlMjBjaXR5JTIwbmlnaHR8ZW58MXx8fHwxNzY4OTgzNzE5fDA&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral",
      title:
        "Record summer hotel prices in Vancouver as FIFA World Cup 26™ nears",
      date: "November 11, 2025",
      category: "Stays",
    },
    {
      image:
        "https://images.unsplash.com/photo-1658929638325-4b9f73b8bdb1?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxuZW9uJTIwY2l0eXNjYXBlJTIwbmlnaHR8ZW58MXx8fHwxNzY4OTEwMjM5fDA&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral",
      title: "Airbnb Q3 2025 financial results",
      date: "November 6, 2025",
      category: "Company",
    },
    {
      image:
        "https://images.unsplash.com/photo-1764874299025-d8b2251f307d?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxhd2FyZCUyMGNlcmVtb255JTIwZXZlbnR8ZW58MXx8fHwxNzY4OTgzNzIwfDA&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral",
      title:
        "Airbnb hosts Housing Action Coalition's 23rd Annual Housing Heroes Awards",
      date: "November 3, 2025",
      category: "Homiqio.org",
    },
    {
      image: "placeholder",
      title:
        "New Michigan tourism proposal could deliver over $20M a year locally for essential services",
      date: "October 30, 2025",
      category: "Policy",
    },
    {
      image: "placeholder",
      title:
        "Airbnb.org offers free emergency housing for Hurricane Melissa",
      date: "October 29, 2025",
      category: "Homiqio.org",
    },
    {
      image:
        "https://images.unsplash.com/photo-1606388701602-2e3727da5b28?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxzbm93eSUyMGxhbmRzY2FwZSUyMHdpbnRlcnxlbnwxfHx8fDE3Njg5ODM3MjB8MA&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral",
      title:
        "Emerging destinations redefine winter travel this season",
      date: "October 27, 2025",
      category: "Stays",
    },
    {
      image:
        "https://images.unsplash.com/photo-1643758649222-a9bff2bc2b85?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxvbGQlMjBwYXlwaG9uZSUyMHZpbnRhZ2V8ZW58MXx8fHwxNzY4OTgzNzI2fDA&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral",
      title: "Rolling out our anti-party system for Halloween",
      date: "October 26, 2025",
      category: "Product",
    },
    {
      image:
        "https://images.unsplash.com/photo-1719464521902-4dc9595b182d?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxwaG9uZSUyMGFwcCUyMGludGVyZmFjZXxlbnwxfHx8fDE3Njg5ODM3MjB8MA&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral",
      title:
        "Introducing social features for Airbnb Experiences: a new way to connect with other guests before, during, and after your trip",
      date: "October 20, 2025",
      category: "Experiences",
    },
    {
      image:
        "https://images.unsplash.com/photo-1765046804547-06375f9a707b?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxzb2NjZXIlMjB0ZWFtJTIwZ3JvdXB8ZW58MXx8fHwxNzY4ODgwMzAwfDA&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral",
      title:
        "Airbnb announces local investment with FIFA World Cup 26™ NYNJ Host Committee to build community legacy",
      date: "September 30, 2025",
      category: "Homiqio.org",
    },
    {
      image:
        "https://images.unsplash.com/photo-1647655806923-e8202f4f2b8c?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHx2YW5jb3V2ZXIlMjBza3lsaW5lfGVufDF8fHx8MTc2ODk4MzcyMXww&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral",
      title:
        "Special event hosting rules urged in Vancouver during FIFA",
      date: "September 30, 2025",
      category: "Policy",
    },
    {
      image: "placeholder",
      title:
        "Marking three years of our Trust and Safety Advisory Coalition",
      date: "September 11, 2025",
      category: "Company",
    },
    {
      image:
        "https://images.unsplash.com/photo-1599602329041-c8e04fa03f73?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxjb3VwbGUlMjBwZW9wbGUlMjBkb29yc3RlcHxlbnwxfHx8fDE3Njg5ODM3MjV8MA&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral",
      title:
        "Two years later, momentum grows to reform New York short-term rental rules",
      date: "September 2, 2025",
      category: "Policy",
    },
    {
      image:
        "https://images.unsplash.com/photo-1723536150355-a4f5f87e5827?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxjYWJpbiUyMGZvcmVzdCUyMGdyZWVufGVufDF8fHx8MTc2ODk4MzcyNnww&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral",
      title:
        "Our new feature to educate guests on water safety",
      date: "August 19, 2025",
      category: "Product",
    },
    {
      image:
        "https://images.unsplash.com/photo-1719464521902-4dc9595b182d?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxwaG9uZSUyMGFwcCUyMGludGVyZmFjZXxlbnwxfHx8fDE3Njg5ODM3MjB8MA&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral",
      title:
        "Introducing 'Reserve Now, Pay Later', giving guests greater flexibility",
      date: "August 13, 2025",
      category: "Product",
    },
    {
      image:
        "https://images.unsplash.com/photo-1641849460748-7081ab1a4cef?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxmYW1pbHklMjBzaWxob3VldHRlJTIwc3Vuc2V0fGVufDF8fHx8MTc2ODk4MzcyNnww&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral",
      title:
        "An opportunity for destinations to open up to family travel",
      date: "July 10, 2025",
      category: "Experiences",
    },
  ];

  const filteredNews =
    activeFilter === "All"
      ? newsByTopic
      : newsByTopic.filter(
          (news) => news.category === activeFilter,
        );

  const nextSlide = () => {
    setCurrentSlide((prev) => (prev + 1) % originals.length);
  };

  const prevSlide = () => {
    setCurrentSlide(
      (prev) =>
        (prev - 1 + originals.length) % originals.length,
    );
  };

  return (
    <div className="min-h-screen bg-white flex flex-col">
      {/* Header */}
      <header className="bg-white border-b border-gray-200 sticky top-0 z-50">
        <div className="px-4 sm:px-6 lg:px-16 h-16 flex items-center justify-between">
          {/* Logo & Newsroom */}
          <div className="flex items-center gap-2">
            <button
              onClick={() => onNavigate("logements")}
              className="hover:opacity-80 transition-opacity"
            >
              <svg
                className="w-7 h-7"
                viewBox="0 0 32 32"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  d="M16 1.5C11.5 1.5 7.5 4 5.5 7.5C3.5 11 3 15 4.5 19C6 23 9.5 26.5 13 28.5C14 29 15 29.5 16 29.5C17 29.5 18 29 19 28.5C22.5 26.5 26 23 27.5 19C29 15 28.5 11 26.5 7.5C24.5 4 20.5 1.5 16 1.5ZM16 20C13.8 20 12 18.2 12 16C12 13.8 13.8 12 16 12C18.2 12 20 13.8 20 16C20 18.2 18.2 20 16 20Z"
                  fill="#10B981"
                />
              </svg>
            </button>
            <span className="text-sm font-semibold">
              Newsroom
            </span>
          </div>

          {/* Center Navigation Links */}
          <nav className="hidden md:flex items-center gap-6">
            <a
              href="#"
              className="text-sm hover:text-gray-600 transition-colors"
            >
              About us
            </a>
            <a
              href="#"
              className="text-sm hover:text-gray-600 transition-colors"
            >
              Media assets
            </a>
            <a
              href="#"
              className="text-sm hover:text-gray-600 transition-colors"
            >
              Product releases
            </a>
            <a
              href="#"
              className="text-sm hover:text-gray-600 transition-colors"
            >
              Contact
            </a>
          </nav>

          {/* Right Actions */}
          <div className="flex items-center gap-3">
            <button className="p-1.5 hover:bg-gray-100 rounded-full transition-colors">
              <Globe className="w-4 h-4" />
            </button>
            <button className="flex items-center gap-1.5 text-xs hover:text-gray-600 transition-colors">
              <Search className="w-4 h-4" />
              <span className="hidden sm:inline">Search</span>
            </button>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section className="px-4 sm:px-6 lg:px-16 py-10 lg:py-14">
        <div className="max-w-7xl mx-auto">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-center">
            {/* Left Content */}
            <div>
              <p className="text-xs text-gray-500 mb-3">
                January 21, 2026
              </p>
              <h1
                className="text-3xl sm:text-4xl lg:text-5xl mb-5 leading-tight"
                style={{ fontWeight: 600 }}
              >
                The most loved HOMIQIOs on social in 2025
              </h1>
              <button className="bg-[#E91E63] hover:bg-[#C2185B] text-white px-5 py-2.5 rounded-lg text-sm font-semibold transition-colors">
                Read more
              </button>
            </div>

            {/* Right Image */}
            <div className="relative">
              <ImageWithFallback
                src="https://images.unsplash.com/photo-1759304054342-a027f6cdc9b7?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxhcnRpc3RpYyUyMGFyY2hpdGVjdHVyZSUyMG1vc2FpY3xlbnwxfHx8fDE3Njg5ODMyMzZ8MA&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral"
                alt="Featured story"
                className="w-full h-[400px] object-cover rounded-xl"
              />
            </div>
          </div>
        </div>
      </section>

      {/* Latest News Section */}
      <section className="px-4 sm:px-6 lg:px-16 py-10 bg-gray-50">
        <div className="max-w-7xl mx-auto">
          <h2
            className="text-2xl sm:text-3xl mb-6"
            style={{ fontWeight: 600 }}
          >
            Latest news
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
            {latestNews.map((news, index) => (
              <article
                key={index}
                className="group cursor-pointer"
              >
                <div className="mb-3 overflow-hidden rounded-xl">
                  <ImageWithFallback
                    src={news.image}
                    alt={news.title}
                    className="w-full h-40 object-cover group-hover:scale-105 transition-transform duration-300"
                  />
                </div>
                <h3
                  className={`text-sm mb-1.5 leading-snug ${
                    news.underline ? "underline" : ""
                  }`}
                  style={{ fontWeight: 600 }}
                >
                  {news.title}
                </h3>
                <p className="text-xs text-gray-600">
                  {news.date}
                </p>
              </article>
            ))}
          </div>
        </div>
      </section>

      {/* Social Follow Section */}
      <section className="px-4 sm:px-6 lg:px-16 py-6 border-b border-gray-200">
        <div className="max-w-7xl mx-auto text-center">
          <h3
            className="text-sm mb-4"
            style={{ fontWeight: 600 }}
          >
            Follow HOMIQIO for news and travel inspiration
          </h3>
          <div className="flex items-center justify-center gap-3">
            {/* X (Twitter) */}
            <a
              href="#"
              className="w-10 h-10 rounded-full border-2 border-gray-900 flex items-center justify-center hover:bg-gray-100 transition-colors"
              aria-label="X"
            >
              <svg
                className="w-4 h-4"
                fill="currentColor"
                viewBox="0 0 24 24"
              >
                <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
              </svg>
            </a>

            {/* Instagram */}
            <a
              href="#"
              className="w-10 h-10 rounded-full border-2 border-gray-900 flex items-center justify-center hover:bg-gray-100 transition-colors"
              aria-label="Instagram"
            >
              <svg
                className="w-4 h-4"
                fill="currentColor"
                viewBox="0 0 24 24"
              >
                <path d="M12 0C8.74 0 8.333.015 7.053.072 5.775.132 4.905.333 4.14.63c-.789.306-1.459.717-2.126 1.384S.935 3.35.63 4.14C.333 4.905.131 5.775.072 7.053.012 8.333 0 8.74 0 12s.015 3.667.072 4.947c.06 1.277.261 2.148.558 2.913.306.788.717 1.459 1.384 2.126.667.666 1.336 1.079 2.126 1.384.766.296 1.636.499 2.913.558C8.333 23.988 8.74 24 12 24s3.667-.015 4.947-.072c1.277-.06 2.148-.262 2.913-.558.788-.306 1.459-.718 2.126-1.384.666-.667 1.079-1.335 1.384-2.126.296-.765.499-1.636.558-2.913.06-1.28.072-1.687.072-4.947s-.015-3.667-.072-4.947c-.06-1.277-.262-2.149-.558-2.913-.306-.789-.718-1.459-1.384-2.126C21.319 1.347 20.651.935 19.86.63c-.765-.297-1.636-.499-2.913-.558C15.667.012 15.26 0 12 0zm0 2.16c3.203 0 3.585.016 4.85.071 1.17.055 1.805.249 2.227.415.562.217.96.477 1.382.896.419.42.679.819.896 1.381.164.422.36 1.057.413 2.227.057 1.266.07 1.646.07 4.85s-.015 3.585-.074 4.85c-.061 1.17-.256 1.805-.421 2.227-.224.562-.479.96-.899 1.382-.419.419-.824.679-1.38.896-.42.164-1.065.36-2.235.413-1.274.057-1.649.07-4.859.07-3.211 0-3.586-.015-4.859-.074-1.171-.061-1.816-.256-2.236-.421-.569-.224-.96-.479-1.379-.899-.421-.419-.69-.824-.9-1.38-.165-.42-.359-1.065-.42-2.235-.045-1.26-.061-1.649-.061-4.844 0-3.196.016-3.586.061-4.861.061-1.17.255-1.814.42-2.234.21-.57.479-.96.9-1.381.419-.419.81-.689 1.379-.898.42-.166 1.051-.361 2.221-.421 1.275-.045 1.65-.06 4.859-.06l.045.03zm0 3.678c-3.405 0-6.162 2.76-6.162 6.162 0 3.405 2.76 6.162 6.162 6.162 3.405 0 6.162-2.76 6.162-6.162 0-3.405-2.76-6.162-6.162-6.162zM12 16c-2.21 0-4-1.79-4-4s1.79-4 4-4 4 1.79 4 4-1.79 4-4 4zm7.846-10.405c0 .795-.646 1.44-1.44 1.44-.795 0-1.44-.646-1.44-1.44 0-.794.646-1.439 1.44-1.439.793-.001 1.44.645 1.44 1.439z" />
              </svg>
            </a>

            {/* LinkedIn */}
            <a
              href="#"
              className="w-10 h-10 rounded-full border-2 border-gray-900 flex items-center justify-center hover:bg-gray-100 transition-colors"
              aria-label="LinkedIn"
            >
              <svg
                className="w-4 h-4"
                fill="currentColor"
                viewBox="0 0 24 24"
              >
                <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z" />
              </svg>
            </a>

            {/* TikTok */}
            <a
              href="#"
              className="w-10 h-10 rounded-full border-2 border-gray-900 flex items-center justify-center hover:bg-gray-100 transition-colors"
              aria-label="TikTok"
            >
              <svg
                className="w-4 h-4"
                fill="currentColor"
                viewBox="0 0 24 24"
              >
                <path d="M12.525.02c1.31-.02 2.61-.01 3.91-.02.08 1.53.63 3.09 1.75 4.17 1.12 1.11 2.7 1.62 4.24 1.79v4.03c-1.44-.05-2.89-.35-4.2-.97-.57-.26-1.1-.59-1.62-.93-.01 2.92.01 5.84-.02 8.75-.08 1.4-.54 2.79-1.35 3.94-1.31 1.92-3.58 3.17-5.91 3.21-1.43.08-2.86-.31-4.08-1.03-2.02-1.19-3.44-3.37-3.65-5.71-.02-.5-.03-1-.01-1.49.18-1.9 1.12-3.72 2.58-4.96 1.66-1.44 3.98-2.13 6.15-1.72.02 1.48-.04 2.96-.04 4.44-.99-.32-2.15-.23-3.02.37-.63.41-1.11 1.04-1.36 1.75-.21.51-.15 1.07-.14 1.61.24 1.64 1.82 3.02 3.5 2.87 1.12-.01 2.19-.66 2.77-1.61.19-.33.4-.67.41-1.06.1-1.79.06-3.57.07-5.36.01-4.03-.01-8.05.02-12.07z" />
              </svg>
            </a>
          </div>
        </div>
      </section>

      {/* Airbnb Originals Section */}
      <section className="px-4 sm:px-6 lg:px-16 py-10">
        <div className="max-w-7xl mx-auto">
          <div className="mb-6">
            <h2
              className="text-2xl sm:text-3xl mb-3"
              style={{ fontWeight: 600 }}
            >
              The latest HOMIQIO Originals
            </h2>
            <p className="text-sm text-gray-600 max-w-3xl">
              Explore the latest extraordinary experiences
              hosted by the world's most interesting people,
              designed exclusively for HOMIQIO.
            </p>
          </div>

          {/* Carousel */}
          <div className="relative">
            {/* Navigation Buttons */}
            <div className="absolute right-0 -top-12 flex items-center gap-2 z-10">
              <button
                onClick={prevSlide}
                className="w-9 h-9 rounded-full border-2 border-gray-900 flex items-center justify-center hover:bg-gray-100 transition-colors"
                aria-label="Previous"
              >
                <ChevronLeft className="w-4 h-4" />
              </button>
              <button
                onClick={nextSlide}
                className="w-9 h-9 rounded-full border-2 border-gray-900 flex items-center justify-center hover:bg-gray-100 transition-colors"
                aria-label="Next"
              >
                <ChevronRight className="w-4 h-4" />
              </button>
            </div>

            {/* Slides */}
            <div className="overflow-hidden">
              <div
                className="flex transition-transform duration-500 ease-in-out"
                style={{
                  transform: `translateX(-${currentSlide * (100 / 3)}%)`,
                }}
              >
                {originals.map((item, index) => (
                  <div
                    key={index}
                    className="min-w-[33.333%] px-3"
                  >
                    <article className="group cursor-pointer relative">
                      <div className="mb-3 overflow-hidden rounded-xl relative">
                        <ImageWithFallback
                          src={item.image}
                          alt={item.title}
                          className="w-full h-64 object-cover group-hover:scale-105 transition-transform duration-300"
                        />
                        {/* Heart Icon */}
                        <button className="absolute top-3 right-3 w-9 h-9 bg-white rounded-full flex items-center justify-center hover:bg-gray-100 transition-colors">
                          <Heart className="w-4 h-4" />
                        </button>
                      </div>
                      <h3
                        className="text-sm mb-1.5 leading-snug"
                        style={{ fontWeight: 600 }}
                      >
                        {item.title}
                      </h3>
                      <p className="text-xs text-gray-600">
                        {item.date}
                      </p>
                    </article>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* News by Topic Section */}
      <section className="px-4 sm:px-6 lg:px-16 py-10 bg-white">
        <div className="max-w-7xl mx-auto">
          <h2
            className="text-2xl sm:text-3xl mb-6"
            style={{ fontWeight: 600 }}
          >
            News by topic
          </h2>

          {/* Topic Filters */}
          <div className="flex flex-wrap gap-2 mb-8">
            {topicFilters.map((filter) => (
              <button
                key={filter}
                onClick={() => setActiveFilter(filter)}
                className={`px-5 py-2 rounded-full border text-sm transition-colors ${
                  activeFilter === filter
                    ? "bg-gray-900 text-white border-gray-900"
                    : "bg-white text-gray-900 border-gray-300 hover:border-gray-900"
                }`}
              >
                {filter}
              </button>
            ))}
          </div>

          {/* News Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
            {filteredNews.map((news, index) => (
              <article
                key={index}
                className="group cursor-pointer"
              >
                <div className="mb-3 overflow-hidden rounded-xl">
                  {news.image === "placeholder" ? (
                    <div className="w-full h-40 bg-[#E91E63] flex items-center justify-center rounded-xl">
                      <svg
                        className="w-14 h-14"
                        viewBox="0 0 32 32"
                        fill="none"
                        xmlns="http://www.w3.org/2000/svg"
                      >
                        <path
                          d="M16 1.5C11.5 1.5 7.5 4 5.5 7.5C3.5 11 3 15 4.5 19C6 23 9.5 26.5 13 28.5C14 29 15 29.5 16 29.5C17 29.5 18 29 19 28.5C22.5 26.5 26 23 27.5 19C29 15 28.5 11 26.5 7.5C24.5 4 20.5 1.5 16 1.5ZM16 20C13.8 20 12 18.2 12 16C12 13.8 13.8 12 16 12C18.2 12 20 13.8 20 16C20 18.2 18.2 20 16 20Z"
                          fill="white"
                        />
                      </svg>
                    </div>
                  ) : (
                    <ImageWithFallback
                      src={news.image}
                      alt={news.title}
                      className="w-full h-40 object-cover group-hover:scale-105 transition-transform duration-300"
                    />
                  )}
                </div>
                <h3
                  className="text-sm mb-1.5 leading-snug"
                  style={{ fontWeight: 600 }}
                >
                  {news.title}
                </h3>
                <p className="text-xs text-gray-600">
                  {news.date}
                </p>
              </article>
            ))}
          </div>

          {/* View More Button */}
          <div className="mt-8 flex justify-start">
            <button className="px-5 py-2.5 border-2 border-gray-900 rounded-lg text-sm text-gray-900 font-semibold hover:bg-gray-100 transition-colors">
              View more
            </button>
          </div>
        </div>
      </section>

      {/* What makes Airbnb Section */}
      <section className="px-4 sm:px-6 lg:px-16 py-10 bg-gray-50">
        <div className="max-w-7xl mx-auto">
          <div className="grid grid-cols-1 lg:grid-cols-2 items-center">
            {/* Left Image */}
            <div className="w-full">
              <ImageWithFallback
                src="https://images.unsplash.com/photo-1702046988296-40db18f155ad?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxzdGFydHVwJTIwb2ZmaWNlJTIwd29ya3NwYWNlfGVufDF8fHx8MTc2ODk4NDI1Mnww&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral"
                alt="What makes HOMIQIO"
                className="w-full h-auto rounded-tl-2xl rounded-bl-2xl object-cover"
              />
            </div>

            {/* Right Content */}
            <div className="w-full h-full bg-white rounded-tr-2xl rounded-br-2xl p-8 lg:p-10">
              <h2
                className="text-2xl sm:text-3xl lg:text-4xl mb-4 leading-tight"
                style={{ fontWeight: 600 }}
              >
                What makes HOMIQIO, HOMIQIO
              </h2>
              <p className="text-gray-600 mb-6 text-base">
                A letter from our founders
              </p>
              <button className="bg-gray-900 hover:bg-gray-800 text-white px-5 py-2.5 rounded-lg text-sm font-semibold transition-colors">
                Read more
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <Footer onNavigate={onNavigate} />
    </div>
  );
}