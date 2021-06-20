<template>
    <div class="ui grid">
        <div class="six wide column">
            <form class="ui segment large form">
                <div class="ui segment">
                    <div class="field">
                    <div class="ui right icon input large">
                        <input type="text" placeholder="Enter your address" v-model="coordinates" id="autocomplete"/>
                        <i class="dot circle link icon" @click="locatorButtonPressed"></i>
                    </div>
                    </div>
                    <div class="field">
                    <div class="two fields">
                        <div class="field">
                            <select v-model="type">
                                <option value="restaurant">Restaurant</option>
                            </select>
                        </div>

                        <div class="field">
                            <select v-model="radius">
                                <option value="5">5 KM</option>
                                <option value="10">10 KM</option>
                                <option value="15">15 KM</option>
                                <option value="20">20 KM</option>
                            </select>
                        </div>
                        
                    </div>
                    </div>
                    <button class="ui button" @click="findClosebyButtonPressed">Find Closeby</button>
                </div>
            </form>

            <div class="ui segment" style="max-height:500px;overflow:scroll">
                <div class="ui divided items">
                    <div class="item" v-for="place in places" :key="place.id">
                        <div class="content">
                            <div class="header">{{place.name}}</div>
                            <div class="meta">{{place.vicinity}}</div>
                        </div>
                    </div>
                </div>
            </div>

        </div>

        <div class="ten wide column segment ui" ref="map"></div>
    </div>
</template>

<script>

import axios from "axios";


export default {
    data() {
        return {
            lat: 0,
            lng: 0,
            type: "",
            radius: "",
            places: []
        };
    },
    computed: {
        coordinates() {
        return `${this.lat}, ${this.lng}`;
        }
    },
    mounted(){
        new google.maps.places.Autocomplete(
            document.getElementById("autocomplete"),
            {
                bounds: new google.maps.LatLngBounds(
                    new google.maps.LatLng(3.140853, 101.693207)
                )
            }
        )
    },
    methods:{
    locatorButtonPressed(){
        navigator.geolocation.getCurrentPosition(
            position => {
                this.lat = position.coords.latitude;
                this.lng = position.coords.longitude;
            },
            error => {
                console.log("Error getting location!");
                }
            );
        },
    getUserAddressBy(lat,long){
        var xhttp = new XMLHttpRequest();
        xhttp.onreadystatechange = function(){
            if(this.readyState==4 && this.status == 200){
                var address = JSON.parse(this.responseText)
                console.log(address.results[0].formatted_address)
            }
        };
        xhttp.open("GET", "https://maps.googleapis.com/maps/api/geocode/json?latlng="+lat+","+long+"&key=AIzaSyBK4asXW8f3zYQ-cnC8dKEvyuWZybjI-50", true);
        xhttp.send();
    },
    findClosebyButtonPressed(){
        const URL = `https://cors-anywhere.herokuapp.com/https://maps.googleapis.com/maps/api/place/nearbysearch/json?location=${this.lat},${this.lng}&type=${this.type}&radius=${this.radius*1000}&key=AIzaSyBK4asXW8f3zYQ-cnC8dKEvyuWZybjI-50`;
        
        axios
        .get(URL)
        .then(response =>{
            this.places = response.data.results;
            this.addLocationsToGoogleMaps();
        })
        .catch(error=>{
            console.log(error.message);
        });
    },
    addLocationsToGoogleMaps(){
        var map = new google.maps.Map(this.$refs["map"],{
            zoom:15,
            center: new google.maps.LatLng(this.lat,this.lng),
            mapTypeId: google.maps.MapTypeId.ROADMAP
        });

        var infowindow = new google.maps.InfoWindow();

        this.places.forEach(place=>{
            const lat = place.geometry.location.lat;
            const lng = place.geometry.location.lng;

            let marker = new google.maps.Marker({
            position: new google.maps.LatLng(lat,lng),
            map:map
        });

        google.maps.event.addListener(marker,"click",()=>{
            infowindow.setContent(
                `<div class="ui header">${place.name}</div><p>${place.vicinity}</p>`
            );

            infowindow.open(map,marker);
        });
    });

        
    }
    },

};
</script>
<style>
      .pac-icon{
          display:none;
      }
      
      .pac-item{
          padding:10px;
          font-size:16px;
          cursor:pointer;
      }
      
      .pac-item:hover{
          background-color: #ececec;
      }
      
      .pac-item-query{
          font-size:16px;
      }
    </style>