import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";

const SignUp = () => {
  const [dataForm, setDataForm] = useState({});
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const onChengeHeandler = (e) => {
    const newData = { ...dataForm, [e.target.id]: e.target.value };
    setDataForm(newData);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    if (!dataForm.password || !dataForm.email || !dataForm.username) {
      setError("Заполните все поля");
      setLoading(false);
      return;
    }
    try {
      const res = await fetch("/api/signup", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(dataForm),
      });
      const data = await res.json();

      if (data.success === false) {
        setError(data.message);
        setLoading(false);
        return;
      }
      setLoading(false);
      navigate("/signIn");
    } catch (err) {
      console.log(err);
      setError(err.message);
      setLoading(false);
    }
  };

  return (
    <div className="signUp">
      <h1 className="signUp-title">Регистрация</h1>
      <form className="signUp-form" action="submit" onSubmit={handleSubmit}>
        <input
          className="signUp-form__item"
          id="username"
          type="text"
          placeholder="Ваше Имя..."
          onChange={onChengeHeandler}
        />
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
          placeholder="Придумайте пароль..."
          onChange={onChengeHeandler}
        />
        <button className="signUp-button" disabled={loading}>
          {loading ? "Регистрация..." : "Зарегистрироваться"}
        </button>
        <div className="signUp-bottom">
          <p>Уже есть аккаунт?</p>
          <Link to={"/signIn"}>
            <span className="signUp-bottom__link">Войти</span>
          </Link>
        </div>
        <p>{error}</p>
      </form>
    </div>
  );
};

export default SignUp;
