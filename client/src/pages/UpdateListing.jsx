import {
  getDownloadURL,
  getStorage,
  ref,
  uploadBytesResumable,
} from "firebase/storage";
import { useEffect, useState } from "react";
import { app } from "../firebase";
import { useSelector } from "react-redux";
import { useNavigate, useParams } from "react-router-dom";

const UpdateListing = () => {
  const [files, setFiles] = useState([]);
  const [error, setError] = useState(false);
  const [loading, setLoading] = useState(false);
  const [imageUploadError, setImageUploadError] = useState(false);
  const [uploading, setUploading] = useState(false);
  const params = useParams();
  const [formData, setFormData] = useState({
    imageUrls: [],
    name: "",
    description: "",
    address: "",
    type: "Аренда",
    bedrooms: 1,
    bathrooms: 1,
    regularPrice: 500,
    discountPrice: 0,
    offer: false,
    parking: false,
    furnished: false,
  });
  const { currentUser } = useSelector((state) => state.user);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchListing = async () => {
      const listingID = params.listingID;
      const res = await fetch(`/api/listing/get/${listingID}`);
      const data = await res.json();
      if (data.success === false) {
        console.log(data.message);
        return;
      }

      setFormData(data);
    };
    fetchListing();
  }, []);

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

  const handleChange = (e) => {
    if (e.target.id === "Продажа" || e.target.id === "Аренда") {
      setFormData((prev) => ({
        ...prev,
        type: e.target.id,
      }));
    }

    if (
      e.target.id === "parking" ||
      e.target.id === "furnished" ||
      e.target.id === "offer"
    ) {
      setFormData((prev) => ({ ...prev, [e.target.id]: e.target.checked }));
    }

    if (
      e.target.type === "number" ||
      e.target.type === "text" ||
      e.target.type === "textarea"
    ) {
      setFormData((prev) => ({ ...prev, [e.target.id]: e.target.value }));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      setLoading(true);
      setError(false);
      if (formData.imageUrls.length < 1) {
        setLoading(false);
        return setError("Вы должны загрузить фотографию!");
      }
      if (formData.regularPrice < formData.discountPrice) {
        return setError("Цена со скидкой не может быть больше цены!");
      }

      const res = await fetch(`/api/listing/update/${formData._id}`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ ...formData, userRef: currentUser._id }),
      });
      const data = await res.json();

      setLoading(false);
      if (data.success === false) {
        setError(data.message);
      }

      navigate(`/listing/${formData._id}`);
    } catch (error) {
      setError(error.message);
      setLoading(false);
    }
  };
  console.log(formData);
  return (
    <section className="create-listing ">
      <div className="container">
        <div className="create-listing__inner">
          <h1 className="create-listing-title">Изменить объявление</h1>
          <form
            onSubmit={handleSubmit}
            className="create-listing-form"
            action="submit"
          >
            <div className="create-listing-form__inner">
              <div className="add-data">
                <fieldset className="group-text">
                  <input
                    type="text"
                    id="name"
                    required
                    placeholder="Вид недвижемости"
                    onChange={handleChange}
                    value={formData.name}
                  />
                  <textarea
                    id="description"
                    required
                    placeholder="Описание"
                    onChange={handleChange}
                    value={formData.description}
                  ></textarea>
                  <input
                    type="text"
                    id="address"
                    required
                    placeholder="Адресс"
                    onChange={handleChange}
                    value={formData.address}
                  />
                </fieldset>
                <fieldset className="group-checkbox">
                  <label className="create-listing-label">
                    <input
                      type="checkbox"
                      id="Продажа"
                      onChange={handleChange}
                      checked={formData.type === "Продажа"}
                    />
                    Продажа
                  </label>

                  <label className="create-listing-label">
                    <input
                      type="checkbox"
                      id="Аренда"
                      onChange={handleChange}
                      checked={formData.type === "Аренда"}
                    />
                    Аренда
                  </label>
                  <label className="create-listing-label">
                    <input
                      type="checkbox"
                      id="parking"
                      onChange={handleChange}
                      checked={formData.parking}
                    />
                    Парковка
                  </label>
                  <label className="create-listing-label">
                    <input
                      type="checkbox"
                      id="furnished"
                      onChange={handleChange}
                      checked={formData.furnished}
                    />
                    Мебель
                  </label>
                  <label className="create-listing-label">
                    <input
                      type="checkbox"
                      id="offer"
                      onChange={handleChange}
                      checked={formData.offer}
                    />
                    Заключение договора
                  </label>
                </fieldset>
                <fieldset className="group-number">
                  <label className="create-listing-label">
                    <input
                      className="group-number__item"
                      id="bedrooms"
                      type="number"
                      required
                      min="1"
                      max="10"
                      onChange={handleChange}
                      value={formData.bedrooms}
                    />
                    Комнаты
                  </label>
                  <label className="create-listing-label">
                    <input
                      className="group-number__item"
                      id="bathrooms"
                      type="number"
                      required
                      min="1"
                      max="10"
                      onChange={handleChange}
                      value={formData.bathrooms}
                    />
                    Ванные
                  </label>
                  <label className="create-listing-label">
                    <input
                      className="group-number__item"
                      id="regularPrice"
                      type="number"
                      required
                      min="500"
                      max="100000000"
                      onChange={handleChange}
                      value={formData.regularPrice}
                    />
                    <p className="group-number__item-text">
                      Цена <span>(Руб/месяц)</span>
                    </p>
                  </label>
                  {formData.offer && (
                    <label className="create-listing-label">
                      <input
                        className="group-number__item"
                        id="discountPrice"
                        type="number"
                        required
                        min="0"
                        max="100000000"
                        onChange={handleChange}
                        value={formData.discountPrice}
                      />
                      <p className="group-number__item-text">
                        Цена со скидкой <span>(Руб/месяц)</span>
                      </p>
                    </label>
                  )}
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
                <button
                  className="crete-listing-form__button"
                  disabled={loading || uploading}
                >
                  {loading ? "Загрузка..." : "Изменить обьявление"}
                </button>


                
                {error && <p className="error">{error}</p>}
              </div>
            </div>
          </form>
        </div>
      </div>
    </section>
  );
};
export default UpdateListing;
