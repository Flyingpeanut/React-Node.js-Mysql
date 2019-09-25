import React, { Component } from "react";
import axios from 'axios';
import {ListItem} from './list/ListItem'
import Switch from './list/Switch'
import Select from 'react-select';

export default class Home extends Component {

    constructor(props) {
      super(props);

      this.state = {
        items: [],
        filtered:[],
        filters:{
            categories:     undefined,
            seller_rating:  undefined,
            location:       undefined,
            description:    undefined,
        },

        minPrice: '',
        maxPrice: '',
        locationSearch:'',
        descSearch:'',
        selectChosenCategory: undefined,
        selectShownCategories: [],
      };
      this.updateLocSearch   = this.updateLocSearch.bind(this)
      this.updateSearch = this.updateSearch.bind(this)
      this.checkMinNumber = this.checkMinNumber.bind(this)
      this.checkMaxNumber = this.checkMaxNumber.bind(this)
      this.filterItems  = this.filterItems.bind(this)

  }

  filterItems(){

      const {filters, items, filtered} = this.state
      if (items === []) {
          return []
      }
      console.log(filters);
      let tempFiltered = items;
      for (const [filterKey, filterValue] of Object.entries(filters)) {
          console.log(filterKey);
        if(filterValue === undefined)   continue;
        tempFiltered = tempFiltered.filter( (item)=>{

            return item[filterKey].includes(filterValue)
        })

    }
    tempFiltered = this.filterPrice(tempFiltered)
    this.setState({filtered: tempFiltered})
  }

  filterPrice(tempFiltered){

      const {minPrice,maxPrice} = this.state
      if (minPrice !== '') {
          tempFiltered = tempFiltered.filter(item =>{
              return item.curently > minPrice
          })
      }
      if (maxPrice !== '') {
          tempFiltered = tempFiltered.filter(item =>{
              return item.curently < maxPrice
          })
      }

      return tempFiltered

}

  getCategories(data){
      let distinctCats = []
      data.map(({categories}) =>{
          categories.forEach((value) => {
              if (!distinctCats.includes(value)) {
                  distinctCats.push(value)
              }
          })
      })
      let selectOptions = []
      distinctCats.forEach((cat) =>{
          selectOptions.push({value:cat, label: cat})
      })
      return selectOptions
  }

  fetchItem() {
    axios
      .get("http://localhost:9001/search", { withCredentials: true })
      .then(({data} )=> {
        console.log(data);
      if ( data.status){
            this.setState({items:data.items})
            this.setState({selectShownCategories:this.getCategories(data.items)})
            this.setState({filtered: this.state.items})
        }
        if (!data.status || data.items === []) {
            alert('nothing to show try again');
        }
      })
      .catch(error => {
        console.log("bad search field ", error);
      });
  }

  selectChange = changedOption =>{

      this.setState((prevState =>({
          selectChosenCategory:changedOption,
         filters:{
             ...prevState.filters,
             categories:changedOption.value
         }
     })),this.filterItems)

  }


  updateLocSearch ( {target}){
      this.setState(prevState =>({
          locationSearch : target.value,
         filters:{
             ...prevState.filters,
             location: target.value
         }
     }))

  }

  updateSearch ( {target}){
      console.log(target.value);
      this.setState(prevState =>({
          descSearch : target.value,
         filters:{
             ...prevState.filters,
             description: target.value
         }
     }))

  }
  checkMaxNumber ( event){
      const onlyNumberRegex = /^[0-9\b]+$/

        if (event.target.value === '' || onlyNumberRegex.test(event.target.value) ) {
           this.setState({maxPrice: event.target.value})
        }

  }

  checkMinNumber (event) {
      const onlyNumberRegex = /^[0-9\b]+$/
      if (event.target.value === '' || onlyNumberRegex.test(event.target.value)) {
         this.setState({minPrice: event.target.value})
      }

  }

  componentDidMount() {
    this.fetchItem();

  }


  render() {
    return (
              <div>


        <h1>Φίλτρα σοuν </h1>

        <div>

        </div>

          <div>
          <label>Επιλέξτε Κατηγορία<Select
             styles = {selectStyle}
              value={this.state.selectChosenCategory}
              onChange={this.selectChange}
              options={this.state.selectShownCategories}
            />
            </label>
          </div>
          <div>
             <label>Από<input type='number' style={styles.input} value={this.state.minPrice} onChange={this.checkMinNumber}/></label>
             <label>Εώς<input type='number' style={styles.input} value={this.state.maxPrice} onChange={this.checkMaxNumber}/></label>
             <button onClick={this.filterItems}>></button>
          </div>

          <div>
              <label>
              Αναζήτηση περιγραφής
                  <input
                  style={styles.input}
                   type='text'
                   onChange={this.updateSearch}
                   value = {this.state.descSearch}
                   />
             </label>
              <button onClick={this.filterItems}>></button>
          </div>

          <div>
              <label>
              Αναζήτηση Τοποθεσίας
                  <input
                  style={styles.input}
                   type='text'
                   onChange={this.updateLocSearch}
                   value = {this.state.locationSearch}
                   />
             </label>
              <button onClick={this.filterItems}>></button>
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
const selectStyle = {
    container:(provided) => ({
        ...provided,
        border: '1px solid black',
        width: 400,

    }),
  option: (provided, state) => ({
    ...provided,
    borderBottom: '1px dotted pink',
    color: state.isSelected ? 'red' : 'blue',
    padding: 20,
  }),
  control: () => ({
    // none of react-select's styles are passed to <Control />
    width: '15%',

  }),
  singleValue: (provided, state) => {
    const opacity = state.isDisabled ? 0.5 : 1;
    const transition = 'opacity 300ms';

    return { ...provided, opacity, transition };
  }
}

/*list styles*/
const styles = {
    input:{
        width:100,
        padding:'1%',
        margin:'1%',
    },
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
