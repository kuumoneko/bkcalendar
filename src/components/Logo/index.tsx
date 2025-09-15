export default function Hcmut_Logo({
    height,
    width,
}: {
    height: number;
    width: number;
}) {
    return (
        <img
            // use logo from sso.hcmut.edu.vn, so i think it will be ok :>
            src="https://mybk.hcmut.edu.vn/app/asset/img/bk_logo.png"
            className={`mr-[5px]`}
            height={height ?? 20}
            width={width ?? 20}
            alt="hcmut logo"
        />
    );
}
