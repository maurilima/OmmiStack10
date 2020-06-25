const axios = require('axios') ;
const Dev = require('../models/dev');
const parseStringAsArray = require('../utils/parseStringAsArray')

// index = Lista , Show = Unico , store = criar, update = atualizar, destroy = deletar 

module.exports = {
    async index(req, resp){
        console.log(req.body);
        const devs = await Dev.find();
        return resp.json(devs);
    },

    async store(req, resp) {
        console.log(req.body);
        const {github_username, techs, latitude, longitude } = req.body;

        let dev = await Dev.findOne({github_username});

        if (!dev) {


        const response = await axios.get(`https://api.github.com/users/${github_username}`);

        const { name = login , avatar_url, bio } = response.data;

        const techsArray =  parseStringAsArray(techs);

        const location = {
        type: 'Point',
        coordinates:[longitude, latitude]
        };

        dev = await Dev.create({
        github_username : github_username, 
        name,
        avatar_url,
        bio,
        techs:techsArray,
        location,

        })
        // console.log(name, avatar_url, bio );
    }
   return resp.json(dev);
 }
}
