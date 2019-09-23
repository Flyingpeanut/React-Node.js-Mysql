import React, { useState }  from 'react';
import Toggle from '../list/Toggle';
import axios from 'axios';

export const  ListItem = ({ item,liStyle,style2 }) => {

    const [id, setId] = useState(item.id);
    const [name, setName] = useState(item.name);
    const [bids, setBids] = useState(item.num_of_bids);
    const [desc, setDesc] = useState(item.description);
    const [location, setLocation] = useState(item.location);
    const [country, setCountry] = useState(item.country);
    const [first_bid, setFirst_bid] = useState(item.first_bid);
    const [buy_price, setbuy_price] = useState(item.buy_price);
    const [curently, setcurently] = useState(item.curently);
    const [userId, setUsedId] = useState(item.userId);


    return(

        <li style={liStyle}>
                        <div style={style2}>
                            <h3>Id   : {id} </h3>
                            <h3>Τίτλος   : {name}</h3>
                            <h3>Τιμή   : {curently}</h3>
                            <h3>Τιμή αγοράς: {buy_price}</h3>

                        </div>
                        <Toggle>
                         {({on, toggle}) => (
                            <div>
                                { on && (<div style={style2}>
                                    <h3>Περιγραφή   : {desc}</h3>
                                    <h3>Διεύθυνση   : {location}</h3>
                                    <h3>Χώρα    : {country}</h3>
                                </div>)}
                                <button onClick={toggle}>
                                {on ? 'Show less' : 'Show more'}
                                </button>
                            </div>
                        )}
                        </Toggle>

        </li>
  )
}
