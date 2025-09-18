import Image from "next/image";
import ProfileImage from "@/public/bk_logo.png";

export default function Hcmut_Logo({
    height,
    width,
}: {
    height: number;
    width: number;
}) {
    return (
        <Image
            // use downloaded logo from mybk.hcmut.edu.vn, so i think it will be ok :>
            src={ProfileImage}
            className={`mr-[5px]`}
            height={height ?? 20}
            width={width ?? 20}
            alt="hcmut logo"
        />
    );
}
