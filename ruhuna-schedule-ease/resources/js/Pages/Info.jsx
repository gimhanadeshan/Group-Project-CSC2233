// ParticleBackground.jsx
import { useMemo,React,useEffect,useState } from 'react';
import Particles, { initParticlesEngine } from "@tsparticles/react";
import { loadFull } from 'tsparticles';
import Guest from '@/Layouts/GuestLayout';

const Info = () => {
    const [init, setInit] = useState(false);
    useEffect(() => {
        initParticlesEngine(async (engine) => {
          // you can initiate the tsParticles instance (engine) here, adding custom shapes or presets
          // this loads the tsparticles package bundle, it's the easiest method for getting everything ready
          // starting from v2 you can add only the features you need reducing the bundle size
          //await loadAll(engine);
          //await loadFull(engine);
          await loadFull(engine);
          //await loadBasic(engine);
        }).then(() => {
          setInit(true);
        });
      }, []);
    const particlesInit = async (main) => {
        // you can customize the tsParticles instance here
        await loadFull(main);
    };

    const particlesLoaded = (container) => {
        console.log(container);
    };

    const options = useMemo(
        () => ({
          background: {
            color: {
              value: "#0000",
            },
          },
          fpsLimit: 120,
          interactivity: {
            events: {
              onClick: {
                enable: true,
                mode: "push",
              },
              onHover: {
                enable: true,
                mode: "repulse",
              },
            },
            modes: {
              push: {
                quantity: 1,
              },
              repulse: {
                distance: 200,
                duration: 0.4,
              },
            },
          },
          particles: {
            color: {
              value: "#ffffff",
            },
            // links: {
            //   color: "#ffffff",
            //   distance: 150,
            //   enable: true,
            //   opacity: 0.5,
            //   width: 1,
            // },
            move: {
              direction: "outside",
              enable: true,
              outModes: {
                default: "bounce",
              },
              random: true,
              speed: 2,
              straight: true,
            },
            number: {
              density: {
                enable: true,
              },
              value: 80,
            },
            opacity: {
              value: 0.5,
            },
            shape: {
              type: "character",
              options:{
                "character": {
        "value": "ASE", // the text to use as particles, any string is valid, for escaping unicode char use the `\uXXXX` syntax
        "font": "Verdana", // the font to use to draw the text. If the font needs an external css or javascript like FontAwesome you should include all the necessary files on your own
        "style": "", // any additional css style to add to the text
        "weight": "" // the css weight property, some fonts like font awesome have a specified weight, check the documentation if needed
    }
              }
            },
            size: {
              value: { min: 1, max: 10 },
            },
          },
          detectRetina: true,
        }),
        [],
      );

      if (init) {
        return (
            <Guest>
                <Particles
            id="tsparticles"
            particlesLoaded={particlesLoaded}
            options={options}
          />
            </Guest>

        );
      }

      return <Guest></Guest>;
};

export default Info;
