import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import Listingitem from "../components/Listingitem";
import { register } from "swiper/element";
register();

const Home = () => {
  const [offerListing, setOfferListing] = useState([]);
  const [rentListing, setRentListing] = useState([]);
  const [saleListing, setSaleListing] = useState([]);

  useEffect(() => {
    const fetchGetOfferListing = async () => {
      try {
        const res = await fetch("/api/listing/get?offer=true&limit=4");
        const data = await res.json();
        setOfferListing([...data]);
        fetchGetRentListing();
        fetchGetSaleListing();
      } catch (error) {
        console.log(error);
      }
    };

    const fetchGetRentListing = async () => {
      try {
        const res = await fetch("api/listing/get?type=Аренда&limit=4");
        const data = await res.json();
        setRentListing([...data]);
      } catch (error) {
        console.log(error);
      }
    };

    const fetchGetSaleListing = async () => {
      try {
        const res = await fetch(`api/listing/get?type=Продажа&limit=4`);
        const data = await res.json();
        setSaleListing([...data]);
      } catch (error) {
        console.log(error);
      }
    };

    fetchGetOfferListing();
  }, []);

  return (
    <section className="home">
      <div className="home-inner">
        <div className="container">
          <div className="home-top">
            <h1 className="home-top__title">Найти дом вашей мечты легко...</h1>
            <p className="home-top__text">
              <span className="home-top__text-estate">Estate</span> - лучшая
              платформа чтоб найти идеальное место для вашей жизни.
              <br />У нас огромный выбор недвижемости, на любой вкус.
            </p>
            <Link to={"/search"}>
              <button className="home-top__link"> Начать поиск...</button>
            </Link>
          </div>
        </div>

        <div className="home-swiper">
          {offerListing && offerListing.length > 0 && (
            <swiper-container navigation="true" loop="true">
              {offerListing.map((listing) => (
                <swiper-slide key={listing._id}>
                  <div
                    className="home-swiper__img"
                    style={{ backgroundImage: `url(${listing.imageUrls})` }}
                  ></div>
                </swiper-slide>
              ))}
            </swiper-container>
          )}
        </div>

        <div className="container">
          <div className="home-groups">
            <div className="home-group">
              <h2 className="home-group__title">С договором</h2>

              <div className="home-group__cards">
                {offerListing &&
                  offerListing.length > 0 &&
                  offerListing.map((listing) => (
                    <Listingitem key={listing._id} listing={listing} />
                  ))}
              </div>
              <Link to={"/search?offer=true"}>
                <button className="home-group__link">Найти больше...</button>
              </Link>
            </div>
            <div className="home-group">
              <h2 className="home-group__title">Аренда</h2>

              <div className="home-group__cards">
                {rentListing &&
                  rentListing.length > 0 &&
                  rentListing.map((listing) => (
                    <Listingitem key={listing._id} listing={listing} />
                  ))}
              </div>
              <Link to={"/search?offer=true"}>
                <button className="home-group__link">Найти больше...</button>
              </Link>
            </div>
            <div className="home-group">
              <h2 className="home-group__title">Продажа</h2>

              <div className="home-group__cards">
                {saleListing &&
                  saleListing.length > 0 &&
                  saleListing.map((listing) => (
                    <Listingitem key={listing._id} listing={listing} />
                  ))}
              </div>
              <Link to={"/search?offer=true"}>
                <button className="home-group__link">Найти больше...</button>
              </Link>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Home;
