"use client";
export const dynamic = "force-dynamic";

import { useEffect, useState } from "react";
import Image from "next/image";
import { useRouter, useSearchParams } from "next/navigation"; // ← 追加
import styles from "./page.module.css"; 
type Media = {
  id: number;
  title?: string;
  name?: string;
  poster_path: string | null;
  release_date?: string;
  first_air_date?: string;
  overview?: string;
  vote_average?: number;
};

export default function Home() {

  // const initialCategory =
  //   (searchParams.get("category") as "movies" | "tv" | "animation") || "movies";

  // const [category, setCategory] = useState<"movies" | "tv" | "animation">(initialCategory);
  const [category, setCategory] = useState<"movies" | "tv" | "animation">("movies");
  const [mediaList, setMediaList] = useState<Media[]>([]);
  const [trendingMovies, setTrendingMovies] = useState<Media[]>([]);
  const [searchQuery, setSearchQuery] = useState("");
  const router = useRouter();
  
 const API_KEY = process.env.NEXT_PUBLIC_TMDB_API_KEY;
  const LANGUAGE_PAGE = "&language=ja&page=1";
  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const param = params.get("category") as "movies" | "tv" | "animation" | null;
    if (param) {
      setCategory(param);
    }
  }, []);

  useEffect(() => {
    const fetchMedia = async () => {
      let url = "";

      if (searchQuery) {
        url = `https://api.themoviedb.org/3/search/${
          category === "tv" ? "tv" : "movie"
        }?api_key=${API_KEY}${LANGUAGE_PAGE}&query=${encodeURIComponent(searchQuery)}`;
      } else {
        if (category === "movies") {
          url = `https://api.themoviedb.org/3/movie/popular?api_key=${API_KEY}${LANGUAGE_PAGE}`;
        } else if (category === "tv") {
          url = `https://api.themoviedb.org/3/tv/popular?api_key=${API_KEY}${LANGUAGE_PAGE}`;
        } else if (category === "animation") {
          url = `https://api.themoviedb.org/3/discover/movie?api_key=${API_KEY}${LANGUAGE_PAGE}&with_genres=16`;
        }
      }

      const res = await fetch(url);
      const data = await res.json();
      setMediaList(data.results || []);
    };

    const fetchTrendingMovies = async () => {
      const url = `https://api.themoviedb.org/3/trending/movie/day?api_key=${API_KEY}${LANGUAGE_PAGE}`;
      const res = await fetch(url);
      const data = await res.json();
      setTrendingMovies(data.results || []);
    };

    fetchMedia();
    fetchTrendingMovies();
  }, [category, searchQuery]);

  // 映画カードがクリックされたときの処理
 const handleCardClick = (id: number) => {
  if (category === "tv") {
    router.push(`/tv/${id}?from=${category}`);
  } else {
    // movies と animation は映画APIを使っているので /movie
    router.push(`/movie/${id}?from=${category}`);
  }
};

  return (
    <div className={styles.container}>
      {/* ナビゲーションバー */}
      <div className={styles.navbar}>
        <div className={styles.logoContainer}>
          <div className={styles.logoImage}>
            <Image src="/channel9.png" alt="Movie App Logo" width={100} height={50} priority />
          </div>
        </div>

        <div className={styles.menu}>
          <button
            className={category === "movies" ? styles.active : styles.inactive}
            onClick={() => setCategory("movies")}
          >
            Movie
          </button>
          <button
            className={category === "tv" ? styles.active : styles.inactive}
            onClick={() => setCategory("tv")}
          >
            TV
          </button>
          <button
            className={category === "animation" ? styles.active : styles.inactive}
            onClick={() => setCategory("animation")}
          >
            Animation
          </button>
        </div>
      </div>

      {/* トレンド映画 */}
      <div className={styles.section}>
        <h2 className={styles.sectionTitle}>人気の動画🌟️</h2>
      </div>

      {/* 検索バー */}
      <div className={styles.searchBar}>
        <input
          type="text"
          placeholder="Search..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
        />
      </div>

      {/* メディアリスト */}
      <div className={styles.mediaList}>
        {mediaList.map((item) => (
          <div
            className={styles.mediaCard}
            key={item.id}
            onClick={() => handleCardClick(item.id)}
          >
            {item.poster_path && (
              <Image
                src={`https://image.tmdb.org/t/p/w500${item.poster_path}`}
                alt={item.title || item.name || "No title"}
                width={150}
                height={225}
              />
            )}
            <h3>{item.title || item.name}</h3>
            <p className={styles.rating}>{item.vote_average?.toFixed(3) || "N/A"}</p>
          </div>
        ))}
      </div>
    </div>
  );
}