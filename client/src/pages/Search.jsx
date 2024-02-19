import { json } from "body-parser";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

const Search = () => {
  const [loading, setLoading] = useState(false);
  const [listings, setListings] = useState({});
  const [sidebardata, setSidebardata] = useState({
    searchTerm: "",
    type: "Все",
    parking: false,
    furnished: false,
    offer: false,
    sort: "createdAt",
    order: "desc",
  });

  const navigate = useNavigate();

  useEffect(() => {
    const urlParams = new URLSearchParams(location.search);
    const paramsSearchTerm = urlParams.get("searchTerm");
    const paramsType = urlParams.get("type");
    const paramsParking = urlParams.get("parking");
    const paramsFurnished = urlParams.get("furnished");
    const paramsOffer = urlParams.get("offer");
    const paramsSort = urlParams.get("sort");
    const paramsOrder = urlParams.get("order");

    if (
      paramsSearchTerm ||
      paramsType ||
      paramsParking ||
      paramsFurnished ||
      paramsOffer ||
      paramsSort ||
      paramsOrder
    ) {
      setSidebardata({
        searchTerm: paramsSearchTerm || "",
        type: paramsType || "Все",
        parking: paramsParking === "true" ? true : false,
        furnished: paramsFurnished === "true" ? true : false,
        offer: paramsOffer === "true" ? true : false,
        sort: paramsSort || "createdAt",
        order: paramsOrder || "desc",
      });
    }

    const fetchGetListings = async () => {
      setLoading(true);

      const res = await fetch.get(`/api/listings/get?${sidebardata}`);
      const data = await json(res);

      setListings(data);
    };
    fetchGetListings();
  }, [location.search]);

  console.log(listings);

  const handleChange = (e) => {
    if (
      e.target.id === "Все" ||
      e.target.id === "Продажа" ||
      e.target.id === "Аренда"
    ) {
      setSidebardata((prev) => ({ ...prev, type: e.target.id }));
    }

    if (
      e.target.id === "parking" ||
      e.target.id === "furnished" ||
      e.target.id === "offer"
    ) {
      setSidebardata((prev) => ({
        ...prev,
        [e.target.id]: e.target.checked || e.target.checked,
      }));
    }

    if (e.target.id === "searchTerm") {
      setSidebardata({ ...sidebardata, searchTerm: e.target.value });
    }

    if (e.target.id === "sort__order") {
      const sort = e.target.value.split("_")[0];
      const order = e.target.value.split("_")[1];
      setSidebardata({ ...sidebardata, sort, order });
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const urlSearchParams = new URLSearchParams();
    urlSearchParams.set("searchTerm", sidebardata.searchTerm);
    urlSearchParams.set("type", sidebardata.type);
    urlSearchParams.set("parking", sidebardata.parking);
    urlSearchParams.set("furnished", sidebardata.furnished);
    urlSearchParams.set("offer", sidebardata.offer);
    urlSearchParams.set("sort", sidebardata.sort);
    urlSearchParams.set("order", sidebardata.order);

    const searchQuery = urlSearchParams.toString();

    navigate(`?${searchQuery}`);
  };
  console.log(location);
  return (
    <section className="search">
      <div className="container">
        <div className="search-inner">
          <form className="search-form" onSubmit={handleSubmit}>
            <div className="search-form-group">
              <span className="form-group-name"> Поиск по названию:</span>
              <input
                type="search"
                id="searchTerm"
                placeholder="Поиск..."
                value={setSidebardata.searchTerm}
                onChange={handleChange}
              />
            </div>
            <div className="search-form-group">
              <span className="form-group-name"> Тип:</span>
              <label className="search-form__label">
                <input
                  type="checkbox"
                  id="Все"
                  onChange={handleChange}
                  checked={sidebardata.type === "Все"}
                />
                Аренда и Продажа
              </label>
              <label className="search-form__label">
                <input
                  type="checkbox"
                  id="Аренда"
                  onChange={handleChange}
                  checked={sidebardata.type === "Аренда"}
                />
                Аренда
              </label>
              <label className="search-form__label">
                <input
                  type="checkbox"
                  id="Продажа"
                  checked={sidebardata.type === "Продажа"}
                  onChange={handleChange}
                />
                Продажа
              </label>
            </div>
            <div className="search-form-group">
              <span className="form-group-name"> Удобства:</span>
              <label className="search-form__label">
                <input
                  type="checkbox"
                  id="parking"
                  onChange={handleChange}
                  checked={sidebardata.parking}
                />
                Парковка
              </label>
              <label className="search-form__label">
                <input
                  type="checkbox"
                  id="furnished"
                  onChange={handleChange}
                  checked={sidebardata.furnished}
                />
                Мебель
              </label>
              <label className="search-form__label">
                <input
                  type="checkbox"
                  id="offer"
                  onChange={handleChange}
                  checked={sidebardata.offer}
                />
                Договор
              </label>
            </div>
            <div className="search-form-group">
              <span className="form-group-name">Сортировать по:</span>
              <select
                onSelect={handleChange}
                onChange={handleChange}
                defaultValue={"created__at__desc"}
                id="sort__order"
              >
                <option value="regularPrice_desc">По возрастанию цены</option>
                <option value="regularPrice_asc">По убыванию цены</option>
                <option value="createdAt_desc">Сначала свежие</option>
                <option value="createdAt_asc">По умолчанию</option>
              </select>
            </div>
            <button>Показать</button>
          </form>
          <div className="search-result">
            <h2>Результаты поиска:</h2>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Search;
