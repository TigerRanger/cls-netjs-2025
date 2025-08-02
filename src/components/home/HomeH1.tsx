// components/HomeH1.tsx
import React from 'react';

import style from "@/sass/homeh1.module.scss";


interface HomeH1Props{
  Title:string;
  Para: string;
}

const HomeH1 : React.FC<HomeH1Props> = ({ Title , Para }) => {
  return (
    <section className={style["top-block"] + " " + style.headline}>
      <div className="container">
        <h1 className={style["top-block"] + " " + style.headline + style.h1}>
           {Title}
        </h1>
        <p className={style["top-block"] + " " + style.headline + style.p}>
          {Para}
        </p>
      </div>
    </section>
  );
};

export default HomeH1;
