
import './styles.css';
import axios from 'axios';
import debounce from 'lodash.debounce';
import PNotify from 'pnotify/dist/es/PNotify.js';
import 'pnotify/dist/PNotifyBrightTheme.css';
import allCountries from './patterns/pattern.hbs';
import oneCountry from './patterns/patternOfOneCountry.hbs';

axios.defaults.baseURL = 'https://restcountries.eu/rest/v2';


const refs = {
  search: document.querySelector('#countrySearch'),
  countriesList: document.querySelector('.countriesList'),
  countryInformation: document.querySelector('.informationOfOneCountry'),
};

function getCountries(name) {
  return axios.get(`/name/${name}`);
}

function getInformationOfThisCountry(event) {
  if (!event.target.value) {
    refs.countriesList.innerHTML = '';
    refs.countryInformation.innerHTML = '';
  }
  if (event.target.value) {
    getCountries(event.target.value)
      .then(({ data }) => {
        refs.countriesList.innerHTML = '';
        refs.countryInformation.innerHTML = '';

        if (data.length >= 10) {
          PNotify.error({
            text: 'We have found too many matches. Please enter more specific query!',
          });
        }
        if (data.length === 1) {
          refs.countryInformation.insertAdjacentHTML('beforeend', oneCountry(data[0]));
        } else {
          data.forEach(item => {
            refs.countryInformation.innerHTML = '';

            if (!item) {
              refs.countryInformation.innerHTML = '';
              refs.countriesList.innerHTML = '';
            }
            if (
              item.name.toLowerCase().includes(event.target.value.toLowerCase())
            ) {
              refs.countriesList.innerHTML = '';
              if (data.length < 10 && data.length >= 2) {
                data.forEach(item => {
                  refs.countriesList.insertAdjacentHTML(
                    'beforeend',
                    allCountries(item),
                  );
                });
                PNotify.closeAll();
              }
            }
          });
        }
      })
      .catch(data => {
        PNotify.alert({
          text: 'You have entered invalid value',
        });
        refs.countryInformation.innerHTML = '';
        refs.countriesList.innerHTML = '';
      });
  }
}

refs.search.addEventListener('input', debounce(getInformationOfThisCountry, 500));








