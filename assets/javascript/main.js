//ds^2 = (1 - 2m / r)dt^2 - 1/c( dr^2/(1-2m/r) + r^2dθ^2 + r^2sin^2(θ)dφ^2)
//m = GM(sol)/c^2
//θ = U+03B8
//φ = U+03C6
//π = U+03C0
//β = U+03B2
//ε = U+03B5
//Δ = U+0394
//ϵ = U+03F5
//τ = U+03C4
//μ = U+03BC
//ν = U+03BD
//geodesic eqn of mot
//1) d/ds[(1-2m/r)dt/ds] = 0
//2) d/ds(-r^2/c^2 dθ/ds) - 1/2((-r^2/c^2) * 2sinθcosθ)(dφ/ds)^2 = 0
//3) d/ds[(-r^2/c^2)sin^2(θ)(dφ/ds)] = 0
//4) first integral (1-2m/r)(dt/ds)^2 - (1/c^2)[1/(1-2m/r)(dr/ds)^2 + r^2(dθ/ds)^2 + r^2sin^2(θ)(dφ/ds)^2] = 1
//if initially θ = 1/2π
//from 1) and 3) const of integration
//5) (1-2m/r)(dt/ds) = β
//6) r^2(dφ/ds) = h
//substituting 5 and 6 into 4 with r=1/u=a(1+-e) => aphelion, perihelion
//(du/dφ)^2 = 2mu^2 - u^2 + (2c^2/h^2)mu - (c^2/h^2)(1-β^2)
//ε cannot exceed 10^-8 for any orbit outside suns physical surface
// relativistic kepler 2π(t-t0)/T = M'= E'-esin(E')+3ε(1-e^2)E'
// relativistic correction ε = GM/(c^2a(1-e^2))
// perihelion shift in  Δθ = πGM/(c^2a(1-e^2))
//rc ≡ l^2/GM
//rc(1-3ε)/r = 1 + e(1 + 3ε)cos(1 - 3ε)θ
//l is angular momentum per unit mass
//8.854187817...×10−12
// Rc = 1/2rc + 1/2rc*sqrt(1-12ε)
// rc/rp = (1 + e(1 + 1/2planet.ε))/1-1/2planet.ε
//M = n(t-)
$(document).ready(() => {
let c_ms = 299792458;
let G = 6.674 * Math.pow(10, -11);
let M_kg = 1.98855 * Math.pow(10, 30);
let planets = {
    mercury: {
        angMo: 9.1,
        angMo_exp: 38,
        massKg: 3.3011,
        mass: 3.3011 * Math.pow(10, 23),
        mass_exp: 23,
        μ: 2.20329 * Math.pow(10, 13),
        //1513079280
        //1520711880
        //1497877200
        //1490277600
        //1231890960
        infCon: 1925700,
        τ: 1513079280,
        e: 0.205630,
        a_km: 57909050,
        rc: '',
        ε: 0,
        Δθ: 0
    },
    venus: {
        angMo: 1.8,
        angMo_exp: 40,
        massKg: 4.87,
        mass_exp: 24,
        e: 0.006772,
        a_km: 57909050,
        rc: '',
        ε: 0,
        θ: 0,
    }, 
    earth: {
        angMo: 1.8,
        angMo_exp: 40,
        massKg: 4.87,
        mass: 5.97237 * Math.pow(10, 24),
        mass_exp: 24,
        e: 0.0167086,
        a_km: 149598023,
        T: 365.256363004,
        rc: '',
        ε: 0,
        θ: 0,
    }
}

    //1524003689998
    //69183950km

function trueAnom (planet) {
let EC = Math.cos(planet.E);
let trueA =  Math.cos((EC - planet.e) / (1 - planet.e * EC))**(-1);
return trueA;
}

function meanAnom (planet) {
    let t = new Date();
    let tnow = t.getTime();//85000 on 4/26
    let tnew = tnow + 85000//tnow * 5.508963* 10**(-8);//5.5089632237879476e-8
    let Δτ = ((tnew  / 1000) - planet.τ)
    let μ = 4 * Math.PI**2 * planet.a_km**3 / period(planet)**2
    planet.M = 2 * Math.PI * (Δτ / period (planet));
    //planet.Δθ = 2*planet.e * Math.sin(planet.M) + 5/4 * planet.e**2 * Math.sin(2 * planet.M);
    planet.E = planet.M + (planet.e - (planet.e**3)/8)*Math.sin(planet.M) + .5*planet.e*planet.e*Math.sin(2*planet.M) + (3/8)*(planet.e**3)*Math.sin(3 * planet.M);
}

function period (planet) {
    // let a = new Date('June 6, 2018 10:14:00');
    // let b = new Date('March 10, 2018 10:58:00');
    // let a1 = a.getTime();
    // let b1 = b.getTime();
    //let T = (a1 - b1)/1000
    let T = 7600560 
    //console.log(T);
    return T;
}

// function rc (planet) {
//     let l = ((planet.angMo / planet.massKg) * Math.pow(10, (planet.angMo_exp - planet.mass_exp)));
//     let rc = l**2 / (G * M_kg);
//     relaCorrect (planet);
//     planet.rc = .5 * rc + .5 * rc * (1 - 12 * planet.ε);
// }

function relaCorrect (planet) {
    planet.ε = (G * M_kg) / ((c_ms**2) * planet.a_km* 1000 * (1 - planet.e**2));
}

function rOrbit (planet) {
    meanAnom(planet);
    let anom = trueAnom(planet);
    let ε = planet.ε;
    //let r = planet.a_km * (1 + (planet.e**2) * (1 - 3 * planet.ε) / 2 - planet.e * Math.cos(planet.M) - (planet.e**2) * (1 - 3 * planet.ε) / 2 * Math.cos(2*planet.M) - 3 * planet.e * planet.ε * planet.M * Math.sin(planet.M) - 3 * planet.ε * (planet.e**2) * planet.M * Math.sin(planet.M));
    let r = planet.a_km * (1-planet.e*Math.cos(planet.E));
    rScreen = r/(7.5 * 10**7);
    let x = rScreen * Math.cos(planet.M) ;
    let y = rScreen * Math.sin(planet.M);
    $('#mercury').css('top', y * 5 + 50 + '%');
    $('#mercury').css('left', x * 5 + 50 + '%');
    console.log(r);
}

function perihelion (planet) {
    //rc/rp = (1 + e(1 + 1/2planet.ε))/1-1/2planet.ε
    planet.rp = planet.a_km * (1 + (planet.e**2) * (1 - 3 * planet.ε) / 2 - planet.e - (planet.e**2) * (1 - 3 * planet.ε) / 2 );
    //planet.rp = planet.rc * (1 - planet.ε / 2) / (1 + planet.e * (1 + planet.ε / 2));
    //console.log(planet.rp);
}

function Δφ (planet) {
    let paramA = planet.ε * planet.e
    let paramB = paramA * planet.M
    Δφ = 3*paramB*planet.e + 4*paramA*Math.sin()
    //69183950km
}
 
$('#submit').click(() => {
    window.setInterval(rOrbit, 5000, planets.mercury);
    //perihelion(planets.mercury);
})
});