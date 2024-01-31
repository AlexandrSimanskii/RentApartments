import { useSelector } from "react-redux";

const Profile = () => {
  const { currentUser } = useSelector((state) => state.user);
  console.log(currentUser.avatar);
  return (
    <div className="profile container">
      <h2 className="profile-title">Ваш профиль</h2>
      <img className="profile-img" src={currentUser.avatar} alt="profile" />
      <form className="profile-form">
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
        <button type="submit">Изменить</button>
      </form>
    </div>
  );
};

export default Profile;
