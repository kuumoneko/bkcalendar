import fetch_data from "@/utils/fetch";

/**
 * Get Schedule of user
 */
export default async function get_exam(authorization: string, mssv: string, hocky: string, namhoc: string): Promise<{
    subject: string,
    date: string,
    building: string,
    room: string,
    startTime: string,
    duration: string,
    class: string,
}[]> {

    const res = await fetch_data("/api/mybk/api/exam",  {
        "Content-Type": "application/json"
    }, {
        authorization: authorization,
        hocky: hocky, namhoc: namhoc, mssv: mssv
    })

    const result = res.data.map((item: any) => {
        return {
            subject: item.TENMONHOC,
            date: item.NGAYTHI,
            building: item.MACOSO,
            room: item.MAPHONG,
            startTime: item.GIOBD,
            duration: item.GIO_SOPHUT,
            class: item.NHOMLOP
        }
    })

    return result;
}