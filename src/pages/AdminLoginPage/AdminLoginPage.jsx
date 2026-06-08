import { useState } from "react";
import "./AdminLoginPage.css";

function AdminLoginPage({ isAdminLoggedIn, onLogin }) {
  const [formValues, setFormValues] = useState({
    email: "",
    password: "",
  });
  const [loginError, setLoginError] = useState("");

  const handleChange = (event) => {
    const { name, value } = event.target;

    setFormValues((currentValues) => ({
      ...currentValues,
      [name]: value,
    }));

    setLoginError("");
  };

  const handleSubmit = (event) => {
    event.preventDefault();

    const loginWasSuccessful = onLogin(formValues);

    if (!loginWasSuccessful) {
      setLoginError("Correo o contraseña incorrectos.");
    }
  };

  return (
    <section className="admin-login">
      <div className="admin-login__card">
        <div className="admin-login__brand">
          <img src="/images/logo-los-chanchitos.png" alt="" />
          <div>
            <p>Los Chanchitos</p>
            <span>Panel administrativo</span>
          </div>
        </div>

        <div className="admin-login__header">
          <p className="section__eyebrow">Admin</p>
          <h1>Iniciar sesión</h1>
          <p>
            Accede al panel para administrar pedidos, menú e inventario.
          </p>
        </div>

        {isAdminLoggedIn && (
          <p className="admin-login__notice">
            Ya tienes una sesión activa.
          </p>
        )}

        <form className="admin-login__form" onSubmit={handleSubmit}>
          <label className="admin-login__field">
            <span>Correo</span>
            <input
              name="email"
              type="email"
              value={formValues.email}
              onChange={handleChange}
              placeholder="admin@loschanchitos.com"
              required
            />
          </label>

          <label className="admin-login__field">
            <span>Contraseña</span>
            <input
              name="password"
              type="password"
              value={formValues.password}
              onChange={handleChange}
              placeholder="admin123"
              required
            />
          </label>

          {loginError && <p className="admin-login__error">{loginError}</p>}

          <button className="button button--primary admin-login__button" type="submit">
            Entrar al panel
          </button>
        </form>

        <p className="admin-login__hint">
          Acceso temporal: <strong>admin@loschanchitos.com</strong> /{" "}
          <strong>admin123</strong>
        </p>
      </div>
    </section>
  );
}

export default AdminLoginPage;