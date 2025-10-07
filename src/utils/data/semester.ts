export default function get_this_semester() {
    let { semester } = JSON.parse(localStorage.getItem("user") as string);
    return semester;
}