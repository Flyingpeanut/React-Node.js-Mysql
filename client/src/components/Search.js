import React, { Component } from "react";
import axios from 'axios';
import ListItem from './list/ListItem'
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

        minPrice: '',           // min price for items, client side
        maxPrice: '',           // max price for items, client side
        locationSearch:'',      // location search field, client side
        descSearch:'',          // description search field , client side
        searchItems:'',         // search field passed on server to fetch data
        selectChosenCategory: undefined,
        selectShownCategories: [],  // distinct categories on fetched

      };
      this.updateLocSearch   = this.updateLocSearch.bind(this)
      this.updateSearch = this.updateSearch.bind(this)
      this.checkMinNumber = this.checkMinNumber.bind(this)
      this.checkMaxNumber = this.checkMaxNumber.bind(this)
      this.filterItems  = this.filterItems.bind(this)
      this.updateItemSearchField  = this.updateItemSearchField.bind(this)
      this.fireFetchItems  = this.fireFetchItems.bind(this)


  }

  filterItems(){

      const {filters, items} = this.state
      if (items === []) {
          return []
      }
      let tempFiltered = items;
      //eslint-disable-next-line
      for (let [filterKey, filterValue] of Object.entries(filters)) {
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
           return undefined;
      })
      let selectOptions = []
      distinctCats.forEach((cat) =>{
          selectOptions.push({value:cat, label: cat})
      })
      return selectOptions
  }

  fetchItem(searchField) {
      console.log(searchField);
    axios
      .get("http://localhost:9001/search",
      { params:{
         searchField}
     },{ withCredentials: true }
     )
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
      this.setState(prevState =>({
          descSearch : target.value,
         filters:{
             ...prevState.filters,
             description: target.value
         }
     }))

  }

  fireFetchItems(){
        return this.fetchItem(this.state.searchItems)
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

    updateItemSearchField({target}){
        this.setState({ searchItems:target.value})
    }
 /* componentDidMount() {
    this.fetchItem();

}*/


  render() {
    return (

        <div>

            <div style = {styles.bigSearch}>

                <label>
                Αναζητήστε αυτό που επιθυμείτε
                    <input
                    style={styles.input}
                     type='text'
                     onChange={this.updateItemSearchField}
                     value = {this.state.searchItems}
                     />
               </label>
                <button style={styles.button} onClick={this.fireFetchItems}>Αναζήτηση</button>
            </div>
            <div style = {styles.results}>
                { this.state.items !== [] && <div style={styles.filters}>
                    <h1>Φίλτρα</h1>
                      <div  >
                          <label>Επιλέξτε Κατηγορία<Select
                             styles = {selectStyle}
                              value={this.state.selectChosenCategory}
                              onChange={this.selectChange}
                              options={this.state.selectShownCategories}
                            />
                            </label>
                      </div>
                      <div style={styles.input} >
                        Οριοθέτηση τιμής
                         <label><input type='number' placeholder="Από €" value={this.state.minPrice} onChange={this.checkMinNumber}/></label>
                         <label><input type='number'  placeholder="Εώς €" value={this.state.maxPrice} onChange={this.checkMaxNumber}/></label>
                         <button style={styles.button} onClick={this.filterItems}>>></button>
                      </div>

                      <div>
                          <label style={styles.input}>
                          Αναζήτηση περιγραφής
                              <input

                               type='text'
                               onChange={this.updateSearch}
                               value = {this.state.descSearch}
                               />
                         </label>
                          <button style={styles.button} onClick={this.filterItems}>>></button>
                      </div>

                      <div>
                          <label style={styles.input}>
                          Αναζήτηση τοποθεσίας
                              <input

                               type='text'
                               onChange={this.updateLocSearch}
                               value = {this.state.locationSearch}
                               />
                         </label>
                          <button style={styles.button} onClick={this.filterItems}>>></button>
                      </div>
                </div>}
              <div style={styles.items}>
                 <ul style={styles.container}>
                     {this.state.filtered.map(item => <ListItem key = {item.id}
                        {...this.props}
                        item    = {item}
                        liStyle = {styles.item}
                        style2  = {styles.body}
                     />)}
                </ul>
            </div>
         </div>

      </div>
    );
  }

}
const selectStyle = {
    container:(provided) => ({
        ...provided,
        border: '1px solid black',
        width: '100%',

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
    button:{
        padding: 8,
        borderRadius: 12,
        margin: 5,
    },
    bigSearch:{
        fontSize:'1.3em',
        margin:'5% 25%',
        width:'65%',
        padding: 8,
    },
    results:{
        display:'flex'
    },
    filters:{
        margin:'',
        flex: '0 0 10%',

    },
    items:{
        width: '100%',
        margin:'2% 10%',
        flex: 1,
    },
    input:{
        width:'100%',
        padding:'1%',
        margin:'1%',
    },
    formFilter :{
            display: 'inline-block',
            margin: '3% 5%'
    },
  container: {
       listStyle:'none',
       width: '100%',
  },
  sectionHeader: {
      padding:  0,
      fontWeight: 'bold',
      backgroundColor: 'rgba(247,247,247,1.0)',
  },
  item: {
       margin: '3% 12%',
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
