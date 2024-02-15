/* eslint-disable react/prop-types */
import { useEffect, useState } from "react";
import { Link } from "react-router-dom";

const Contact = ({ listing }) => {
  const [owner, setOwner] = useState(null);
  const [message, setMessage] = useState("");

  console.log(listing);

  useEffect(() => {
    const getUser = async () => {
      const data = await fetch(`/api/user/${listing.userRef}`);
      const user = await data.json();
      setOwner(user);
    };
    getUser();
  }, [listing.userRef]);

  const handleChange = (e) => setMessage(e.target.value);

  return (
    <div className="contact">
      <p className="contact-title">
        Введите сообщение для{" "}
        <span className="contact-title__inner">{owner?.username}</span> по
        обьявлению <span className="contact-title__inner"> {listing.name}</span>
      </p>
      <textarea className="contact-textarea"
        name="message"
        id="message"
        rows="2"
        value={message}
        onChange={handleChange}
      ></textarea>

      <Link
        to={`mailto:${owner?.email}?subject=Regarding ${listing.name}&body=${message}`}
      >
        <button>Отправить сообщение</button>
        
      </Link>
    </div>
  );
};

export default Contact;
