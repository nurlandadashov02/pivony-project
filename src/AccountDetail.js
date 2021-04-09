import React, { useEffect, useRef, useState } from "react";
import { connect } from "react-redux";
import { useHistory } from "react-router";
import "./AccountDetail.css";
import { db, getTimeStamp } from "./firebase";
import PhotoUploadWidget from "./PhotoUploadWidget";
import { setLoading, setTab } from "./redux/App/app.actions";
import { setUserInsight } from "./redux/Insight/insight.actions";

function AccountDetail({ user, userInsight, SetUserInsight, SetLoading, SetTab }) {
    const history = useHistory();
    
    const [files, setFiles] = useState([]);

    const fullName = useRef();
    const insight = useRef();
    const rating = useRef();

    useEffect(() => {
        SetTab("account-details");
        if (!user) {
            history.push("/register");
        }
    }, [user]);

    const handleSubmitProfile = async (e) => {
        e.preventDefault();
        SetLoading(true);
        const newDisplayName = fullName.current.value;

        if(user.displayName !== newDisplayName) {
            await user.updateProfile({displayName: newDisplayName});
            const doc = await db.collection("insights").doc(user?.uid).get();

            if(doc.exists) {
                await db.collection("insights").doc(user?.uid).update({ name: newDisplayName});
            }            
            SetLoading(false);
        }
    }

    const handleSubmitInsight = async (e) => {
        e.preventDefault();
        SetLoading(true);
        if(insight.current.value !== "") {
            const ins = {
                text: insight.current.value,
                rating: rating.current.value,
                date:  getTimeStamp(),
                photo: user.photoURL,
                name: user.displayName,
                likes: [],
                dislikes: []
            };
            await db.collection("insights").doc(user?.uid).set(ins);
            SetUserInsight({...ins, id: user?.uid});
            SetLoading(false);
        }
    }

    const setTwoNumberDecimal = (event) => {
        event.target.value = parseFloat(event.target.value).toFixed(1);
    }

    return (
        <>
            <h1 className="header-primary">Welcome {user?.displayName}!</h1>
            <form className="my-form" onSubmit={e => handleSubmitProfile(e)}>
                <ul>
                    <li>
                        <input type="text" placeholder="Full name" required ref={fullName} defaultValue={user?.displayName} maxLength="40"/>
                    </li>
                    <li>
                        <PhotoUploadWidget files={files} setFiles={setFiles} />
                    </li>
                    <li>
                        <button className="btn btn--pink">Save</button>
                    </li>
                </ul>
            </form>
            {
                !userInsight && <>
                                    <h2 className="heading-secondary">Create your insight</h2>
                                    <form className="my-form" onSubmit={e => handleSubmitInsight(e)}>
                                        <ul>
                                            <li>
                                                <h4 style={{marginBottom: "1.5rem"}}>Rating</h4>
                                                <input type="number" onChange={e=> setTwoNumberDecimal(e)} min="0" max="5" step="0.1" defaultValue="5.0" ref={rating} />
                                            </li>
                                            <li>
                                                <textarea placeholder="Your Insight" ref={insight} required minLength="5"></textarea>
                                            </li>
                                            <li>
                                                <button className="btn btn--pink">Share your insight</button>
                                            </li>
                                        </ul>
                                    </form>
                                </>
            }
        </>
    );
}

const mapStateToProps = (state) => {
    return {
        user: state.userReducer.user,
        userInsight: state.insightReducer.userInsight
    };
};
const mapDispatchToProps = (dispatch) => {
    return {
        SetLoading: (l) => dispatch(setLoading(l)),
        SetTab: (tab) => dispatch(setTab(tab)),
        SetUserInsight: (ins) => dispatch((setUserInsight(ins)))
    };
};

export default connect(mapStateToProps, mapDispatchToProps)(AccountDetail);
