import DATA from './data'

import gsap from 'gsap';
import { CustomEase } from "gsap/CustomEase";
gsap.registerPlugin(CustomEase);
import DATAS3000 from './getAPI'
import Sketch from './js/moduleThree'
import imgs from './img/miniature/**.webp'
let sketch = new Sketch({
    dom: document.getElementById('container')
})
let section = document.querySelector('.loop')
let elment = document.querySelector('.list')
    // CREATE ELEMENT
DATA.forEach((e, i) => {
    let newElement = elment.cloneNode(true);
    newElement.setAttribute('data-nav', i)
    newElement.setAttribute('data-img', e.video.miniature)
    if (i >= 9) {
        newElement.childNodes[1].childNodes[1].textContent = i + 1
    } else {
        newElement.childNodes[1].childNodes[1].textContent = "0" + (i + 1)
    }
    newElement.childNodes[3].childNodes[1].textContent = e.artiste
    newElement.childNodes[5].childNodes[1].textContent = e.titre
    newElement.childNodes[11].setAttribute('src', imgs[i + 1])

    section.appendChild(newElement)
    elment.remove();
})



window.addEventListener('load', () => {
    // DATAS3000[0].forEach((e, i) => {
    //     console.log(e.thumbnail)
    //     require(e.thumbnail)
    // })
    let ElemntsArray = [...document.querySelectorAll('.list')]

    let itemActive = ElemntsArray[0];
    let itemActivePosY = 0

    let imgActive = null;
    let objs = Array(22).fill({ dist: 0 })

    let ActiveMode = false
    let inProgresss = true

    let speed = 0;
    let position = 0;
    let rounded = 0;

    let attractMode = false
    let attractTo = 0


    function raf() {
        position += speed;
        speed *= 0.8;

        objs.forEach((o, i) => {

            o.dist = Math.min(Math.abs(position - i), 1)

            // if (o.dist > 0.4) {
            //     ElemntsArray[i].classList.add('animate')
            // } else {
            //     ElemntsArray[i].classList.remove('animate')
            // }
            o.dist = 1 - o.dist ** 2;

            let scale = 1 + 0.1 * o.dist;

            sketch.meshes[i].position.y = i * 1.3 + -position * 1.3

            //sketch.meshes[i].scale.set(1, scale, 1);
            sketch.meshes[i].material.uniforms.distanceFromCenter.value = o.dist
        })

        rounded = Math.round(position)

        let diff = (rounded - position);

        if (attractMode) {
            position += -(position - (attractTo)) * 0.04
        } else {
            if (position <= 0) {
                position += -(position - (1 - 1)) * 0.04
            } else if (position >= objs.length - 1) {
                position += -(position - ((objs.length) - 1)) * 0.04
            } else {
                position += Math.sign(diff) * Math.pow(Math.abs(diff), 0.7) * 0.015;
            }

        }


        //console.log(position + "--------")
        //section.style.transform = `translate(0,${-position*20}px)`
        window.requestAnimationFrame(raf)
    }
    raf()

    ElemntsArray.forEach((element, i) => {
        ElemntsArray[0].classList.add('active')
        element.addEventListener('click', (e) => {
            ActiveMode = true
            itemActive.classList.remove('active')
            element.classList.add('active')
            itemActive = element
            inProgresss = true

            section.classList.remove('active')
            itemActivePosY = element.getBoundingClientRect().top

            CustomEase.create("CIRC", "M0,0 C0.156,0 0.246,0.272 0.31,0.618 0.366,0.924 0.482,1 1,1 ");
            gsap.to(section, {
                    duration: 1.5,
                    y: -itemActivePosY,
                    ease: "CIRC",
                })
                // if (position === rounded) {
            gsap.to(sketch.meshes[rounded].material.uniforms.progress, {
                value: 0,
                duration: 1.5,
                ease: "CIRC",
                onComplete: () => {

                    inProgresss = false
                }

            })
            gsap.to(sketch.meshes[rounded].material.uniforms.direction, {
                value: 1,
                duration: 0.5,
            })
            gsap.to(sketch.meshes[rounded].material.uniforms.alpha, {
                    value: 1,
                    duration: 1.5,
                    ease: "CIRC",
                })
                // }

        })

        section.addEventListener('mouseenter', (e) => {
            if (inProgresss) return
            inProgresss = true
            gsap.to(section, {
                duration: 1.5,
                y: 0,
                ease: "CIRC",
            })
            sketch.meshes.forEach((e, i) => {
                gsap.to(sketch.meshes[i].material.uniforms.direction, {
                    value: 0,
                    duration: 0.5,
                    ease: "CIRC",
                })
                gsap.to(sketch.meshes[i].material.uniforms.progress, {
                    value: 1,
                    duration: 1.5,
                    ease: "CIRC",
                    onComplete: () => {
                        section.classList.add('active')
                        inProgresss = false
                        ActiveMode = false
                    }

                })
                gsap.to(sketch.meshes[i].material.uniforms.alpha, {
                    value: 0.5,
                    duration: 1.5,
                    ease: "CIRC",
                })
            })




        })
        section.addEventListener('mouseleave', (e) => {
            if (inProgresss) return
            if (!ActiveMode) return
            section.classList.remove('active')
            gsap.to(section, {
                duration: 1,
                y: -itemActivePosY,
                ease: "CIRC",
            })

            gsap.to(sketch.meshes[rounded].material.uniforms.progress, {
                value: 0,
                duration: 1.5,
                ease: "CIRC",
            })
            gsap.to(sketch.meshes[rounded].material.uniforms.direction, {
                value: 1,
                duration: 0.5,
                ease: "CIRC",
            })
            gsap.to(sketch.meshes[rounded].material.uniforms.alpha, {
                value: 1,
                duration: 1.5,
                ease: "CIRC",
            })

        })


    })



    let navs = [...document.querySelectorAll('.list')]
    let nav = document.querySelector('.loop')

    let rots = sketch.groups.map(e => e.rotation)
    let poss = sketch.groups.map(e => e.position)

    nav.addEventListener('mouseenter', () => {
        attractMode = true
        gsap.to(rots, {
            duration: 0.3,
            x: 0,
            y: 0,
            z: 0,
        })
        gsap.to(poss, {
            duration: 0.3,
            x: 0,
        })
    })
    nav.addEventListener('mouseleave', () => {
        attractMode = false
        gsap.to(rots, {
            duration: 0.3,
            x: -0,
            y: -0,
            z: -0,
        })
        gsap.to(poss, {
            duration: 0.3,
            x: 0,
        })
    })

    navs.forEach(el => {
        el.addEventListener('mouseover', (e) => {
            attractTo = Number(e.currentTarget.getAttribute('data-nav'))
        })
    })
})