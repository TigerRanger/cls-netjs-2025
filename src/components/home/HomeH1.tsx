// components/HomeH1.tsx
import React from 'react';

interface HomeH1Props{
  Title:string;
  Para: string;
}

const HomeH1 : React.FC<HomeH1Props> = ({ Title , Para }) => {
  return (
    <>
        <section className='dark-block headline'>
            <div className='container-fluid'>
            {Title && (
                <h1 dangerouslySetInnerHTML={{ __html: Title }} />
            )}
            {Para && (
                <p dangerouslySetInnerHTML={{ __html: Para }} />
            )}
            </div>
        </section> 
    </>
  );
};

export default HomeH1;
