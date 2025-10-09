import mongodb from "@/utils/data/databsae";
export default function Filter({
    data,
    selections,
    handleChange,
    filter,
    setfilter,
}: {
    data: any;
    selections: string;
    handleChange: (e: any) => void;
    filter: any;
    setfilter: (value: any) => void;
}) {
    return (
        <>
            <div>
                <div>
                    <input
                        type="radio"
                        onChange={handleChange}
                        name="filter"
                        id="subject"
                        checked={selections === "subject"}
                    />

                    <label htmlFor="subject">
                        {"Subject "}
                        {data?.subject}
                    </label>
                </div>
                <div>
                    <input
                        type="radio"
                        onChange={handleChange}
                        name="filter"
                        id="teacher"
                        checked={selections === "teacher"}
                    />
                    <label htmlFor="teacher">
                        {"Teacher "}
                        {data?.teacher?.includes("Chưa biết")
                            ? "Chưa biết"
                            : data?.teacher}
                    </label>{" "}
                </div>
                <div>
                    <input
                        type="radio"
                        onChange={handleChange}
                        name="filter"
                        id="time"
                        checked={selections === "time"}
                    />
                    <label htmlFor="time">
                        {"Lesson "}
                        {data?.lesson} ({data?.startTime} - {data?.endTime})
                    </label>
                </div>
                <div>
                    <input
                        type="radio"
                        onChange={handleChange}
                        name="filter"
                        id="date"
                        checked={selections === "date"}
                    />
                    <label htmlFor="date">
                        {"Date "}
                        <select
                            className="bg-slate-600 text-slate-800"
                            disabled={!(selections === "date")}
                        >
                            {[""]
                                .concat(data?.dates ?? [])
                                .map((item: string) => {
                                    return (
                                        <option
                                            className="bg-slate-600 text-slate-50"
                                            value={item}
                                        >
                                            {item}
                                        </option>
                                    );
                                })}
                        </select>
                    </label>
                </div>
                <div>
                    <input
                        type="radio"
                        onChange={handleChange}
                        name="filter"
                        id="location"
                        checked={selections === "location"}
                    />
                    <label htmlFor="location">
                        {"Location "}
                        {data?.room.includes("NHATHIDAU")
                            ? "NHATHIDAU"
                            : data?.room}{" "}
                        {data?.building.includes("1") ? "CS1" : "CS2"}
                    </label>
                </div>
            </div>
            <div>
                {selections === "subject" && (
                    <div>
                        subject{" "}
                        <input
                            type="text"
                            className="bg-slate-600 text-slate-300 rounded-2xl px-2"
                            onChange={(e) => {
                                setfilter({
                                    ...filter,
                                    subject: e.target.value,
                                });
                            }}
                        />
                    </div>
                )}
                {selections === "teacher" && (
                    <div>
                        teacher{" "}
                        <input
                            type="text"
                            className="bg-slate-600 text-slate-300 rounded-2xl px-2"
                            onChange={(e) => {
                                setfilter({
                                    ...filter,
                                    teacher: e.target.value,
                                });
                            }}
                        />
                    </div>
                )}
                {selections === "time" && (
                    <div>
                        time{" "}
                        <input
                            type="text"
                            className="bg-slate-600 text-slate-300 rounded-2xl px-2"
                            onChange={(e) => {
                                setfilter({
                                    ...filter,
                                    time: e.target.value,
                                });
                            }}
                        />
                    </div>
                )}
                {selections === "date" && (
                    <div>
                        date{" "}
                        <input
                            type="text"
                            className="bg-slate-600 text-slate-300 rounded-2xl px-2"
                            onChange={(e) => {
                                setfilter({
                                    ...filter,
                                    date: e.target.value,
                                });
                            }}
                        />
                    </div>
                )}
                {selections === "location" && (
                    <div>
                        location{" "}
                        {/* <input
                            type="text"
                            className="bg-slate-600 text-slate-300 rounded-2xl px-2"
                            onChange={(e) => {
                                setfilter({
                                    ...filter,
                                    location: e.target.value,
                                });
                            }}
                        /> */}
                        {" CS "}
                        <input
                            type="text"
                            id="class"
                            onChange={(e) => {
                                setfilter({
                                    ...filter,
                                    building: e.target.value,
                                });
                            }}
                            className="bg-slate-500 text-slate-800 px-2 rounded-xl w-[25px]"
                            maxLength={1}
                        />
                        {" - "}
                        <input
                            type="text"
                            id="class"
                            onChange={(e) => {
                                setfilter({
                                    ...filter,
                                    room:
                                        filter?.room?.length === 0
                                            ? e.target.value
                                            : e.target.value +
                                              "-" +
                                              (filter?.room?.split("-")[1] ??
                                                  ""),
                                });
                            }}
                            className="bg-slate-500 text-slate-800 px-2 rounded-xl w-[40px]"
                            maxLength={2}
                        />
                        {" - "}
                        <input
                            type="text"
                            id="class"
                            onChange={(e) => {
                                setfilter({
                                    ...filter,
                                    room:
                                        filter?.room?.length === 0
                                            ? "-" + e.target.value
                                            : (filter?.room?.split("-")[0] ??
                                                  "") +
                                              "-" +
                                              e.target.value,
                                });
                            }}
                            className="bg-slate-500 text-slate-800 px-2 rounded-xl w-[50px]"
                            maxLength={3}
                        />
                    </div>
                )}

                {selections?.length > 0 && (
                    <div
                        onClick={() => {
                            const keys = Object.keys(filter);
                            if (keys.length < 1 || data === undefined) return;

                            const pre: any = {};
                            keys.forEach((item) => {
                                pre[item] = data[item as keyof typeof data];
                            });

                            const aft = {
                                class: data.class,
                                ...filter,
                            };

                            async function run() {
                                const { username } = JSON.parse(
                                    localStorage.getItem("user") as string
                                );

                                const filter_temp = await mongodb(
                                    "filter",
                                    "get",
                                    {
                                        username: username,
                                    }
                                );

                                filter_temp.push(aft);

                                const res = await mongodb("filter", "post", {
                                    username,
                                    data: filter_temp,
                                });
                                if (res.matchedCount > 0) {
                                    alert("Thêm bộ lọc thành công");
                                }
                            }
                            run();
                        }}
                        className="hover:cursor-pointer"
                    >
                        Lưu
                    </div>
                )}
            </div>
        </>
    );
}
