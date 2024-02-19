import { FaSearch } from "react-icons/fa";
import { Link, useNavigate } from "react-router-dom";
import { useSelector } from "react-redux";
import { useEffect, useState } from "react";

const Header = () => {
  const { currentUser } = useSelector((state) => state.user);

  const [searchTerm, setSearchTerm] = useState("");

  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    const urlParams = new URLSearchParams(window.location.search);

    urlParams.set("searchTerm", searchTerm);

    const searchQuery = urlParams.toString();
    // const paramsIterator = urlParams.entries();

    navigate(`/search?${searchQuery}`);
  };

  useEffect(() => {
    const urlParams = new URLSearchParams(location.search);
    const searchTermFromUrl = urlParams.get("searchTerm");
    if (searchTermFromUrl) {
      setSearchTerm(searchTermFromUrl);
    }
  }, [location.search]);



  return (
    <header className="header">
      <div className="container">
        <div className="header-inner">
          <Link to={"/"}>
            <h1 className="header-title">
              <span className="header-title__first">Sahand</span>
              <span className="header-title__second">Estate</span>
            </h1>
          </Link>

          <form className="header-form" onSubmit={handleSubmit}>
            <input
              className="header-search"
              type="text"
              placeholder="Поиск..."
              value={searchTerm}
              onChange={(e) => {
                setSearchTerm(e.target.value);
              }}
            />
            <button className="header-form__button">
              <FaSearch />
            </button>
          </form>
          <ul className="header-list">
            <Link to={"/"}>
              <li className="header-list__item">Главная</li>
            </Link>
            <Link to={"/about"}>
              <li className="header-list__item">О нас</li>
            </Link>

            {currentUser ? (
              <Link to={"/profile"}>
                <li className="header-list__item">
                  <img
                    className="header-img"
                    src={currentUser.avatar}
                    alt="profile"
                  />
                </li>
              </Link>
            ) : (
              <Link to={"/sign-in"}>
                <li className="header-list__item">Войти</li>
              </Link>
            )}
          </ul>
        </div>
      </div>
    </header>
  );
};

export default Header;
