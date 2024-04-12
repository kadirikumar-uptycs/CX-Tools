import React, { useCallback, useRef } from "react";
import ScrollTrigger from 'react-scroll-trigger';


export default function Card({ index, name, description, imageURL, URL }) {
    let cardRef = useRef(null);

    const sleep = time => new Promise(res => setTimeout(res, time));

    let setanimation = useCallback(async (index) => {
        await sleep(index * 1500 + 100);
        cardRef.current.classList.add('visible');
    }, [cardRef?.current?.classList]);

    return (

        <div className={`card card-${index}`} ref={cardRef}>
            <div className="card-left">
                <img src={imageURL} alt="Migrating Flag Profiles" className="card--image" />
            </div>
            <div className="card-right">
                <span className="card--name">{name}</span>
                <p className="lead card--description">{description}</p>
                <a href={URL}>
                    <ScrollTrigger onEnter={setanimation}>
                        <button className="card--button">Try this</button>
                    </ScrollTrigger>
                </a>
            </div>
        </div>
    )
}