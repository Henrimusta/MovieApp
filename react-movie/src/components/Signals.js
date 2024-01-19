//Signal kansioita voi olla myös useampi jos tätä komponenttia käytetään useassa eri paikassa

import { effect, signal } from "@preact/signals-react";
import axios from "axios";

export const jwtToken = signal(getSessionToken());
export const userData = signal(null);

function getSessionToken(){
    const t = sessionStorage.getItem('token');
    return t===null || t==='null' ? '' : t;
}

effect(()=>{
    sessionStorage.setItem('token', jwtToken.value);    

    if(jwtToken.value.length > 0){
        const config = {headers:{ Authorization: 'Bearer ' + jwtToken.value }};
        axios.get('http://localhost:3001/user/private', config)
            .then(resp => userData.value = resp.data)
            .catch(err => console.log(err.response.data))
    }
});