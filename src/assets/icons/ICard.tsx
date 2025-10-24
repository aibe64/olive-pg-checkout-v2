import { IconProps } from "../../models/application/props";

const ICard: React.FC<IconProps> = ({ color, className }) => {
  return (
    <svg
      width="20"
      height="20"
      viewBox="0 0 20 20"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={className}
    >
      <path
        d="M5.36699 2.9209H14.6253C17.592 2.9209 18.3337 3.65423 18.3337 6.57923V13.4209C18.3337 16.3459 17.592 17.0792 14.6337 17.0792H5.36699C2.40866 17.0876 1.66699 16.3542 1.66699 13.4292V6.57923C1.66699 3.65423 2.40866 2.9209 5.36699 2.9209Z"
        fill={color}
      />
      <path
        d="M1.66699 7.0874H18.3337"
        stroke="white"
        strokeWidth="1.5"
        strokeMiterlimit="10"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <path
        d="M5 13.7539H6.66667"
        stroke="white"
        strokeWidth="1.5"
        strokeMiterlimit="10"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <path
        d="M8.75 13.7539H12.0833"
        stroke="white"
        strokeWidth="1.5"
        strokeMiterlimit="10"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
};

export default ICard;
