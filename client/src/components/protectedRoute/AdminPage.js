import React from 'react';
import axios from 'axios';

export default class AdminPage extends React.Component {
    constructor(props) {
      super(props);

      this.state = {
        users: []
      };

    //  this.handleLogin = this.handleLogin.bind(this);
    }
    fetchUserData() {
      axios
        .get("http://localhost:9001/protected/admin", { withCredentials: true })
        .then(({data} )=> {
			console.log(data);
		  if ( data.status){
              this.setState({users:data.users})
          }
        })
        .catch(error => {
          console.log("check login error", error);
        });
    }

    createUserList(){
        return
    }

    componentDidMount() {
      this.fetchUserData();
    }
    render() {
      return (
          <React.Fragment >
          <ol style={styles.container}>
                {
                    this.state.users.map(user => {
                        return (<li style={styles.item} key={user.user_id}>
                                        <div style={styles.sectionHeader}>
                                            <h3>Id   : {user.user_id} </h3>
                                            <h3>Όνομα χρήστη    : {user.username}</h3>
                                            <h3>Ηλεκτρονική Διεύθυνση    : {user.mail}</h3>
                                        </div>
                                        <div style={styles.body}>
                                            <h3>Ονοματεπώνυμο   : {user.name} - {user.last_name}</h3>
                                            <h3>Διεύθυνση   : {user.address}</h3>
                                            <h3>Χώρα    : {user.country}</h3>
                                            <h3>ΑΦΜ : {user.AFM}</h3>
                                            <h3>Βαθμολογία πωλήτη   : {user.seller_rating}</h3>
                                            <h3>Βαθμολογία πλειοδότη: {user.bider_rating}</h3>
                                            <h3>Εγκεκριμένος    : {user.aproved ? 'ΝΑΙ' : 'ΟΧΙ'}</h3>
                                        </div>
                        </li>)
                    })
                }
          </ol>

         </React.Fragment >
      );
    }

}
/*
*/

const styles = {
  container: {
       listStyle:'none',
       flex: 1,

  },
  sectionHeader: {
      padding:  0,

    fontWeight: 'bold',
    backgroundColor: 'rgba(247,247,247,1.0)',
  },
  item: {
       margin: '3% 15%',
       fontSize: '0.7em',
       padding: 8,
       border: '1px solid black',
       
  },
  body:{
      backgroundColor: 'grey',
         padding:  12,

  }
}


//export default AdminPage;
