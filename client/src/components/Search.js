import React, { Component } from "react";
import axios from 'axios';
import {ListItem} from './list/ListItem'
import Switch from './list/Switch'

export default class Home extends Component {

    constructor(props) {
      super(props);

      this.state = {
        items: [],
        filtered:[],
        search:'insert search target',
      };
  }

  fetchItem() {
    axios
      .get("http://localhost:9001/search", { withCredentials: true })
      .then(({data} )=> {
        console.log(data);
      if ( data.status){
            this.setState({items:data.items})
            this.setState({filtered: this.state.items})
        }
      })
      .catch(error => {
        console.log("check login error", error);
      });
  }

  componentDidMount() {
    this.fetchItem();

    console.log(this.state.filtered);
  }


  render() {
    return (
      <div>
        <h1>Φίλτρα σοuν </h1>
          <div>
          <form>
            'edwwwwwww'
          </form>
          </div>

         <h1>Search here </h1>

         <ul style={styles.container}>
             {this.state.filtered.map(item => <ListItem key = {item.id}
                item    = {item}
                liStyle = {styles.item}
                style2  = {styles.body}
             />)}
        </ul>



      </div>
    );
  }

}


/*list styles*/
const styles = {
    formFilter :{
            display: 'inline-block',
            margin: '3% 5%'
    },
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
