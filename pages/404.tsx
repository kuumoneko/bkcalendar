export default function NotFound() {
    return (
        <div className="h-full w-full flex flex-col items-center justify-center">
            <span>Page not found</span>
            <span>
                Click{" "}
                <span
                    onClick={() => {
                        window.location.href = "/";
                    }}
                    className="underline hover:cursor-pointer"
                >
                    here
                </span>{" "}
                to goto homepage
            </span>
        </div>
    );
}
