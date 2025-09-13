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
            src="https://sso.hcmut.edu.vn/cas/images/bk_logo.png"
            className={`h-[${height ?? 20}px] w-[${width ?? 20}px] mr-[5px]`}
            alt="hcmut logo"
        />
    );
}
