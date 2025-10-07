import Table from "@/components/table";
import { SubjectInfo } from "@/types";
import mongodb from "@/utils/data/databsae";
import { useEffect, useState } from "react";

export default function Filter() {
    const [filter, setfilter] = useState({ add: [], filter: [] });
    const [schedule, setschedule] = useState([]);
    const [class_code, set_class_code] = useState("");

    const [filter_sub, set_filter_sub] = useState([]);

    useEffect(() => {
        async function run() {
            const { username } = JSON.parse(
                localStorage.getItem("user") as string
            );
            const user_temp = await mongodb("schedule", "get", {
                username,
            });

            const filter_temp = await mongodb("filter", "get", {
                username,
            });
            const add_list: any = [];
            const filter_list: any = [];

            filter_temp.forEach((item: any) => {
                if (Object.keys(item).length > 2) {
                    add_list.push(item);
                } else {
                    filter_list.push(item);
                }
            });
            // dates is yyyy-mm-dd, remove the add items in add_list the the dates if the previous day from today
            const today = new Date();
            const filtered_add_list = add_list.filter((item: any) => {
                const itemDate = new Date(item.dates[0]);
                return itemDate >= today;
            });
            add_list.splice(0, add_list.length, ...filtered_add_list);

            const new_filter = { add: add_list, filter: filter_list };
            setfilter(new_filter);
            setschedule(user_temp);
        }
        run();
    }, []);

    useEffect(() => {
        if (class_code.length === 0) return;
        const temp =
            schedule.filter((item: any) => {
                return item.class.includes(class_code);
            }) ?? [];

        set_filter_sub(temp.slice(0, 8));
    }, [class_code]);

    return (
        <>
            <div className="flex flex-col items-center justify-start h-full w-full mt-4 ml-4">
                <div className="h-[10%] w-full flex flex-col items-center justify-center">
                    <div className="text-4xl">Filter page</div>
                </div>

                <div className="w-full h-[20%] flex flex-col items-center justify-center">
                    <span className="h-[10%] w-full flex flex-col items-center justify-center">
                        <span>
                            Nhập mã Lớp để chọn môn học, nếu muốn thay đổi thông
                            tin thì nhập thông tin cần thay đổi ở Mục "Trước" và
                            "Sau". Nếu muốn thêm mới thì bỏ trống "Trước" và
                            điền đủ thông tin ở "Sau"
                        </span>
                    </span>
                    <div className="h-[45%] w-full flex flex-col items-center">
                        <div>
                            Nhập mã lớp để tạo buổi học mới hoăc bấm vào bên để
                            thêm lớp
                        </div>
                        <div className="w-full flex flex-col items-center">
                            <div className="flex flex-row">
                                <span>Mã lớp </span>
                                <input
                                    type="text"
                                    className="bg-slate-500 text-slate-800 px-2 mx-2 rounded-2xl"
                                    onChange={(e) => {
                                        set_class_code(
                                            new String(
                                                e.target.value
                                            ).toLocaleUpperCase()
                                        );
                                    }}
                                />
                                <div
                                    onClick={() => {
                                        window.location.href =
                                            "/filter/add/subject";
                                    }}
                                    className="hover:cursor-pointer"
                                >
                                    Thêm lớp
                                </div>
                            </div>
                            {filter_sub.length > 0 ? (
                                <div className="grid grid-cols-4 grid-rows-2 gap-2  w-full mt-3">
                                    {filter_sub.map((item: any) => {
                                        return (
                                            <div
                                                key={`${item.subject}`}
                                                className="flex flex-col items-center justify-center rounded-4xl hover:bg-slate-400 hover:text-slate-600 hover:cursor-pointer"
                                                onClick={() => {
                                                    window.location.href = `/filter/add/filter?data=${encodeURIComponent(
                                                        JSON.stringify(item)
                                                    )}`;
                                                }}
                                            >
                                                <div>{item.subject}</div>
                                                <div>{item.teacher}</div>
                                            </div>
                                        );
                                    })}
                                </div>
                            ) : (
                                <div>
                                    <span>
                                        Không tìm thấy môn học, hãy nhập mã lớp
                                    </span>
                                </div>
                            )}
                        </div>
                    </div>
                </div>

                {filter.add.length > 0 && (
                    <div className="w-full h-[30%] flex flex-col items-center">
                        <span>Thêm môn học</span>
                        <Table
                            subjects={filter.add.map((item: SubjectInfo) => {
                                return item;
                            })}
                            mode="filter"
                        />
                    </div>
                )}

                {filter.filter.length > 0 && (
                    <div className="w-full h-[30%] flex flex-col items-center">
                        <span>Bộ lọc</span>
                        <div className="w-full grid grid-cols-3">
                            {filter.filter.map((item: SubjectInfo) => {
                                const keys = Object.keys(item).filter(
                                    (item: string) => item !== "class"
                                );
                                return (
                                    <div
                                        className="flex flex-col items-center w-full hover:bg-slate-600 hover:cursor-pointer rounded-2xl"
                                        onClick={() => {
                                            window.location.href = `/filter/edit/filter?data=${encodeURIComponent(
                                                JSON.stringify(item)
                                            )}`;
                                        }}
                                    >
                                        <div className="flex flex-row">
                                            {item.class && (
                                                <div>{item.class}</div>
                                            )}
                                        </div>
                                        <div className="flex flex-col items-center w-full">
                                            {keys.map((key: string) => {
                                                return (
                                                    <div className="flex flex-row items-center w-full justify-evenly">
                                                        <div>{key}</div>
                                                        <div>{"->"}</div>
                                                        <div>
                                                            {
                                                                item[
                                                                    key as keyof SubjectInfo
                                                                ]
                                                            }
                                                        </div>
                                                    </div>
                                                );
                                            })}
                                        </div>
                                    </div>
                                );
                            })}
                        </div>
                    </div>
                )}
            </div>
        </>
    );
}
