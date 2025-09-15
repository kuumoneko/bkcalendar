import Hcmut from "./account/hcmut";
import Close_Settings from "./other/close";

export default function SettingsModal({
    isOpen,
    setopen,
}: {
    isOpen: boolean;
    setopen: (a: boolean) => void;
}) {
    if (!isOpen) return null;

    return (
        // Overlay for the modal background
        <div className="fixed inset-0 bg-gray-900 bg-opacity-75 flex justify-center items-center z-50 p-4">
            <div className="bg-gray-800 rounded-xl shadow-2xl p-8 w-full max-w-md space-y-6 transform transition-all duration-300 scale-100 opacity-100">
                <Close_Settings
                    onClose={() => {
                        setopen(false);
                    }}
                />
                <Hcmut />

                <div className="text-center pt-4 text-sm text-gray-400">
                    <p>About this web</p>
                    <p>
                        Web này dùng để xem thời khoá biểu và lịch học hằng ngày
                        dành cho sinh viên trường Đại học Bách khoa - Đại học
                        Quốc gia TP.HCM
                    </p>
                    <p>
                        ©️ 2025{" "}
                        <a href="https://github.com/Kuumoneko" target="_blank" rel="noopener noreferrer">Kuumoneko</a>
                    </p>
                </div>
            </div>
        </div>
    );
}
