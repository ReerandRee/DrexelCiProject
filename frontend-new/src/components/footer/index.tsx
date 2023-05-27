import Link from "next/link";

const Footer = () => {
  return (
    <footer className="bg-gray-800 py-16 ">
      <div className="justify-content mx-auto w-5/6 gap-16 md:flex">
        <div className="mt-16 basis-1/2 md:mt-0">
          <img alt="logo" src="/assets/Logo.png" />
          <ul className="list-unstyled my-5">
            <li><Link href="#">Home</Link></li>
            <li><Link href="#about">About</Link></li>
            <li><Link href="#help">Help</Link></li>
          </ul>
          <p>© All Rights Reserved.</p>
        </div>
        <div className="mt-16 basis-1/4 md:mt-0">

        </div>
        <div className="mt-16 basis-1/4 md:mt-0">
          <h4 className="font-bold text-white">Contact Us</h4>
          <p className="mt-5">Address: 3675 Market St, Philadelphia, PA 19104 </p>
          <p>Email: abc@drexel.edu</p>
          <p>Phone: (267) 222-2619.</p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
