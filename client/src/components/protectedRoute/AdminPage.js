import React from 'react';
import axios from 'axios';
import {List} from '../list/List'
import {ListItemUser} from '../list/ListItemUser'
import Switch from '../list/Switch'

export default class AdminPage extends React.Component {
    constructor(props) {
      super(props);

      this.state = {
        users: [],
        filtered:[],
        fieldChoices:['user_id', 'username', 'mail'],
        search:'alo',
        selectedOption:'',
        approval: false,
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
              this.setState({filtered: this.state.users})
          }
        })
        .catch(error => {
          console.log("check login error", error);
        });
    }

    handleOptionChange = changeEvent =>{
        this.setState({
            selectedOption: changeEvent.target.value
        })
    }
    showApprovedOnly(event){

        let filtered = this.state.users.filter((user) =>{
            // epestrepse to an to vreis
            return (user['aproved'] === this.state.approval ?  user :  null );
        })
        this.setState({
            filtered
        })
        event.preventDefault()
    }
    filterData (event){
        if(this.state.fieldChoices.includes(this.state.selectedOption)){
            let filtered = this.state.users.filter((user) =>{
                // epestrepse to an to vreis
                return user[this.state.selectedOption].includes(this.state.search)
            })
            this.setState({
                filtered
            })
        }
        else{
            console.log('not valid choice');
        }
        event.preventDefault()
    }

    updateSearch({target}){
        this.setState({ search:target.value})
    }

    componentDidMount() {
      this.fetchUserData();

      console.log(this.state.filtered);
    }



    render() {

      return (

          <React.Fragment >

          <form className = "check-container">
              <h1>Filter by:</h1>
              <div className="form-check">
                <label>
                  <input
                    type="radio"
                    name="user_id"
                    value="user_id"
                    checked={this.state.selectedOption === "user_id"}
                    onChange={this.handleOptionChange}
                    className="form-check-input"
                  />
                  User Id
                </label>
              </div>

              <div className="form-check">
                <label>
                  <input
                    type="radio"
                    name="username"
                    value="username"
                    checked={this.state.selectedOption === "username"}
                    onChange={this.handleOptionChange}
                    className="form-check-input"
                  />
                  Username
                </label>
              </div>

              <div className="form-check">
                <label>
                  <input
                    type="radio"
                    name="mail"
                    value="mail"
                    checked={this.state.selectedOption === "mail"}
                    onChange={this.handleOptionChange}
                    className="form-check-input"
                  />
                 E-mail
                </label>
              </div>
              <div className="form-group">
              <label>
                  <input type='text'
                   name = 'search'
                   onChange={this.updateSearch.bind(this)}
                   value = {this.state.search}
                   />

             </label>
              </div>
              <div className="form-group">
                <button className="btn btn-primary mt-2" type="submit" onClick={this.filterData.bind(this)}>
                  filter
                </button>
              </div>

            </form>
            <form>
            <h1>Show only approved users</h1>
            <Switch
                isOn={this.state.approval}
                onColor="#EF476F"
                handleToggle={() => {
                    console.log(this.state.approval);
                    this.setState({approval: !this.state.approval})
                }}
            />
            <button className="btn btn-primary mt-2" type="submit" onClick={this.showApprovedOnly.bind(this)}>
              Show only {}
            </button>
            </form>
          <div>


             </div>
             <ol style={styles.container}>
                 {this.state.filtered.map(user => <ListItemUser
                    user    = {user}
                    liStyle = {styles.item}
                    style2  = {styles.body}
                 />)}
            </ol>

         </React.Fragment >
      );
    }

}
/*list styles*/
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
       margin: '3% 20%',
       fontSize: '0.9em',
       size:'0.7em',
       padding: 8,
       backgroundColor: 'grey',

       border: '1px solid black',

  },
  body:{
         padding:  12,
         fontSize: '0.9em',

  }
}


//export default AdminPage;
