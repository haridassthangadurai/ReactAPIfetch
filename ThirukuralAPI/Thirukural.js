import React, { useEffect, useState } from "react";
import 'bootstrap/dist/css/bootstrap.css'
import './thirukral.css'
export function Thirukural() {
    const [view, setview] = useState([])
    const [isShown, setIsShown] = useState(false);
    const handleClick = event => {
        setIsShown(current => !current);
    }
    useEffect(() => {
        fetch('http://localhost:3000/thirukual.json')
            .then(res => res.json())
            .then(data => setview(data))
    })

    return (
        <>
            <h1 className="thurukraltitle">திருக்குறள்</h1>
            <div className="container">
                <div className="row">

                    {view.map((value, index) => (

                        <div className="card col-lg-12 my-5 text-center p-4">
                            <div className="card-body">
                                <h1 className="card-title">(குறள்:{value.Number})</h1>

                                <h5 className="card-title text-center">
                                    {value.Line1}<br />
                                    {value.Line2}
                                </h5>
                                <h5>
                                    {value.Translation}
                                </h5>
                                {isShown && (
                                    <div className="cardmore ">
                                        <h5>{value.mv}</h5>
                                        <h5>{value.sp}</h5>
                                        <h5>{value.mk}</h5>
                                    </div>)}
                                <button onClick={handleClick}>{isShown ? "Less ": "More" }</button>
                            </div>
                        </div>

                    ))}

                </div>
            </div>

        </>


    )
}