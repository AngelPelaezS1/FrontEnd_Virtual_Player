import './LoginScreen.css';

export default function LoginScreen({ onLogin, onSwitch }) {
  const handleLogin = async (e) => {
    e.preventDefault(); // Prevenimos el comportamiento por defecto (recargar la página)

    const name = e.target.name.value; // Obtenemos el valor del input name
    const password = e.target.password.value; // Obtenemos el valor del input password

    const res = await fetch("http://localhost:8080/auth/login", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ name, password }) // Enviamos los datos como JSON
    });

    if (res.ok) {
      const token = await res.text(); // Si fue bien, obtenemos el token como texto
      localStorage.setItem("jwt", token); // Lo guardamos en el localStorage


      onLogin(); // Llamamos a la función onLogin que actualiza el estado en App.js
    } else {
      alert("Incorrect credentials"); // Si algo va mal, mostramos error
    }
  };

  return (
    <div className="stadium-bg">
      <form className="login-panel" onSubmit={handleLogin}>
        <input name="name" type="text" placeholder="Name" />
        <input name="password" type="password" placeholder="Password" />
        <button type="submit">LOG IN</button>
        <p className="forgot" onClick={onSwitch}>
          Don't have an account? Register
        </p>
      </form>
    </div>
  );
}
