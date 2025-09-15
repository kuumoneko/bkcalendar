"use client";
import { faGear } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";

export default function Themes({ setopen }: { setopen: (a: boolean) => void }) {
    return (
        <div className="header-icons flex top-[20px] right-[20px] gap-[15px] items-center cursor-pointer">
            <span
                className="material-icons caret-slate-50"
                onClick={() => {
                    setopen(true);
                }}
            >
                <FontAwesomeIcon icon={faGear} className="text-white" />
            </span>
        </div>
    );
}
