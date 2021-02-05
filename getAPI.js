const url = 'https://natas3000.cdn.prismic.io/api/v2/documents/search?ref=YBw_DRIAACMAJPyy&access_token=MC5ZQnd5YUJJQUFDTUFKTVNM.77-977-977-9RO-_ve-_vQx-X--_ve-_ve-_ve-_vTUebe-_ve-_ve-_ve-_vT9dDO-_vUp8Ge-_vQsr77-9Ag';

let videos = []
let photos = []
const datas3000 = []

fetch(url)
    .then((resp) => resp.json())
    .then(function(data) {
        let natas = [data.results];
        return natas.map(function(natas) {
            natas[1].data.video.forEach((element, i) => {
                let elmt = {
                    titre: natas[1].data.video[i].titre[0].text,
                    artiste: natas[1].data.video[i].artiste[0].text,
                    date: natas[1].data.video[i].date[0].text,
                    location: natas[1].data.video[i].location[0].text,
                    thumbnail: natas[1].data.video[i].thumbnail.url,
                    video: natas[1].data.video[i].videosrc.url,
                }
                videos.push(elmt)

            });
            natas[0].data.photos.forEach((element, i) => {
                let elmt = {
                    image: natas[0].data.photos[i].image.url,
                }
                photos.push(elmt)

            });
            datas3000.push(videos)
            datas3000.push(photos)
        })
    })
    .catch(function(error) {
        console.log(error);
    });


export default datas3000;