import { useNavigate } from "react-router-dom";

export default function NotFound() {
  const navigate = useNavigate();

  const handleBack = () => {
    if (window.history.length > 1) navigate(-1);
    else navigate("/");
  };

  return (
    <div className="mt-10 h-full w-full flex flex-col items-center justify-center px-6 ">
      <div className="max-w-md w-full flex flex-col items-center text-center gap-6">
        
        <div className="text-7xl font-extrabold tracking-tight text-black">
          404
        </div>

        <p className="text-base text-gray-600 leading-relaxed text-start">
          Oops... The page you're looking for doesn't exist or was moved.
        </p>

        <button
          onClick={handleBack}
          className="px-6 py-3 rounded-xl bg-black text-white hover:bg-black/80 transition-all duration-150 cursor-pointer"
        >
          Go Back
        </button>
      </div>
    </div>
  );
}
