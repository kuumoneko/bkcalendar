import mongodb from "@/utils/data/databsae";
export default function Filter({
    data,
    selections,
    handleChange,
    filter,
    setfilter,
}: {
    data: any;
    selections: string[];
    handleChange: (e: any) => void;
    filter: any;
    setfilter: (value: any) => void;
}) {
    return (
        <>
            <div>
                <div>
                    <input
                        type="checkbox"
                        onChange={handleChange}
                        name=""
                        id="subject"
                        checked={selections?.includes("subject")}
                    />

                    <label htmlFor="subject">
                        {"Subject "}
                        {data?.subject}
                    </label>
                </div>
                <div>
                    <input
                        type="checkbox"
                        onChange={handleChange}
                        name=""
                        id="teacher"
                        checked={selections?.includes("teacher")}
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
                        type="checkbox"
                        onChange={handleChange}
                        name=""
                        id="time"
                        checked={selections?.includes("time")}
                    />
                    <label htmlFor="time">
                        {"Lesson "}
                        {data?.lesson} ({data?.startTime} - {data?.endTime})
                    </label>
                </div>
                <div>
                    <input
                        type="checkbox"
                        onChange={handleChange}
                        name=""
                        id="date"
                        checked={selections?.includes("date")}
                    />
                    <label htmlFor="date">
                        {"Date "}
                        <select
                            className="bg-slate-600 text-slate-800"
                            disabled={!selections?.includes("date")}
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
                        type="checkbox"
                        onChange={handleChange}
                        name=""
                        id="location"
                        checked={selections?.includes("location")}
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
                {selections?.includes("subject") && (
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
                {selections?.includes("teacher") && (
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
                {selections?.includes("time") && (
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
                {selections?.includes("date") && (
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
                {selections?.includes("location") && (
                    <div>
                        location{" "}
                        <input
                            type="text"
                            className="bg-slate-600 text-slate-300 rounded-2xl px-2"
                            onChange={(e) => {
                                setfilter({
                                    ...filter,
                                    location: e.target.value,
                                });
                            }}
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
                                await mongodb("filter", "post", {
                                    username: username,
                                    data: filter_temp,
                                });
                            }
                            run();
                        }}
                    >
                        Submit
                    </div>
                )}
            </div>
        </>
    );
}
