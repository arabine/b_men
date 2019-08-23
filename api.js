class ApiBackend {

    constructor() {
        this.cards = {};
    }

    // API REST
    getRESTApiUri()
    {
        let uri = window.location.protocol + "//" + window.location.host + "/api";
        //console.log("REST API: " + uri);
        return uri;
    }

    getRootUrl()
    {
        let uri = window.location.protocol + "//" + window.location.host;
        return uri;
    }

    async fetchCards() {

        const requestOptions = {
            method: 'GET',
            mode: 'cors'
        };

        try {
            await fetch(Api.getRootUrl() + "/engine/cards.json", requestOptions)
                    .then(this.handleResponse)
                    .then(response => {
                        this.cards = response;
                    });

            

        } catch(err) {
            // catches errors both in fetch and response.json
            console.log(err);
        }
    }

    async fetchPlayerCards() {

        const requestOptions = {
            method: 'GET',
            mode: 'cors'
        };

        try {
            let p_cards = [];

            await fetch(Api.getRESTApiUri() + "/playercards", requestOptions)
                    .then(this.handleResponse)
                    .then(response => {
                        p_cards = response;
                    });
            return p_cards;
        } catch(err) {
            // catches errors both in fetch and response.json
            console.log(err);
        }
    }

    async sendCard(card) {
        let myHeaders = new Headers();
        myHeaders.append('Accept', 'application/json');
        myHeaders.append('Content-Type', 'application/json');

        const requestOptions = {
            method: 'POST',
            mode: 'cors',
            headers: myHeaders,
            body: JSON.stringify(card)
        };
    
        return fetch(Api.getRESTApiUri() + "/playcard", requestOptions)
            .then(this.handleResponse)
    }

    handleResponse(response) {
        return response.text().then(text => {
            
            if (!response.ok) {
                if (response.status === 401) {
                }
    
                const error = response.statusText;
                return Promise.reject(error);
            }
    
            return JSON.parse(text);;
        });
      }  

};

const Api = new ApiBackend();

