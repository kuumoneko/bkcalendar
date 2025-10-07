import { SubjectInfo } from "@/types";
import { ChangeEvent, useEffect, useState } from "react";
import Filter from "./filter";
import Lesson from "./lesson";

export default function Page() {
    const [data, setdata] = useState<SubjectInfo>();

    useEffect(() => {
        const data_temp = new URL(window.location.href).searchParams.get(
            "data"
        );
        if (data_temp) {
            setdata(JSON.parse(data_temp));

            setbuilding(data?.building ?? "");
            setStage(data?.room.split("-")[0] ?? "");
            setroom(data?.room.split("-")[1] ?? "");
        }
    }, []);
    const [mode, setmode] = useState<"lesson" | "filter">("lesson");

    const [selections, setselections] = useState<string[]>([]);
    const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
        const { checked, id } = e.target;
        if (checked) {
            setselections([...selections, id]);
        } else {
            setselections(selections.filter((item) => item !== id));
        }
    };

    const [filter, setfilter] = useState<any>({});

    const [lessonStart, setlessonStart] = useState("");
    const [lessonEnd, setlessonEnd] = useState("");
    const [date, setdate] = useState({
        date: "0",
        month: "0",
        year: "0",
    });

    const [Stage, setStage] = useState("");
    const [room, setroom] = useState("");

    const [building, setbuilding] = useState("");

    return (
        <div className="h-full w-full flex flex-col items-center justify-start">
            <span className="text-2xl h-[5%] w-full flex flex-row items-center justify-center">
                Add filter
            </span>
            <div className="flex flex-col items-center justify-center h-[20%]">
                <div className="flex flex-row items-center justify-center gap-2">
                    <div className="flex flex-row gap-2 items-center justify-center">
                        <input
                            type="radio"
                            id="lesson"
                            checked={mode === "lesson"}
                            onChange={() => {
                                setmode("lesson");
                            }}
                        />
                        <label htmlFor="lesson">Lesson</label>
                    </div>
                    <div className="flex flex-row gap-2 items-center justify-center">
                        <input
                            type="radio"
                            id="filter"
                            checked={mode === "filter"}
                            onChange={() => {
                                setmode("filter");
                            }}
                        />
                        <label htmlFor="filter">filter</label>
                    </div>
                </div>
            </div>
            {mode === "filter" ? (
                <Filter
                    data={data}
                    selections={selections}
                    handleChange={handleChange}
                    filter={filter}
                    setfilter={setfilter}
                />
            ) : (
                <Lesson
                    data={data}
                    lessonStart={lessonStart}
                    setlessonStart={setlessonStart}
                    lessonEnd={lessonEnd}
                    setlessonEnd={setlessonEnd}
                    date={date}
                    setdate={setdate}
                    building={building}
                    setbuilding={setbuilding}
                    Stage={Stage}
                    setStage={setStage}
                    room={room}
                    setroom={setroom}
                />
            )}
        </div>
    );
}
