import { Link } from "react-router-dom";

const SignUp = () => {
  return (
    <div className="signUp">
      <h1 className="signUp-title">Регистрация</h1>
      <form className="signUp-form" action="submit">
        <input
          className="signUp-form__item"
          id="signUp-name"
          type="text"
          placeholder="Ваше Имя..."
        />
        <input
          className="signUp-form__item"
          id="signUp-email"
          type="email"
          placeholder="Ваш Email..."
        />
        <input
          className="signUp-form__item"
          id="signUp-password"
          type="password"
          placeholder="Придумайте пароль..."
        />
        <button className="signUp-button">Зарегистрироваться</button>
        <div className="signUp-bottom">
          <p>Уже есть аккаунт?</p>
          <Link to={"/signIn"}>
            <span className="signUp-bottom__link">Войти</span>
          </Link>
        </div>
      </form>
    </div>
  );
};

export default SignUp;
