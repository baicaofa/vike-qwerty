import { recordErrorBookAction } from "@/utils";
import { useCallback } from "react";
import { navigate } from "vike/client/router";
import IconBook from "~icons/bxs/book";

const ErrorBookButton = () => {
  const toErrorBook = useCallback(() => {
    navigate("/error-book");
    recordErrorBookAction("open");
  }, []);

  return (
    <button
      type="button"
      onClick={toErrorBook}
      className={`flex items-center justify-center rounded p-[2px] text-lg text-blue-500 outline-none transition-colors duration-300 ease-in-out hover:bg-blue-400 hover:text-white`}
      title="查看错题本"
    >
      <IconBook className="icon" />
    </button>
  );
};

export default ErrorBookButton;
