export default {
    get(url, params, dataType = 'json'){
        return fetchFn(url, params, dataType);
    },
    post(url, params, dataType = 'json'){
        return fetchFn(url, params, dataType); 
    }
};


function fetchFn(input, init, dataType){
    return new Promise((resolve, reject) => {
        fetch('http://10.143.149.44:8081/api_index_data').then(response => {
            switch(dataType){
                case 'json':
                    return response.json();
                case 'html':
                    return response.text();
                case 'blob':
                    return response.blob();
                case 'text':
                    return response.text();
                default:
                    return response.json();
            }
        }).then(data => {
            return resolve(data);
        }).catch(e => {
            return reject(e);
        });
    })
}
