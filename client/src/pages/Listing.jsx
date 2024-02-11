import { useParams } from "react-router-dom";
import { useEffect, useState } from "react";
// import { Swiper, SwiperSlide } from "swiper/react";
// import SwiperCore from "swiper";
// import { Navigation } from "swiper/modules";
// import "swiper/css/boundle";
import { register } from "swiper/element/bundle";
register();

const Listing = () => {
  const [listing, setListing] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(false);
  const params = useParams();

  console.log(params.listingID);

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
  console.log(listing?.imageUrls);
  return (
    <main>
      {loading && <p>Загрузка</p>}
      {error && <p>Что-то пошло не так</p>}

      {listing && !loading && !error && (
        <>
          <h1>{listing.name}</h1>
          <div>
            <swiper-container navigation="true" loop="true">
              {listing.imageUrls.map((url) => (
                <swiper-slide key={url}>
                  <div
                    className="swiper-images"
                    style={{ backgroundImage: `url(${url})` }}
                  >
                    
                  </div>
                </swiper-slide>
              ))}
            </swiper-container>
          </div>
        </>
      )}
    </main>
  );
};

export default Listing;
