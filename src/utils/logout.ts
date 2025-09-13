export default function Logout() {
    localStorage.setItem("user", JSON.stringify({ name: null }));
    localStorage.removeItem("session");
    localStorage.removeItem("token");
    localStorage.removeItem("expires");

}