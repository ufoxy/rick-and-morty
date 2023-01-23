import React, { useRef, useState } from "react";
import Head from "next/head";
import Image from "next/image";
import styles from "../styles/Home.module.css";
import logo from "../public/tt.png";
import { VscGithub } from "react-icons/vsc";
import { IoPlanet } from "react-icons/io5";
import { HiRefresh } from "react-icons/hi";
import { TbSearch } from "react-icons/tb";
import { Preloader, Oval } from 'react-preloader-icon';
import axios from "axios";
import InfiniteScroll from "react-infinite-scroll-component";
import Card from "../components/card.jsx";
import Dropdown from "react-dropdown";
import "react-dropdown/style.css";

const options = ["Ordem de Aparição", "A-Z", "Z-A"];
const defaultOption = options[0];
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
  const [autoLoad, setAutoLoad] = useState(false)
  const [loadSearchIconButton, setLoadSearchIconButton] = useState(false)
  const button = useRef()
  const searchInput = useRef()
  let fetchDataTimeout = 400

  function autoLoadFunction() {
    if(autoLoad === false) {
      return <section className={styles.section}>
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
    } else {
      return <InfiniteScroll
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
    }
  }

  const fetchDataByName = () => {
    setTimeout(async () => {
      const res = await fetch(
        `https://rick-and-morty-backend.vercel.app/app/character/name/${name}`
      ).then(e => {
        setLoadSearchIconButton(false)
        return e.data
      })
      const newCharacters = await res.json();
      setCharacters(() => [...newCharacters.character]);
      button.current.style = "display: none"
    }, 0);
  };

  const fetchData = () => {
    pages++
    setTimeout(async () => {
      const res = await fetch(
        `https://rick-and-morty-backend.vercel.app/app/characters/${pages}`
      );
      const newCharacters = await res.json();
      setCharacters((character) => [...characters, ...newCharacters.characters]);
    }, fetchDataTimeout);
  };

  return (
    <React.Fragment>
      <header className={styles.header}>
        <nav className={styles.nav}>
          {" "}
          <h1 className={styles.h1_logo}>
            <Image src={logo} width={200} className={styles.h1_logo} />
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
            <button className={styles.button_search} role="button" onClick={() => {
              name = searchInput.current.value
              setLoadSearchIconButton(true)
              fetchDataByName()
            }}>
                <Preloader>
    use={Oval}
    size={30}
    strokeWidth={15}
    strokeColor="#262626"
    duration={2000}
  />
            </button>
          </div>

          <div className={styles.dropdown_container}>
            <p className={styles.dropdown_p}>Organizar por:</p>
            <Dropdown
              options={options}
              value={defaultOption}
              placeholder="Select an option"
              className={styles.dropdown}
            />
          </div>
        </section>
        <div className={styles.section_ct_container}>
          {autoLoadFunction()}
          <button className={styles.button} style={{ width: "200px" }} ref={button} onClick={() => {
            setAutoLoad(true)
            button.current.style = "display: none"
            }}>
            Load more
          </button>
        </div>
      </main>

      <footer className={styles.footer}></footer>
    </React.Fragment>
  );
}
