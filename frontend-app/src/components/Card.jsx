import React, {useState} from "react";
import ScrollTrigger from 'react-scroll-trigger';


export default function Card({ index, name, description, imageURL }) {
    const [isVisible, setIsVisible] = useState(false);

    return (
        <ScrollTrigger onEnter={() => setIsVisible(true)} onExit={() => setIsVisible(false)}>
                <div className={`card card-${index} ${isVisible ? 'visible' : ''}`}>
                    <div className="card-left">
                        <img src={imageURL} alt="Migrating Flag Profiles" className="card--image" />
                    </div>
                    <div className="card-right">
                        <span className="card--name">{name}</span>
                        <p className="lead card--description">{description}</p>
                        <a href="migrateResources">
                            <button className="card--button">Try this</button>
                        </a>
                    </div>
                </div>
        </ScrollTrigger>
    )
}