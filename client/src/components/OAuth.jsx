import { GoogleAuthProvider, getAuth, signInWithPopup } from "firebase/auth";
import { app } from "../firebase";
import { useDispatch } from "react-redux";
import { useNavigate } from "react-router-dom";
import { signInFailure, signInSuccess } from "../redux/users/userSlise";

const OAuth = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const handlerGoogleAuth = async () => {
    try {
      const provider = new GoogleAuthProvider();
      const auth = getAuth(app);
      const result = await signInWithPopup(auth, provider);
      const password =
        Math.random().toString().slice(-8) + Math.random().toString().slice(-8);
      const res = await fetch("/api/signwithgoogle", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          password,
          username: result.user.displayName,
          email: result.user.email,
        }),
      });
      const data = await res.json();
      if (data.success === false) {
        dispatch(signInFailure(data.message));
      } else {
        dispatch(signInSuccess(data));
        navigate("/");
        // localStorage.setItem("user", JSON.stringify(data));
      }
    } catch (error) {
      console.log("Ошибка при аутентификации FIREBASE", error);
    }
  };

  return (
    <button
      className="signUp-button signUp-button_google"
      onClick={handlerGoogleAuth}
    >
      Войти с Google
    </button>
  );
};

export default OAuth;
