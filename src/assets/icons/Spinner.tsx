const Spinner = () => {
  return (
    <svg
      width="26"
      height="26"
      viewBox="0 0 26 26"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className="animate-spin mx-auto"
      style={{ animationDuration: "5s" }}
    >
      <path
        d="M12.75 25C19.35 25 24.75 19.6 24.75 13C24.75 6.4 19.35 1 12.75 1C6.15 1 0.75 6.4 0.75 13C0.75 19.6 6.15 25 12.75 25Z"
        stroke="#656565"
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeDasharray="4 4"
      />
    </svg>
  );
};

export default Spinner;
