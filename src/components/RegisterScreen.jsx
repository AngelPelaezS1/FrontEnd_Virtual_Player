// Importamos los estilos del login
import './LoginScreen.css';

export default function RegisterScreen({ onSwitch }) {
  const handleRegister = async (e) => {
    e.preventDefault(); // Evitamos que se recargue la página

    const name = e.target.name.value; // Obtenemos el nombre del input
    const password = e.target.password.value; // Obtenemos la contraseña

    // Enviamos los datos al backend para registrar al usuario
    const res = await fetch("http://localhost:8080/auth/register", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ name, password }) // Enviamos los datos como JSON
    });

    if (res.ok) {
      alert("Registration successful! You can now log in."); // Éxito
      onSwitch(); // Volvemos a la pantalla de login
    } else {
      alert("Registration failed"); // Error
    }
  };

  return (
    <div className="stadium-bg">
      <form className="login-panel" onSubmit={handleRegister}>
        <input name="name" type="text" placeholder="Name" />
        <input name="password" type="password" placeholder="Password" />
        <button type="submit">REGISTER</button>
        <p className="forgot" onClick={onSwitch}>
          Already have an account? Log in
        </p>
      </form>
    </div>
  );
}
