export default function NotFound() {
    return (
        <div className="h-full w-full flex flex-col items-center justify-center">
            <span>Không tìm thấy trang</span>
            <span>
                Nhấp{" "}
                <span
                    onClick={() => {
                        window.location.href = "/";
                    }}
                    className="underline hover:cursor-pointer"
                >
                    vào đây
                </span>{" "}
                để quay về trang chủ
            </span>
        </div>
    );
}
