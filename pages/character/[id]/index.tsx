import {useState, useEffect} from 'react'
import type { NextPage } from "next";
import Head from "next/head";
import Link from "next/link";
import { useTheme } from "next-themes";
import { BsFillSunFill, BsFillMoonStarsFill, BsArrowLeftCircle } from "react-icons/bs";


const defaultEndpoint = "https://rickandmortyapi.com/api/character";

export async function getServerSideProps({ query }: {query: any}) {
  const { id } = query;
  const res = await fetch(`${defaultEndpoint}/${id}`);
  const data = await res.json();

  return {
    props: {
      data,
    }, // will be passed to the page component as props
  };
}
const Character: NextPage = ({ data }) => {
  const { name, image, gender, location, origin, species, status } = data;
  

  // Dark Mode
  const { theme, setTheme } = useTheme();
  const [mounted, setMounted] = useState(false);
  useEffect(() => {
    setMounted(true);
  }, []);
  if (!mounted) return null;
  console.log(data);
  return (
    <div className=" min-h-screen flex-col items-center justify-center py-2">
      <Head>
        <title>{name}</title>
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <button
        className=" float-right  mr-20 my-10"
        onClick={() => setTheme(theme === "light" ? "dark" : "light")}
      >
        <span>
          {theme === "light" ? (
            <BsFillMoonStarsFill className='transition ease-in-out delay-150  hover:-translate-y-2 hover:scale-110  duration-300' size={30} />
          ) : (
            <BsFillSunFill className='transition ease-in-out delay-150  hover:-translate-y-1 hover:scale-110  duration-300' size={30} />
          )}
        </span>
      </button>

      <Link href='/'>
      <BsArrowLeftCircle className='float-left  ml-20 mt-10 transition ease-in-out delay-150 hover:-translate-x-1 hover:scale-110  duration-300' size={34} />
      </Link>

      <main className=" mt-40 text-center ">
        <h1 className="text-6xl font-bold "> {name} </h1>

   <div className="flex mt-16  justify-center text-left">
    <div className="mr-4">
      <img src={image} alt={name} />
    </div>
    <div className="text-xl mt-4">
      <h2 className="text-2xl font-bold mb-6">Character Details</h2>
      <ul className="space-y-2  lg:ml-4 ">
        <li>
          <strong>Name:</strong> { name }
        </li>
      
        <li>
          <strong>Status:</strong> { status }
        </li>
      
        <li>
          <strong>Gender:</strong> { gender }
        </li>
      
        <li>
          <strong>Species:</strong> { species }
        </li>
      
        <li>
          <strong>Location:</strong>  { location?.name }
        </li>
      
        <li>
          <strong>Originaly From:</strong> { origin?.name }
        </li>
      </ul>
    </div>
   </div>
   

       
       
      </main>
    </div>
  );
};

export default Character;
