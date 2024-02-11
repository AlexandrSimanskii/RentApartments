import { useEffect, useRef, useState } from "react";
import { Link } from "react-router-dom";
import { useSelector } from "react-redux";
import {
  getStorage,
  uploadBytesResumable,
  ref,
  getDownloadURL,
} from "firebase/storage";
import { app } from "../firebase";
import { useDispatch } from "react-redux";
import {
  updateUserSuccess,
  updateUserFailure,
  updateUserStart,
  deleteUserStart,
  deleteUserSuccess,
  deleteUserFailure,
  logOutUserFailure,
  logOutUserSuccess,
  logOutUserStart,
} from "../redux/users/userSlise.js";

const Profile = () => {
  const [file, setFile] = useState(null);
  const [fileProc, setFileProc] = useState(0);
  const [errorFileApload, setErrorFileUpload] = useState(false);
  const [formData, setFormData] = useState({});
  const [updateSuccess, setUpdateSuccess] = useState(false);
  const [errorShowListings, setErrorShowListings] = useState(false);
  const [listings, setListings] = useState([]);
  const { currentUser, loading, error } = useSelector((state) => state.user);

  const fileRef = useRef(null);
  const dispatch = useDispatch();

  useEffect(() => {
    if (file) {
      handleFileUpload(file);
    }
  }, [file]);

  const handleFileUpload = (file) => {
    const storage = getStorage(app);
    const fileName = new Date().getTime() + file.name;
    const storageRef = ref(storage, fileName);
    const uploadTask = uploadBytesResumable(storageRef, file);

    uploadTask.on(
      "state_changed",
      (snapshot) => {
        const progress =
          (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
        setFileProc(Math.round(progress));
      },
      (error) => {
        setErrorFileUpload(true);
      },
      () => {
        getDownloadURL(uploadTask.snapshot.ref).then((downLoadURL) => {
          setFormData((prev) => {
            return { ...prev, avatar: downLoadURL };
          });
        });
      }
    );
  };

  const handleChenge = async (e) => {
    setFormData({ ...formData, [e.target.id]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      dispatch(updateUserStart());

      const res = await fetch(`/api/user/update/${currentUser._id}`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(formData),
      });
      const data = await res.json();

      if (data.success === false) {
        dispatch(updateUserFailure(data.message));

        return;
      }

      dispatch(updateUserSuccess(data));
      setUpdateSuccess(true);
    } catch (error) {
      dispatch(updateUserFailure(error.message));
    }
  };

  const handleDeleteUser = async () => {
    try {
      dispatch(deleteUserStart());
      const res = await fetch(`api/user/delete/${currentUser._id}`, {
        method: "DELETE",
      });
      const data = await res.json();
      console.log(currentUser);
      if (data.success === false) {
        dispatch(deleteUserFailure(data.error));
        return;
      }
      dispatch(deleteUserSuccess(data));
      console.log(currentUser);
    } catch (error) {
      dispatch(deleteUserFailure(error.message));
    }
  };

  const handleLogOut = async () => {
    try {
      dispatch(logOutUserStart());
      const res = await fetch("/api/signout");
      const data = await res.json();
      if (data.success === false) {
        dispatch(logOutUserFailure(data.message));
        return;
      }
      dispatch(logOutUserSuccess());
    } catch (error) {
      dispatch(logOutUserFailure(error.message));
    }
  };

  const handlerShowListing = async () => {
    try {
      setErrorShowListings(false);
      const res = await fetch(`/api/user/listings/${currentUser._id}`);
      const data = await res.json();

      if (res.status === false) {
        return setErrorShowListings(res.message);
      }
      setListings(data);
    } catch (error) {
      setErrorShowListings(error.message);
    }
  };
  const handlerListingDelete = async (listingID) => {
    try {
      const res = await fetch(`/api/listing/delete/${listingID}`, {
        method: "DELETE",
      });
      const data = await res.json();
      if (data.success === false) {
        return data.message;
      }
      setListings((prev) => prev.filter((item) => item._id !== listingID));
    } catch (error) {
      console.log(error.message);
    }
  };

  
  // firebase storage
  // allow read;
  // allow write: if
  // request.resource.size < 2 * 1024 * 1024 &&

  // request.resource.contentType.matches('image/.*')
  return (
    <div className="profile container">
      <div className="profile-inner">
        <h2 className="profile-title">Ваш профиль</h2>

        <img
          className="profile-img"
          onClick={() => fileRef.current.click()}
          src={formData.avatar || currentUser.avatar}
          alt="profile"
        />
        <p className="profile-upload">
          {errorFileApload ? (
            <span className="profile-upload__error">
              Не удалось обновить картинку(картинка должна быть менее 2мб)
            </span>
          ) : fileProc > 0 && fileProc < 100 ? (
            <span className="profile-upload__success">{`Загрузка ${fileProc}%`}</span>
          ) : fileProc === 100 ? (
            <span className="profile-upload__success">Обновление успешно!</span>
          ) : (
            ""
          )}
        </p>
        <form className="profile-form" onSubmit={handleSubmit}>
          <input
            type="file"
            ref={fileRef}
            onChange={(e) => setFile(e.target.files[0])}
            hidden
            accept="image/*"
          />
          <input
            className="profile-form__element"
            id="username"
            type="text"
            defaultValue={currentUser.username}
            placeholder="Имя"
            onChange={handleChenge}
          />
          <input
            className="profile-form__element"
            id="email"
            type="email"
            defaultValue={currentUser.email}
            placeholder="Email"
            onChange={handleChenge}
          />
          <input
            className="profile-form__element"
            id="password"
            type="password"
            placeholder="Пароль"
            onChange={handleChenge}
          />
          <button className="profile-btn" type="submit">
            {loading ? "Загрузка..." : "Изменить"}
          </button>
        </form>
        <Link className="link" to={"/listing/create"}>
          <button className="add-listing" type="button">
            Добавить обьявление
          </button>
        </Link>

        <div className="account">
          <span className="account__delete" onClick={handleDeleteUser}>
            Удалить аккаунт
          </span>
          <span className="account__sign-out" onClick={handleLogOut}>
            Выйти из аккаунта
          </span>
        </div>

        <p className="error">{error ? error : ""}</p>
        <p>{updateSuccess ? "Данные изменены" : ""}</p>
        <button onClick={handlerShowListing} className="listing-show-btn">
          Показать мои обьявления
        </button>
        <p> {errorShowListings ? "Ошибка при получении обьявлений" : ""}</p>

        {listings.length !== 0 && (
          <div className="listing-cards">
            <h2 className="listing-cards__title">Ваши объявления</h2>
            {listings.map((item) => (
              <div key={item._id} className="listing-card">
                <Link to={`/listing/${item._id}`}>
                  <img
                    className="listing-card__image"
                    src={item.imageUrls[0]}
                    alt="listing image"
                  />
                </Link>
                <p>{item.name}</p>
                <div className="listing-buttons">
                  <Link to={`/listing/update/${item._id}`}>
                    <button className="listing-buttons__edit">Изменить</button>
                  </Link>

                  <button
                    onClick={() => handlerListingDelete(item._id)}
                    className="listing-buttons__delete"
                  >
                    удалить
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default Profile;
