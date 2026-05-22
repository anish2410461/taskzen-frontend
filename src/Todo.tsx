import { useEffect, useState } from "react";
type user = {
  tasks: string;
};
export default function TodoList() {
  const [Tasks, settask] = useState<user[]>([]);
  const [text, settext] = useState<string>("");

  const postdata: user = {
    tasks: text,
  };

  useEffect(() => {
    fetch("https://taskzen-backend-818d.onrender.com/getall")
      .then((res) => res.json())
      .then((data) => settask(data));
  },[]);
  if (Tasks == null) {
    return <></>;
  }

  async function handledelete(taskname: string) {
    await fetch(`https://taskzen-backend-818d.onrender.com/delete/${taskname}`, {
      method: "DELETE",
    });
    const newitem: user[] = Tasks.filter((i: user) => i.tasks != taskname);
    settask(newitem);
  }

  async function handleadd() {
    if (text.trim() === "") return;
    await fetch("https://taskzen-backend-818d.onrender.com/add", {
      method: "POST",
      headers: {
        "Content-type": "application/json",
      },
      body: JSON.stringify(postdata),
    });
    settask((prev) => prev.concat(postdata));
    settext("");
  }
  return (
    <>
      <div className="w-[400px]  border-gray-400 rounded-2xl shadow-2xl  m-auto my-5 min-h-[500px] p-3">
        <h1 className="mb-3 text-2xl font-bold text-shadow-xl text-shadow-gray-800 text-blue-700">
          TODOLIST
        </h1>
        <div className=" flex justify-between shadow-2xl shadow-black-300 mb-3">
          <input
            value={text}
            onChange={(e) => settext(e.target.value)}
            type="text"
            className="border border-gray-400 border-r-0 w-full active:outline-0 focus:outline-0 rounded-2xl rounded-r-none h-10 pl-3"
          />
          <button
            onClick={() => handleadd()}
            className="bg-blue-400 text-white p-1 tracking-wide w-20 rounded-2xl rounded-l-none active:bg-blue-900 transition-all delay-75"
          >
            Add
          </button>
        </div>
        <div className="mx-1">
          {Tasks?.map((m, i) => (
            <div
              key={i}
              className=" flex justify-between my-2 shadow-sm shadow-blue-400 rounded-2xl p-2"
            >
              <h1 className="font-medium flex items-center">{m?.tasks}</h1>
              <button
                className="p-1 tracking-wide w-20 rounded-2xl font-bold text-white bg-red-500  active:bg-red-900 transition-all delay-75"
                onClick={() => m?.tasks && handledelete(m.tasks as string)}
              >
                Delete
              </button>
            </div>
          ))}
        </div>
      </div>
    </>
  );
}
