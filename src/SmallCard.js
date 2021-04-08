import React from "react";
import "./SmallCard.css";

function SmallCard({ insight, setInsight, mine }) {
    const formatDate = () => {
        const dateStr = insight.date.toDate().toDateString();
        const dateSplit = dateStr.split(" ");
        return dateSplit[1] + " " + dateSplit[2] + ", " + dateSplit[3];
    };

    return (
        <a
            href="/#popup"
            className="popup_link"
            onClick={() => setInsight({ ...insight })}
        >
            <figure className="review" style={{ backgroundColor: mine && "#ce2c8a"}}>
                <blockquote className="review__text">{insight.text}</blockquote>
                <figcaption className="review__user">
                    <img
                        src={insight.photo}
                        alt="User"
                        className="review__photo"
                    />
                    <div className="review__user-box">
                        <p className="review__user-name">{insight.name}</p>
                        <p className="review__user-date">{formatDate()}</p>
                    </div>
                    <div className="review__rating">{insight.rating}</div>
                </figcaption>
            </figure>
        </a>
    );
}

export default SmallCard;
