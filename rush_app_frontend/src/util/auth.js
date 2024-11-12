import axios from 'axios';
import firebaseAdmin from 'firebase'

export const _authMiddleWare = (history) => {
    const authToken = localStorage.getItem('AuthToken');
    if(authToken === null){
        history.push('/login')
    }
}

// returns a promise to authenticate outgoing requests
export const authMiddleWare = (history) => {
    return firebaseAdmin.auth().currentUser.getIdToken().then( (authToken) => {
        if(authToken === null){
            history.push('/login')
        }
        axios.defaults.headers.common = { Authorization: `Bearer ${authToken}` };
    }).catch( (err) => {
        console.log(err)
        history.push('/login')
    }
    );
}