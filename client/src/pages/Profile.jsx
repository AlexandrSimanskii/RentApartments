import { useEffect, useRef, useState } from "react";
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
} from "../redux/users/userSlise.js";

const Profile = () => {
  const [file, setFile] = useState(null);
  const [fileProc, setFileProc] = useState(0);
  const [errorFileApload, setErrorFileUpload] = useState(false);
  const [formData, setFormData] = useState({});
  const [updateSuccess, setUpdateSuccess] = useState(false);
  const { currentUser, loading, error } = useSelector((state) => state.user);
  const fileRef = useRef(null);
  const dispatch = useDispatch();
  console.log(error);

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
        console.log(data.message);
        return;
      }

      dispatch(updateUserSuccess(data));
      setUpdateSuccess(true);
    } catch (error) {
      dispatch(updateUserFailure(error.message));
    }
  };

  // firebase storage
  // allow read;
  // allow write: if
  // request.resource.size < 2 * 1024 * 1024 &&

  // request.resource.contentType.matches('image/.*')
  return (
    <div className="profile container">
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
        <button className="profile_btn" type="submit">
          {loading ? "Загрузка..." : "Обновить"}
        </button>
      </form>
      <p>{error ? error : ""}</p>
      <p>{updateSuccess ? "Данные изменены" : ""}</p>
    </div>
  );
};

export default Profile;
