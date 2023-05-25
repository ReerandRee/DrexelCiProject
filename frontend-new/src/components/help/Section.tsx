type Props = {
  name: string;
  description?: string;
  image: string;
};

const Section = ({ name, description, image }: Props) => {
  const overlayStyles = `p-5 absolute z-30 flex
  h-[380px] w-[450px] flex-col items-center justify-center
  whitespace-normal bg-gray-800 text-center text-white
  opacity-90 transition duration-500 hover:opacity-0`;

  return (
    <li className="relative mx-5 inline-block h-[380px] w-[450px]">
      <div className={overlayStyles}>
        <p className="text-2xl">{name}</p>
        <p className="mt-5">{description}</p>
      </div>
      <img alt={`${image}`} src={image} height={"100%"} />
    </li>
  );
};

export default Section;
