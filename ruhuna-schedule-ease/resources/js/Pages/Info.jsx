// ParticleBackground.jsx
import { useMemo,React,useEffect,useState } from 'react';
import Particles, { initParticlesEngine } from "@tsparticles/react";
import { loadFull } from 'tsparticles';
import Guest from '@/Layouts/GuestLayout';
import zIndex from '@mui/material/styles/zIndex';

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
        <>
                <div style={{ position: 'relative', zIndex: 1 }}>
                <div className="flex flex-col min-h-screen ">
            {/* Header Section */}
            <header >
                <div className="container mx-auto flex justify-between items-center py-4 px-6">
                    <img src="/logo.png" alt="RUHUNA ScheduleEase Logo" className="h-10 bg-gray-100" />
                    <nav>
                        <ul className="flex space-x-6">
                            <li><a href="#" className="text-gray-700 hover:text-gray-900">Home</a></li>
                            <li><a href="#" className="text-gray-700 hover:text-gray-900">Features</a></li>
                            <li><a href="#" className="text-gray-700 hover:text-gray-900">Pricing</a></li>
                            <li><a href="#" className="text-gray-700 hover:text-gray-900">Contact</a></li>
                        </ul>
                    </nav>
                </div>
                <div className=" text-white py-20 text-center">
                    <h1 className="text-4xl font-bold">Streamline Your Academic Operations</h1>
                    <p className="mt-4 text-xl">Discover how RUHUNA ScheduleEase can revolutionize academic management.</p>
                    <button className="mt-6 px-6 py-3 bg-blue-700 text-white rounded hover:bg-blue-800">Get Started</button>
                </div>
            </header>

            {/* About Section */}
            <section className="container mx-auto py-12 px-6 text-center">
                <h2 className="text-3xl font-bold mb-4">About RUHUNA ScheduleEase</h2>
                <p className="text-lg text-gray-600">A web application designed to simplify and automate academic management at the University of Ruhuna.</p>
            </section>

            {/* Features Section */}

            <section className="relative py-12 ">
    <div className="absolute inset-0 flex items-center justify-center">
        <div className="w-1 bg-gray-700 h-full"></div>
    </div>
    <div className="relative container mx-auto grid grid-cols-1 gap-8 px-6">
        {/* Feature 1: User Account Management */}
        <div className="flex flex-col lg:flex-row items-center">
            <div className="lg:w-1/2 lg:order-1">
                <h3 className="text-2xl font-bold mb-2 text-white">User Account Management</h3>
                <p className="text-gray-400">Admins can manage users, delete users, and assign admin roles efficiently.</p>
            </div>
        </div>

        {/* Feature 2: Semester Initialization */}
        <div className="flex flex-col lg:flex-row items-center">
            <div className="lg:w-1/2 lg:order-2 lg:ml-auto text-right">
                <h3 className="text-2xl font-bold mb-2 text-white">Semester Initialization</h3>
                <p className="text-gray-400">Easily set up new semesters, ensuring smooth transitions and accurate data management.</p>
            </div>
        </div>

        {/* Feature 3: Course Registration */}
        <div className="flex flex-col lg:flex-row items-center">
            <div className="lg:w-1/2 lg:order-1">
                <h3 className="text-2xl font-bold mb-2 text-white">Course Registration</h3>
                <p className="text-gray-400">Streamline course registration with lecturer confirmations, reducing errors and ensuring accuracy.</p>
            </div>
        </div>

        {/* Feature 4: Timetable Generation */}
        <div className="flex flex-col lg:flex-row items-center">
            <div className="lg:w-1/2 lg:order-2 lg:ml-auto text-right">
                <h3 className="text-2xl font-bold mb-2 text-white">Timetable Generation</h3>
                <p className="text-gray-400">Automatically generate random time slots and customize them to fit your specific needs.</p>
            </div>
        </div>

        {/* Feature 5: Lecture Scheduling */}
        <div className="flex flex-col lg:flex-row items-center">
            <div className="lg:w-1/2 lg:order-1">
                <h3 className="text-2xl font-bold mb-2 text-white">Lecture Scheduling</h3>
                <p className="text-gray-400">Effortlessly schedule lectures, avoiding conflicts and optimizing room usage.</p>
            </div>
        </div>

        {/* Feature 6: Personalized Dashboards */}
        <div className="flex flex-col lg:flex-row items-center">
            <div className="lg:w-1/2 lg:order-2 lg:ml-auto text-right">
                <h3 className="text-2xl font-bold mb-2 text-white">Personalized Dashboards</h3>
                <p className="text-gray-400">Provide users with dashboards tailored to their specific roles and responsibilities.</p>
            </div>
        </div>

        {/* Feature 7: Automated Notifications */}
        <div className="flex flex-col lg:flex-row items-center">
            <div className="lg:w-1/2 lg:order-1">
                <h3 className="text-2xl font-bold mb-2 text-white">Automated Notifications</h3>
                <p className="text-gray-400">Keep everyone informed with automated notifications for important updates and deadlines.</p>
            </div>
        </div>
    </div>
</section>



            {/* Benefits Section */}
            <section className="container mx-auto py-12 px-6 text-center">
                <h2 className="text-3xl font-bold mb-4">Benefits</h2>
                <p className="text-lg text-gray-600">Efficiency, ease of use, and improved academic management.</p>
            </section>

            {/* Testimonials Section */}
            <section className="bg-gray-50 py-12">
                <div className="container mx-auto px-6">
                    <h2 className="text-3xl font-bold text-center mb-8">What Users Say</h2>
                    <blockquote className="text-center text-gray-600 italic">"RUHUNA ScheduleEase has transformed our department!" - Lecturer A</blockquote>
                    {/* Add more testimonials */}
                </div>
            </section>

            {/* Footer */}
            <footer className="bg-gray-800 text-white py-6">
                <div className="container mx-auto px-6 text-center">
                    <p>Contact us at contact@example.com</p>
                    <ul className="flex justify-center space-x-4 mt-4">
                        <li><a href="#" className="hover:underline">Privacy Policy</a></li>
                        <li><a href="#" className="hover:underline">Terms of Service</a></li>
                    </ul>
                </div>
            </footer>
        </div>
                </div>
                <Particles
                    id="tsparticles"
                    particlesLoaded={particlesLoaded}
                    options={options}
                    style={{ position: 'absolute', top: 0, left: 0, zIndex: 0 }}
                />

</>

        );
      }

      return <Guest></Guest>;
};

export default Info;
