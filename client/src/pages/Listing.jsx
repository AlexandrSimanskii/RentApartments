import {
  getDownloadURL,
  getStorage,
  ref,
  uploadBytesResumable,
} from "firebase/storage";
import { useState } from "react";
import { app } from "../firebase";

const Listing = () => {
  const [files, setFiles] = useState([]);
  const [imageUploadError, setImageUploadError] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [formData, setFormData] = useState({
    imageUrls: [],
  });

  console.log(uploading);

  const handleFileSubmit = () => {
    if (files.length > 0 && files.length + formData.imageUrls.length < 7) {
      setUploading(true);
      setImageUploadError(false);
      const promises = [];
      for (let i = 0; i < files.length; i++) {
        promises.push(storeImage(files[i]));

        Promise.all(promises)
          .then((urls) => {
            setFormData({
              ...formData,
              imageUrls: formData.imageUrls.concat(urls),
            });
            setImageUploadError(false);
            setUploading(false);
          })
          .catch((err) => {
            setImageUploadError(
              "Загрузка не завершена!(максимальный размер картинки 2MB)"
            );
            setUploading(false);
          });
      }
    } else {
      setImageUploadError(`Вы можете загрузить от одной до шести фотографий!`);
      setUploading(false);
    }
  };

  const storeImage = async (file) => {
    return new Promise((resolve, reject) => {
      const storage = getStorage(app);
      const fileName = new Date().getTime() + file.name;
      const storageRef = ref(storage, fileName);
      const uploadTask = uploadBytesResumable(storageRef, file);

      uploadTask.on(
        "state_changed",
        (snapshot) => {
          const progress =
            (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
          console.log(`загруженно ${progress}%`);
        },
        (error) => {
          reject(error);
        },

        () => {
          getDownloadURL(uploadTask.snapshot.ref).then((downloadURL) => {
            resolve(downloadURL);
          });
        }
      );
    });
  };

  const handleRemoveImage = (index) => {
    setFormData((prev) => ({
      ...prev,
      imageUrls: prev.imageUrls.filter((_, i) => i !== index),
    }));
  };

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
            <p className="add-pictures__title">
              Фотографии:
              <span className="add-pictures__title-inner">
                Первая фотография будет главной!(Не более 6 шт.)
              </span>
            </p>
            <div className="add-pictures-group">
              <input
                onChange={(e) => {
                  setFiles(e.target.files);
                }}
                type="file"
                id="images"
                accept="image/*"
                multiple
              />
              <button
                onClick={handleFileSubmit}
                className="upload-picture"
                type="button"
                disabled={uploading}
              >
                {uploading ? "Загрузка..." : "Загрузить"}
              </button>
            </div>

            {formData.imageUrls.map((url, index) => (
              <div className="create-listing-card" key={url}>
                <img
                  className="create-listing-card__img"
                  src={url}
                  alt="listing image"
                />
                <button
                  className="create-listing-card__btn"
                  onClick={() => handleRemoveImage(index)}
                  type="button"
                >
                  Удалить
                </button>
              </div>
            ))}

            <p className="error">{imageUploadError && imageUploadError}</p>
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
