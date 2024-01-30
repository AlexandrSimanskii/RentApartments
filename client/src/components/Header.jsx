import { FaSearch } from "react-icons/fa";
import { Link } from "react-router-dom";
import { useSelector } from "react-redux";

const Header = () => {
  const { currentUser } = useSelector((state) => {

    return state.user});
  // console.log(currentUser);
  return (
    <header className="header">
      <div className="header-inner container">
        <Link to={"/"}>
          <h1 className="header-title">
            <span className="header-title__first">Sahand</span>
            <span className="header-title__second">Estate</span>
          </h1>
        </Link>

        <form className="header-form">
          <input className="header-search" type="text" placeholder="Поиск..." />
          <FaSearch />
        </form>
        <ul className="header-list">
          <Link to={"/"}>
            <li className="header-list__item">Главная</li>
          </Link>
          <Link to={"/about"}>
            <li className="header-list__item">О нас</li>
          </Link>
          <Link to={"/signIn"}>
            <li className="header-list__item">Войти</li>
          </Link>
        </ul>
      </div>
    </header>
  );
};

export default Header;
