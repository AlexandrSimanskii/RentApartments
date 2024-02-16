const Search = () => {
  return (
    <section className="search">
      <div className="container">
        <div className="search-inner">
          <form className="search-form">
            <div className="search-form-group">
              <span className="form-group-name"> Поиск по названию:</span>
              <input type="search" />
            </div>
            <div className="search-form-group">
              <span className="form-group-name"> Тип:</span>
              <label className="search-form__label">
                <input type="checkbox" /> Аренда и Продажа
              </label>
              <label className="search-form__label">
                <input type="checkbox" /> Аренда
              </label>
              <label className="search-form__label">
                <input type="checkbox" /> Продажа
              </label>
            </div>
            <div className="search-form-group">
              <span className="form-group-name"> Удобства:</span>
              <label className="search-form__label">
                <input type="checkbox" /> Парковка
              </label>
              <label className="search-form__label">
                <input type="checkbox" /> Мебель
              </label>
            </div>
            <div className="search-form-group">
              <span className="form-group-name">Сортировать по:</span>
              <select>
                <option value="По возрастанию цены">По возрастанию цены</option>
                <option value="По убыванию цены">По убыванию цены</option>
                <option value="Сначала свежие">Сначала свежие</option>
                <option value="По умолчанию">По умолчанию</option>
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
