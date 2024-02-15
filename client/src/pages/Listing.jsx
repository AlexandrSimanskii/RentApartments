import { useParams } from "react-router-dom";
import { useEffect, useState } from "react";

import { register } from "swiper/element/bundle";
import {
  FaMapMarkerAlt,
  FaShare,
  FaChair,
  FaBed,
  FaBath,
  FaParking,
} from "react-icons/fa";

register();

const Listing = () => {
  const [listing, setListing] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(false);
  const params = useParams();

  useEffect(() => {
    const fetchListing = async () => {
      try {
        setLoading(true);

        const res = await fetch(`/api/listing/get/${params.listingID}`);
        const data = await res.json();

        if (data.success === false) {
          setError(true);
          setLoading(false);
          console.log(data.message);
          return;
        }

        setError(false);
        setLoading(false);
        setListing(data);
      } catch (error) {
        setError(true);
        setLoading(false);
        console.log(error);
      }
    };
    fetchListing();
  }, [params.listingID]);

  const getRoomLabel = (number) => {
    if (number === 1 || number === 21 || number === 31) {
      return "комната";
    } else if (
      (number >= 2 && number <= 4) ||
      (number >= 22 && number <= 24) ||
      (number >= 32 && number <= 34)
    ) {
      return "комнаты";
    } else {
      return "комнат";
    }
  };

  function getBathroomLabel(number) {
    if (number === 1) {
      return "ванная комната";
    } else if (number >= 2 && number <= 4) {
      return "ванные комнаты";
    } else if (number >= 5 && number <= 10) {
      return "ванных комнат";
    } else {
      return "ванных комнат"; // Для остальных случаев можно использовать тот же вариант
    }
  }

  return (
    <main className="listing ">
      {loading && <p>Загрузка</p>}
      {error && <p>Что-то пошло не так</p>}

      {listing && !loading && !error && (
        <>
          <div className="listing-swiper">
            <swiper-container navigation="true" loop="true">
              {listing.imageUrls.map((url) => (
                <swiper-slide key={url}>
                  <div
                    className="swiper-images"
                    style={{ backgroundImage: `url(${url})` }}
                  ></div>
                </swiper-slide>
              ))}
            </swiper-container>
          </div>
          <div className="container">
            <div className="listing-inner">
              <div className="listing-share">
                <FaShare />
              </div>

              <p className="listing-price">
                {listing.name}-
                <span>
                  {listing.type === "Аренда"
                    ? `${listing.regularPrice} руб/месяц`
                    : `${listing.regularPrice} руб.`}
                </span>
              </p>
              <div className="listing-address">
                <FaMapMarkerAlt className="listing-address__marker" />{" "}
                <address>{listing.address}</address>
              </div>
              <div className="listing-group-buttons">
                <button className="listing-group-buttons__rent">
                  {listing.type}
                </button>
                {listing.offer && (
                  <button className="listing-group-buttons__sale">
                    Получить скидку
                  </button>
                )}
              </div>
              <p className="listing__descriptions">{listing.description}</p>

              <ul className="listing-options">
                <li className="listing-options__li">
                  <FaBed />
                  <span>{`${listing.bedrooms} ${getRoomLabel(
                    listing.bedrooms
                  )}`}</span>
                </li>
                <li className="listing-options__li">
                  <FaBath />
                  <span>{`${listing.bathrooms} ${getBathroomLabel(
                    listing.bathrooms
                  )}`}</span>
                </li>
                <li className="listing-options__li">
                  <FaParking />
                  <span>{listing.parking ? "Парковка" : "Нет парковки"}</span>
                </li>
                <li className="listing-options__li">
                  <FaChair />
                  <span>{listing.furnished ? "Мебель" : "Без мебели"}</span>
                </li>
              </ul>
              <button className="listing__contact-btn">
                Контакты владельца
              </button>
            </div>
          </div>
        </>
      )}
    </main>
  );
};

export default Listing;
