import React, { useRef, useState } from "react";
import Head from "next/head";
import Image from "next/image";
import styles from "../styles/Home.module.css";
import logo from "../public/tt.png";
import { VscGithub } from "react-icons/vsc";
import { IoPlanet } from "react-icons/io5";
import { HiRefresh } from "react-icons/hi";
import { TbSearch } from "react-icons/tb";
import { Preloader, Oval } from "react-preloader-icon";
import axios from "axios";
import InfiniteScroll from "react-infinite-scroll-component";
import Card from "../components/card.jsx";
import Select from "react-select";

let pages = 1;
let name = "";

export async function getStaticProps() {
  const res = await fetch(
    "https://rick-and-morty-backend.vercel.app/app/characters/1"
  );
  const character = await res.json();

  return {
    props: {
      character,
    },
  };
}

export default function Home({ character }) {
  const [characters, setCharacters] = useState(character.characters);
  const [autoLoad, setAutoLoad] = useState(false);
  const [loadSearchIconButton, setLoadSearchIconButton] = useState(false);
  const [options, setOptions] = useState([
    {
      label: "Default Order",
      value: "Default Order",
      className: "custom-class",
    },
    { label: "A-Z", value: "A-Z", className: "custom-class" },
    { label: "Z-A", value: "Z-A", className: "awesome-class" },
  ])
  const button = useRef();
  const searchInput = useRef();
  const dropdown = useRef();
  let fetchDataTimeout = 400;

  const handleChange = async (selectedOption) => {
    if (selectedOption.value === "A-Z") {
      console.log("A-Z");
      const order = await characters.sort((a, b) => {
        return a.name < b.name ? -1 : a.nome > b.nome ? 1 : 0;
      });
      setCharacters([...order]);
    } else if (selectedOption.value === "Z-A") {
      console.log("Z-A");
      const order = characters.sort((a, b) => {
        return a.name > b.name ? -1 : a.nome < b.nome ? 1 : 0;
      });
      setCharacters([...order]);
    } else if (selectedOption.value === "Default Order") {
      console.log("Default Order");
      const order = characters.sort((a, b) => {
        return a.id < b.id ? -1 : a.id > b.id ? 1 : 0;
      });
      setCharacters([...order]);
    }
  };

  function autoLoadFunction() {
    if (autoLoad === false) {
      return (
        <section className={styles.section}>
          {characters.map((e) => (
            <Card
              key={e.id}
              name={e.name}
              image={e.image}
              status={e.status}
              specie={e.species}
            />
          ))}
        </section>
      );
    } else {
      return (
        <InfiniteScroll
          dataLength={characters.length}
          next={fetchData}
          hasMore={true}
          loader={null}
          endMessage={null}
        >
          <section className={styles.section}>
            {characters.map((e) => (
              <Card
                key={e.id}
                name={e.name}
                image={e.image}
                status={e.status}
                specie={e.species}
              />
            ))}
          </section>
        </InfiniteScroll>
      );
    }
  }

  const fetchDataByName = () => {
    setLoadSearchIconButton(true);
    setTimeout(async () => {
      const res = await fetch(
        `https://rick-and-morty-backend.vercel.app/app/character/name/${name}`
      ).then((res) => {
        setLoadSearchIconButton(false);
        return res;
      });
      const newCharacters = await res.json();
      setCharacters(() => [...newCharacters.character]);
      button.current.style = "display: none";
    }, 0);
  };

  const fetchData = () => {
    pages++;
    setTimeout(async () => {
      const res = await fetch(
        `https://rick-and-morty-backend.vercel.app/app/characters/${pages}`
      );
      const newCharacters = await res.json();
      setCharacters((character) => [
        ...characters,
        ...newCharacters.characters,
      ]);
    }, fetchDataTimeout);
  };

  return (
    <React.Fragment>
      <header className={styles.header}>
        <nav className={styles.nav}>
          {" "}
          <h1 className={styles.h1_logo}>
            <Image src={logo} width={200} className={styles.h1_logo} alt={"Rick and Morty Wallpaper"} />
          </h1>
          <div className={styles.nav_buttons}>
            <IoPlanet className={styles.planet_icon}></IoPlanet>

            <VscGithub className={styles.github_icon}></VscGithub>
          </div>
        </nav>
        <div className={styles.background}>
          <div className={styles.background_blur}></div>
        </div>
      </header>

      <main className={styles.main}>
        <section className={styles.section_search}>
          <div className={styles.search_container}>
            <button className={styles.button} role="button">
              <HiRefresh fontSize={20}></HiRefresh>
              Surprise Me!
            </button>
            <input
              type="search"
              name="search"
              id=""
              className={styles.search_bar}
              placeholder="Search"
              ref={searchInput}
            />
            <button
              className={styles.button_search}
              role="button"
              onClick={() => {
                name = searchInput.current.value;
                dropdown.current.setValue("Default Order")
                fetchDataByName();
              }}
            >
              {loadSearchIconButton ? (
                <Preloader
                  use={Oval}
                  size={22}
                  strokeWidth={12}
                  strokeColor="#FFF"
                  duration={2000}
                />
              ) : (
                <TbSearch fontSize={26} />
              )}
            </button>
          </div>

          <div className={styles.dropdown_container}>
            <p className={styles.dropdown_p}>Organizar por:</p>
            <Select
              className={styles.dropdown}
              options={options}
              placeholder={"Default Order"}
              ref={dropdown}
              onChange={handleChange}
            />
          </div>
        </section>
        <div className={styles.section_ct_container}>
          {autoLoadFunction()}
          <button
            className={styles.button}
            style={{ width: "200px" }}
            ref={button}
            onClick={() => {
              setAutoLoad(true);
              button.current.style = "display: none";
            }}
          >
            Load more
          </button>
        </div>
      </main>

      <footer className={styles.footer}></footer>
    </React.Fragment>
  );
}
