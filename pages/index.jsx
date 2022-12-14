import { useState, useEffect } from "react";
import Head from "next/head";
import Link from "next/link";
import { useTheme } from "next-themes";
import { motion } from "framer-motion";
import { BsFillSunFill, BsFillMoonStarsFill } from "react-icons/bs";

const defaultEndpoint = "https://rickandmortyapi.com/api/character";

export async function getServerSideProps() {
  const res = await fetch(defaultEndpoint);
  const data = await res.json();

  return {
    props: {
      data,
    }, 
  };
}
const Home = ({ data }) => {
  const { info, results: defaultResults = [] } = data;
  const [results, updateResults] = useState(defaultResults);
  const [page, updatePage] = useState({
    ...info,
    current: defaultEndpoint,
  });

  const { current } = page;

  useEffect(() => {
    if (current === defaultEndpoint) return;

    async function request() {
      const res = await fetch(current);
      const nextData = await res.json();

      updatePage({
        current,
        ...nextData.info,
      });

      if (!nextData.info?.prev) {
        updateResults(nextData.results);
        return;
      }

      updateResults((prev) => {
        return [...prev, ...nextData.results];
      });
    }

    request();
  }, [current]);

  function handleLoadMore() {
    updatePage((prev) => {
      return {
        ...prev,
        current: page?.next,
      };
    });
  }

  function handleOnSubmitSearch(e) {
    e.preventDefault();

    const { currentTarget = {} } = e;
    const fields = Array.from(currentTarget?.elements);
    const fieldQuery = fields.find((field) => field.name === "query");

    const value = fieldQuery.value || "";
    const endpoint = `https://rickandmortyapi.com/api/character/?name=${value}`;

    updatePage({
      current: endpoint,
    });
  }

  // Dark Mode
  const { theme, setTheme } = useTheme();
  const [mounted, setMounted] = useState(false);
  useEffect(() => {
    setMounted(true);
  }, []);
  if (!mounted) return null;

  return (
    <div className=" min-h-screen flex-col items-center justify-center py-2">
      <Head>
        <meta name="google-site-verification" content="zNwtizC2UvJlyJIAGT_MJpvvwk1uXh9cZxUAGqSrXgU" />
        <title>Wubba Lubba Dub dub!</title>
        <link rel="icon" href="/favicon.ico" />

      </Head>

      <button
        className="  flex mx-auto  mt-10 "
        onClick={() => setTheme(theme === "light" ? "dark" : "light")}
      >
        <span>
          {theme === "light" ? (
            <BsFillMoonStarsFill size={30} />
          ) : (
            <BsFillSunFill size={30} />
          )}
        </span>
      </button>

      <main className=" mt-10 text-center ">
        <motion.div
          initial="hidden"
          animate="visible"
          variants={{
            hidden: {
              scale: 0.8,
              opacity: 0,
            },
            visible: {
              scale: 1,
              opacity: 1,
              transition: {
                delay: 0.4,
              },
            },
          }}
        >
          
          <h1 className="mt-8 text-4xl font-bold "> Wubba Lubba Dub dub! </h1>
        </motion.div>
        <p className="text-xl font-medium my-4">Rick and Morty Wiki</p>

        <form onSubmit={handleOnSubmitSearch}>
          <motion.input
            whileFocus={{ scale: 1.2 }}
            className="mr-10 text-2xl bg-slate-300 rounded-2xl py-1 px-4 "
            type="search"
            name="query"
          />

          <button className="text-2xl bg-blue-500 hover:bg-blue-700 text-white font-bold py-[.7rem] px-6 rounded-2xl">
            <svg
              aria-hidden="true"
              className="w-5 h-5 text-gray-100 dark:text-white"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                stroke-linecap="round"
                stroke-linejoin="round"
                stroke-width="2"
                d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
              ></path>
            </svg>
          </button>
        </form>

        <ul className="mx-14 mt-10 grid grid-cols-2 gap-4 lg:grid-cols-3 xl:grid-cols-4">
          {results ? (
            results?.map((result) => {
              const { id, name, image } = result;
              return (
                <motion.li
                  key={id}
                  className=" rounded-lg shadow-lg  dark:bg-transparent max-w-sm "
                  whileHover={{
                    position: "relative",
                    zIndex: 1,
                    scale: [1, 1.2, 1.1],
                    rotate: [0, 10, -10, 0],
                    filter: [
                      "hue-rotate(0) contrast(100%)",
                      "hue-rotate(360deg) contrast(200%)",
                      "hue-rotate(45deg) contrast(300%)",
                      "hue-rotate(0) contrast(100%)",
                    ],
                    transition: {
                      duration: 0.2,
                    },
                  }}
                >
                  <Link href={`character/${id}`}>
                    <a className="text-[2rem] font-medium"> {name} </a>
                  </Link>
                  <Link href={`character/${id}`}>
                    <img className="cursor-pointer" src={image} alt={name} />
                  </Link>
                </motion.li>
              );
            })
          ) : (
            <div className="mx-0 max-w-none text-center  mt-10 translate-x-1/2  justify-center  gap-0 lg:translate-x-full xl:translate-x-[150%] ">
              <h2>No results found</h2>
              <p>Try different keywords</p>
            </div>
          )}
        </ul>
        <p>
          <button
            className="mt-8 bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded-full transition ease-in-out delay-150  hover:-translate-y-1 hover:scale-110  duration-300"
            onClick={handleLoadMore}
          >
            Load More
          </button>
        </p>
      </main>
    </div>
  );
};

export default Home;
