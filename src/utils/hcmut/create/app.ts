export default async function create_app(url: string) {
    const ticket = new URL(url).searchParams.get("ticket")
    const res = await fetch(`/api/login_app`, {
        method: "POST",
        body: JSON.stringify({
            ticket: ticket
        })
    });
    const data = await res.json();
    return {
        SESSION: data.SESSION,
    };
}