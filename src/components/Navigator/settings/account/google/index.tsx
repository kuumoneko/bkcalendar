import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faSpotify } from "@fortawesome/free-brands-svg-icons";
import { useState } from "react";

export default function Google() {
  const [user, setuser] = useState(
    JSON.parse(localStorage.getItem("user") ?? "{}")
  );

  const [logined, setlogined] = useState(false);
  const [logout, setlogout] = useState(false);

  return (
    <div>
      <span className="flex flex-row justify-between items-center">
        <span>
          <FontAwesomeIcon icon={faSpotify} />
          <span className="text-lg font-semibold text-gray-200 ml-2">
            Spotify:
          </span>
        </span>

        {user.google === "" ? (
          <div
            className="cursor-default"
            onClick={() => {
              setlogined(true);
            }}
          >
            <span className="border-solid rounded-[50px] bg-white py-[5px] px-[10px] text-black flex flex-row">
              <span className="flex items-center justify-center mr-[5px]">
                <FontAwesomeIcon
                  icon={faSpotify}
                  className="text-green-400 h-[20px] w-[20px]"
                />
              </span>
              Log in
            </span>
          </div>
        ) : (
          <div className="flex flex-row-reverse items-center justify-center">
            <span className="pl-[5px]">{""}</span>
          </div>
        )}
      </span>
      {user.google !== "" && (
        <span
          className="cursor-default flex flex-row-reverse items-center"
          onClick={() => {
            setlogout(true);
          }}
        >
          log out
        </span>
      )}
    </div>
  );
}
