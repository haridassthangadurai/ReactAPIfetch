import React, { useEffect, useState } from "react";
import axios from "axios";
import "./NewsApi.css";
import newsCategories from "./News.json";
import Loding from "./Loding";
import ReactPaginate from "react-paginate";

const NewsApi = () => {
  const [newsData, setNewsData] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState("");
  const [searchQuery, setSearchQuery] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [requestCount, setRequestCount] = useState(0);
  const [rateLimitReached, setRateLimitReached] = useState(false);
  const [currentPage, setCurrentPage] = useState(0);
  const newsPerPage = 10;

  const handlePageChange = (selectedPage) => {
    setCurrentPage(selectedPage.selected);
  };

  const filteredNewsData = () => {
    const startIndex = currentPage * newsPerPage;
    const endIndex = startIndex + newsPerPage;
    return newsData.slice(startIndex, endIndex);
  };

  const newsApiHeaders = {
    "X-BingApis-SDK": "true",
    "X-RapidAPI-Key": "39bd24a422msh9a7be672d18066fp149958jsna6b9c1bad97c",
    "X-RapidAPI-Host": "bing-news-search1.p.rapidapi.com",
  };

  const baseUrl = "https://bing-news-search1.p.rapidapi.com/news/search";

  const fetchNews = async () => {
    try {
      if (requestCount >= 2) {
        setRateLimitReached(true);
        return;
      }
      setIsLoading(true);
      const params = {
        safeSearch: "Off",
        textFormat: "Raw",
        freshness: "Day",
        count: 100,
      };
      if (searchQuery) {
        params.q = searchQuery;
      } else {
        params.q = selectedCategory;
      }
      const response = await axios.get(baseUrl, {
        headers: newsApiHeaders,
        params: params,
      });
      setNewsData(response.data?.value);
    } catch (error) {
      console.log(error);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    const rateLimitResetInterval = setInterval(() => {
      setRequestCount(0);
      setRateLimitReached(false);
    }, 1000);

    return () => {
      clearInterval(rateLimitResetInterval);
    };
  }, []);

  useEffect(() => {
    if (searchQuery || selectedCategory) {
      setRequestCount((prevCount) => prevCount + 1);
    }
    if (!rateLimitReached) {
      fetchNews();
    }
  }, [searchQuery, selectedCategory, rateLimitReached]);

  const handleCategoryChange = (category) => {
    setSelectedCategory(category);
  };

  const getHoursBefore = (datePublished) => {
    const now = new Date();
    const published = new Date(datePublished);
    const diffInMs = now - published;
    const diffInHours = Math.floor(diffInMs / (1000 * 60 * 60));
    return diffInHours;
  };

  return (
    <div className="backGround">
      <div className="news-container">
        <div className="search-container">
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search news..."
            className="search-input"
          />
          <button onClick={fetchNews} className="search-button">
            Search
          </button>
          <button onClick={() => setSearchQuery("")} className="clear-button">
            Clear
          </button>
        </div>

        <div className="categories-container">
          {newsCategories.map((category) => (
            <button
              key={category}
              className={`category-button ${
                selectedCategory === category ? "active" : ""
              }`}
              onClick={() => handleCategoryChange(category)}
            >
              {category}
            </button>
          ))}
        </div>

        <div className="cards-container">
          {isLoading ? (
            <Loding />
          ) : (
            filteredNewsData().map((news, i) => (
              <a
                key={i}
                href={news.url}
                target="_blank"
                rel="noopener noreferrer"
                className="news-link"
              >
                <div className="news-card">
                  <h2>{news.name}</h2>
                  <img
                    src={news.image?.thumbnail?.contentUrl}
                    alt={news.name}
                  />
                  <p>
                    {news.description
                      ? news.description.length > 75
                        ? `${news.description.substring(0, 75)}...`
                        : news.description
                      : "No description available"}
                  </p>
                  <p className="date-time">
                    {getHoursBefore(news.datePublished)} hours ago
                  </p>
                </div>
              </a>
            ))
          )}
        </div>

        <ReactPaginate
          previousLabel={"Previous"}
          nextLabel={"Next"}
          pageCount={Math.ceil(newsData.length / newsPerPage)}
          onPageChange={handlePageChange}
          containerClassName={"pagination"}
          previousLinkClassName={"pagination__link"}
          nextLinkClassName={"pagination__link"}
          disabledClassName={"pagination__link--disabled"}
          activeClassName={"pagination__link--active"}
        />
      </div>
    </div>
  );
};
export default NewsApi;
