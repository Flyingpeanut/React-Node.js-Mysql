import React, { useState }  from 'react';
import Toggle from '../list/Toggle';
import axios from 'axios';

export const  ListItemUser = ({ user,liStyle,style2 }) => {

    const [id, setId] = useState(user.id);
    const [name, setName] = useState(user.name);
    const [username, setUsername] = useState(user.username);
    const [mail, setMail] = useState(user.mail);
    const [lastName, setlastName] = useState(user.last_name);
    const [address, setAddress] = useState(user.address);
    const [aproved, setAproved] = useState(user.aproved);
    const [country, setCountry] = useState(user.country);
    const [AFM, setAFM] = useState(user.AFM);
    const [seller, setSeller] = useState(user.seller_rating);
    const [bidder, setBidder] = useState(user.bider_rating);

    function userApprove(user){
        axios
          .post("http://localhost:9001/protected/admin", {userdata:user},{ withCredentials: true })
          .then(({data} )=> {
              console.log(data);
            if ( data.status){
                setAproved(true)
            }
            else{
                console.log(data.status);
            }
          })
          .catch(error => {
            console.log("check approval error", error);
          });
    }

    return(

        <li style={liStyle}>
                        <div style={style2}>
                            <h3>Id   : {id} </h3>
                            <h3>Όνομα χρήστη    : {username}</h3>
                            <h3>Ηλεκτρονική Διεύθυνση    : {mail}</h3>
                            <h3>Εγκεκριμένος    : {aproved ? 'ΝΑΙ  ' : 'ΟΧΙ  '} {!aproved && <button onClick={() => {userApprove(user)}}>Approve this user?</button>}</h3>

                        </div>
                        <Toggle>
                         {({on, toggle}) => (
                            <div>
                                { on && (<div style={style2}>
                                    <h3>Ονοματεπώνυμο   : {name} - {lastName}</h3>
                                    <h3>Διεύθυνση   : {address}</h3>
                                    <h3>Χώρα    : {country}</h3>
                                    <h3>ΑΦΜ : {AFM}</h3>
                                    <h3>Βαθμολογία πωλήτη   : {seller}</h3>
                                    <h3>Βαθμολογία πλειοδότη: {bidder}</h3>
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
