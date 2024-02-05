const Listing = () => {
  return (
    <section className="listing container">
      <h1 className="listing-title">Создать обьявление</h1>
      <form className="listing-form" action="submit">
        <div className="listing-form__inner">
          <div className="add-data">
            <fieldset className="group-text">
              <input
                type="text"
                id="name"
                required
                placeholder="Вид недвижемости"
              />
              <textarea
                id="description"
                required
                placeholder="Описание"
              ></textarea>
              <input type="text" id="address" required placeholder="Адресс" />
            </fieldset>
            <fieldset className="group-checkbox">
              <label className="listing-label">
                <input type="checkbox" id="sale" />
                Продажа
              </label>

              <label className="listing-label">
                <input type="checkbox" id="rent" />
                Аренда
              </label>
              <label className="listing-label">
                <input type="checkbox" id="parking" />
                Парковка
              </label>
              <label className="listing-label">
                <input type="checkbox" id="furnished" />
                Мебель
              </label>
              <label className="listing-label">
                <input type="checkbox" id="offer" />
                Готовность
              </label>
            </fieldset>
            <fieldset className="group-number">
              <label className="listing-label">
                <input
                  className="group-number__item"
                  id="bedrooms"
                  type="number"
                  required
                  min="1"
                  max="10"
                />
                Кровати
              </label>
              <label className="listing-label">
                <input
                  className="group-number__item"
                  id="baths"
                  type="number"
                  required
                  min="1"
                  max="10"
                />
                Ванные
              </label>
              <label className="listing-label">
                <input
                  className="group-number__item"
                  id="regularPrice"
                  type="number"
                  required
                  min="1"
                  max="10"
                />
                <p className="group-number__item-text">
                  Цена <span>(Руб/месяц)</span>
                </p>
              </label>
              <label className="listing-label">
                <input
                  className="group-number__item"
                  id="discountPrice"
                  type="number"
                  required
                  min="1"
                  max="10"
                />
                Цена со скидкой
              </label>
            </fieldset>
          </div>
          <div className="add-pictures">
            <p>
              Фотографии:
              <span>Первая фотография будет главной(Не более 6)</span>
            </p>
            <div className="add-pictures-group">
              <input type="file" id="images" accept="image/*" multiple />
              <button>Загрузить</button>
            </div>{" "}
            <button className="listing-form__button">
              Добавить обьявление
            </button>
          </div>
        </div>
      </form>
    </section>
  );
};

export default Listing;
