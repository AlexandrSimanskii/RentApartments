import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import {
  signInStart,
  signInSuccess,
  signInFailure,
} from "../redux/users/userSlise";

const SignIn = () => {
  const [dataForm, setDataForm] = useState({});
  const { loading, error } = useSelector((state) => state.user);
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const onChengeHeandler = (e) => {
    const newData = { ...dataForm, [e.target.id]: e.target.value };

    setDataForm(newData);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    dispatch(signInStart());
    if (!dataForm.password || !dataForm.email) {
      dispatch(signInFailure("Заполните все поля"));
      return;
    }
    try {
      const res = await fetch("/api/signin", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(dataForm),
      });

      const data = await res.json();

      if (data.success === false) {
        dispatch(signInFailure(data.message));
      } else {
        dispatch(signInSuccess(data));
        navigate("/");
      }
    } catch (err) {
      dispatch(signInFailure(err.message));
    }
  };
  return (
    <div className="signUp">
      <h1 className="signUp-title">Вход в аккаунт</h1>
      <form className="signUp-form" action="submit" onSubmit={handleSubmit}>
        <input
          className="signUp-form__item"
          id="email"
          type="email"
          placeholder="Ваш Email..."
          onChange={onChengeHeandler}
        />
        <input
          className="signUp-form__item"
          id="password"
          type="password"
          placeholder="Ваш пароль..."
          onChange={onChengeHeandler}
        />
        <button className="signUp-button" disabled={loading}>
          {loading ? "Загрузка..." : "Войти"}
        </button>
        <div className="signUp-bottom">
          <p>Нет аккаунта?</p>
          <Link to={"/signup"}>
            <span className="signUp-bottom__link">Регистрация</span>
          </Link>
        </div>
        <p>{error}</p>
      </form>
    </div>
  );
};

export default SignIn;
