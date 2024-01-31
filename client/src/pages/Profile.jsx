import { useEffect, useRef, useState } from "react";
import { useSelector } from "react-redux";
import {
  getStorage,
  uploadBytesResumable,
  ref,
  getDownloadURL,
} from "firebase/storage";
import { app } from "../firebase";

const Profile = () => {
  const [file, setFile] = useState(null);
  const [fileProc, setFileProc] = useState(0);
  const [errorFileApload, setErrorFileUpload] = useState(false);
  const [formData, setFormData] = useState({});
  const { currentUser } = useSelector((state) => state.user);
  const fileRef = useRef(null);
  console.log(formData);
  console.log(errorFileApload);
  console.log(fileProc);

  useEffect(() => {
    if (file) {
      handleFileUload(file);
    }
  }, [file]);

  const handleFileUload = (file) => {
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
        src={currentUser.avatar}
        alt="profile"
      />
      <form className="profile-form">
        <input
          type="file"
          ref={fileRef}
          onChange={(e) => setFile(e.target.files[0])}
          hidden
          accept="image/*"
        />
        <input
          className="profile-form__element"
          id="name"
          type="text"
          placeholder="Имя"
        />
        <input
          className="profile-form__element"
          id="email"
          type="email"
          placeholder="Email"
        />
        <input
          className="profile-form__element"
          id="password"
          type="password"
          placeholder="Пароль"
        />
        <button className="profile_btn" type="submit">
          Изменить
        </button>
      </form>
    </div>
  );
};

export default Profile;
