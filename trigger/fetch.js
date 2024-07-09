const axios = require('axios');
const { exec } = require('child_process');

async function getAPI() {
    try {
        const response = await axios.get('https://api.etherscan.io/api?module=gastracker&action=gasoracle&apikey=QKU5Q81HNWVY59FXKN8TBIY3CJTCDU4NY6');
        return response.data;
    }catch (error) {
        return error;
    }
}

setInterval(() => {
    getAPI().then((res) =>{
        const proposedGasPrice = res.result.ProposeGasPrice;
        if(proposedGasPrice>1){
            exec('./sideChMaker.sh', (error, stdout, stderr) =>{
                if (error) {
                    console.error(`exec error: ${error}`);
                    return;
                }
                console.log(`stdout: ${stdout}`);
                console.error(`stderr: ${stderr}`);
            });
        }
        
        if(proposedGasPrice<1){
            exec('./sideChKiller.sh', (error, stdout, stderr) =>{
                if (error) {
                    console.error(`exec error: ${error}`);
                    return;
                }
                console.log(`stdout: ${stdout}`);
                console.error(`stderr: ${stderr}`);
            });
        }
    })
}, 15000);



