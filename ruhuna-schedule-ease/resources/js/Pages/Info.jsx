// ParticleBackground.jsx
import { useMemo,React,useEffect,useState } from 'react';
import Particles, { initParticlesEngine } from "@tsparticles/react";
import { loadFull } from 'tsparticles';
import { Link,Head } from '@inertiajs/react';
import Guest from '@/Layouts/GuestLayout';
import AOS from 'aos';
import 'aos/dist/aos.css';

const Info = () => {
    AOS.init();
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
    // data/teamMembers.js
 const teamMembers = [
    {
      id: 1,
      name: 'Sameera Athukorala',
      position: 'Member',
      image: '/Team/mem_sameera.jpeg',
    },
    {
      id: 2,
      name: 'Charith Jayasankha',
      position: 'Member',
      image: '/Team/mem_charith.jpeg',
    },
    {
      id: 3,
      name: 'Oshan Harshad',
      position: 'Member',
      image: '/Team/mem_oshan.jpg',
    },
    {
      id: 4,
      name: 'Janith Sandaruwan',
      position: 'Member',
      image: '/Team/mem_janith.jpg',
    },
    {
      id: 5,
      name: 'Asanka Idunil',
      position: 'Member',
      image: '/Team/mem_asanka.jpg',
    },
  ];

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
                mode: "bubble",
              },
              onHover: {
                enable: true,
                mode: "grab",
              },
            },
            modes: {
              bubble: {
                distance: 400,
                duration: 0.5,
                opacity: 0.5,
                size: 20,
                speed: 1,
            },
              grab: {
                distance: 250,
                line_linked: {
                    opacity: 0.1,
                },
            },
              push: {
                quantity: 2,
              },
              repulse: {
                distance: 100,
                duration: 0.4,
              },
            },
          },
          particles: {
            color: {
              value: "#ffffff",
            },            // links: {            //   color: "#ffffff",
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
                enable: false,
              },
              value: 50,
            },
            opacity: {
              value: 0.8,
            },
            shape: {
              type: "image",
              options:{
                "image": {
        // any path or url to your image that will be used as a particle
        "src": "/logo.png",
        // the pixel width of the image, you can use any value, the image will be scaled
        "width": 100,
        // the pixel height of the image, you can use any value, the image will be scaled
        "height": 100,
        // if true and the image type is SVG, it will replace all the colors with the particle color
        "replaceColor": false
    }
              }
            },
            size: {
              value: { min: 10, max: 40 },
            },
          },
          detectRetina: true,
        }),
        [],
      );

      if (init) {
        return (
            
        <>
                <Head title="Welcome" />
                <div style={{ position: 'relative', zIndex: 1 }}>
                <div className="flex flex-col min-h-screen ">
            {/* Header Section */}
            <header>
    <div className="container mx-auto flex justify-between items-center py-4 px-6">
        <img src="/logo.png" alt="RUHUNA ScheduleEase Logo" className="h-10 bg-gray-100" />
        <nav className='rounded-lg'>
            <ul className="flex space-x-6">
                <li><a href="#" className="text-gray-300 hover:text-gray-100">Home</a></li>
                <li><a href="#feature" className="text-gray-300 hover:text-gray-100">Features</a></li>
                <li><a href="#team" className="text-gray-300 hover:text-gray-100">Team</a></li>
                <li><a href="#contact" className="text-gray-300 hover:text-gray-100">Contact</a></li>
            </ul>
        </nav>
    </div>
    <div className="text-white py-20 text-center">
        <h1 data-aos="zoom-in"  data-aos-duration="1500" className="text-7xl font-bold">Ruhuna Schedule Ease</h1>
        <h1 data-aos="zoom-in"  data-aos-duration="1500" className="mt-10 text-3xl">Streamline Your Academic Operations</h1>
        <p data-aos="zoom-in"  data-aos-duration="1500" className="mt-4 text-xl">Discover how RUHUNA ScheduleEase can revolutionize academic management.</p>
        <Link data-aos="zoom-in"  data-aos-duration="1500" href={route('login')} className="inline-flex justify-center items-center py-3 px-5 text-base font-medium text-center text-white rounded-lg bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:ring-blue-300 dark:focus:ring-blue-900 mt-6">Get Started</Link>
    </div>
</header>

{/* About Section */}
<section data-aos="zoom-in"  data-aos-duration="1500" className="container mx-auto py-12 px-6 text-center">
    <h2 className="text-3xl font-bold mb-4 text-white">About RUHUNA ScheduleEase</h2>
    <p className="text-lg text-gray-300">A web application designed to simplify and automate academic management at the University of Ruhuna.</p>
</section>

<div data-aos="zoom-in"  data-aos-duration="1500" className="container mx-auto py-12 px-6 text-center">
    <h2 className="text-3xl font-bold mb-4 text-white">Features on RUHUNA ScheduleEase</h2>
</div>

           {/* Features Section */}
<section id='feature' className="relative py-12">

    <div className="absolute inset-0 flex items-center justify-center">
        <div className="w-1 bg-gray-700 h-full"></div>
    </div>
    <div className="relative container mx-auto grid grid-cols-1 gap-12 px-6">
        {/* Feature 1: User Account Management */}
        <div data-aos="zoom-out-right" data-aos-duration="1500" className="flex flex-col lg:flex-row items-center">
            <div className="lg:w-1/2 lg:order-1">
                <h3 className="text-2xl font-semibold mb-2 text-white">User Account Management</h3> {/* Changed font style here */}
                <p className="text-gray-400">Admins can manage users, delete users, and assign admin roles efficiently.</p>
            </div>
        </div>

        {/* Feature 2: Semester Initialization */}
        <div data-aos="zoom-out-left" data-aos-duration="1500" className="flex flex-col lg:flex-row items-center">
            <div className="lg:w-1/2 lg:order-2 lg:ml-auto text-right">
                <h3 className="text-2xl font-semibold mb-2 text-white">Semester Initialization</h3> {/* Changed font style here */}
                <p className="text-gray-400">Easily set up new semesters, ensuring smooth transitions and accurate data management.</p>
            </div>
        </div>

        {/* Feature 3: Course Registration */}
        <div data-aos="zoom-out-right" data-aos-duration="1500" className="flex flex-col lg:flex-row items-center">
            <div className="lg:w-1/2 lg:order-1">
                <h3 className="text-2xl font-semibold mb-2 text-white">Course Registration</h3> {/* Changed font style here */}
                <p className="text-gray-400">Streamline course registration with lecturer confirmations, reducing errors and ensuring accuracy.</p>
            </div>
        </div>

        {/* Feature 4: Timetable Generation */}
        <div data-aos="zoom-out-left" data-aos-duration="1500" className="flex flex-col lg:flex-row items-center">
            <div className="lg:w-1/2 lg:order-2 lg:ml-auto text-right">
                <h3 className="text-2xl font-semibold mb-2 text-white">Timetable Generation</h3> {/* Changed font style here */}
                <p className="text-gray-400">Automatically generate random time slots and customize them to fit your specific needs.</p>
            </div>
        </div>

        {/* Feature 5: Lecture Scheduling */}
        <div data-aos="zoom-out-right" data-aos-duration="1500" className="flex flex-col lg:flex-row items-center">
            <div className="lg:w-1/2 lg:order-1">
                <h3 className="text-2xl font-semibold mb-2 text-white">Lecture Scheduling</h3> {/* Changed font style here */}
                <p className="text-gray-400">Effortlessly schedule lectures, avoiding conflicts and optimizing room usage.</p>
            </div>
        </div>

        {/* Feature 6: Personalized Dashboards */}
        <div data-aos="zoom-out-left" data-aos-duration="1500" className="flex flex-col lg:flex-row items-center">
            <div className="lg:w-1/2 lg:order-2 lg:ml-auto text-right">
                <h3 className="text-2xl font-semibold mb-2 text-white">Personalized Dashboards</h3> {/* Changed font style here */}
                <p className="text-gray-400">Provide users with dashboards tailored to their specific roles and responsibilities.</p>
            </div>
        </div>

        {/* Feature 7: Automated Notifications */}
        <div data-aos="zoom-out-right" data-aos-duration="1500" className="flex flex-col lg:flex-row items-center">
            <div className="lg:w-1/2 lg:order-1">
                <h3 className="text-2xl font-semibold mb-2 text-white">Automated Notifications</h3> {/* Changed font style here */}
                <p className="text-gray-400">Keep everyone informed with automated notifications for important updates and deadlines.</p>
            </div>
        </div>
    </div>
</section>


            {/* Benefits Section */}
            <section className="container mx-auto py-12 px-6 text-center">
                <h2 className="text-3xl font-bold mb-4 text-gray-600">Benefits</h2>
                <p className="text-lg text-gray-600">Efficiency, ease of use, and improved academic management.</p>
            </section>

            <section id='team' className="py-8">
  <div className="container mx-auto px-4">
    <h2 className="text-3xl font-bold text-white text-center mb-8">Meet the Team</h2>

    <div className="grid grid-cols-1 sm:grid-cols-1 md:grid-cols-1 gap-8 py-6">
      <div data-aos="zoom-in" data-aos-duration="1500" className="text-white p-4 rounded-lg shadow-lg border border-gray-600">
        <img
          src={'/Team/mem_gimhana.jpeg'}
          alt='Gimhana Deshan'
          className="w-32 h-32 md:w-36 md:h-36 rounded-full mx-auto object-cover"
        />
        <h3 className="text-xl font-semibold mt-4 text-center">Gimhana Deshan</h3>
        <p className="text-center">Project Leader</p>
      </div>
    </div>

    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-5 gap-8">
      {teamMembers.map(member => (
        <div key={member.name} data-aos="zoom-in" data-aos-duration="1500" className="text-white p-4 rounded-lg shadow-lg border border-gray-600">
          <img
            src={member.image}
            alt={member.name}
            className="w-32 h-32 md:w-36 md:h-36 rounded-full mx-auto object-cover"
          />
          <h3 className="text-xl font-semibold mt-4 text-center">{member.name}</h3>
          <p className="text-center">{member.position}</p>
          </div>
      ))}
    </div>
  </div>
</section>

            {/* Footer */}
            <section id='contact'>
            <div class="w-full min-h-screen flex items-center justify-center">
        <div class="md:w-2/3 w-full px-4 text-white flex flex-col">
            <div class="w-full text-7xl font-bold">
                <h1 class="w-full md:w-2/3">How can we help you. get
                    in touch</h1>
            </div>
            <div class="flex mt-8 flex-col md:flex-row md:justify-between">
                <p class="w-full md:w-2/3 text-gray-400">Have questions or need support? We're here to help. Reach out to us</p>
                <div class="w-44 pt-6 md:pt-0">
                    <a class="bg-red-500 justify-center text-center rounded-lg shadow px-10 py-3 flex items-center">Contact US</a>
                </div>
            </div>
            <div class="flex flex-col">
                <div class="flex mt-24 mb-12 flex-row justify-between">
                <a class="hidden md:block cursor-pointer text-gray-600 hover:text-white uppercase" href="#">Home</a>
                    <a class="hidden md:block cursor-pointer text-gray-600 hover:text-white uppercase" href='#'>About</a>
                    <a class="hidden md:block cursor-pointer text-gray-600 hover:text-white uppercase" href='#feature'>Features</a>
                    <a class="hidden md:block cursor-pointer text-gray-600 hover:text-white uppercase" href='#team'>Team</a>
                    <div class="flex flex-row space-x-8 items-center justify-between">
                        <a>
                            <svg width="6" height="12" viewBox="0 0 6 12" fill="none" xmlns="http://www.w3.org/2000/svg">
                                <path d="M3.89782 12V6.53514H5.67481L5.93895 4.39547H3.89782V3.03259C3.89782 2.41516 4.06363 1.99243 4.91774 1.99243H6V0.0847928C5.47342 0.0262443 4.94412 -0.00202566 4.41453 0.000112795C2.84383 0.000112795 1.76542 0.994936 1.76542 2.82122V4.39147H0V6.53114H1.76928V12H3.89782Z" fill="white"/>
                            </svg>
                        </a>
                        <a>
                            <svg width="12" height="13" viewBox="0 0 12 13" fill="none" xmlns="http://www.w3.org/2000/svg">
                                <path d="M5.99536 2.91345C5.17815 2.91345 4.39441 3.23809 3.81655 3.81594C3.2387 4.3938 2.91406 5.17754 2.91406 5.99475C2.91406 6.81196 3.2387 7.5957 3.81655 8.17356C4.39441 8.75141 5.17815 9.07605 5.99536 9.07605C6.81257 9.07605 7.59631 8.75141 8.17417 8.17356C8.75202 7.5957 9.07666 6.81196 9.07666 5.99475C9.07666 5.17754 8.75202 4.3938 8.17417 3.81594C7.59631 3.23809 6.81257 2.91345 5.99536 2.91345ZM5.99536 7.99586C5.46446 7.99586 4.9553 7.78496 4.57989 7.40955C4.20448 7.03415 3.99358 6.52499 3.99358 5.99408C3.99358 5.46318 4.20448 4.95402 4.57989 4.57861C4.9553 4.20321 5.46446 3.99231 5.99536 3.99231C6.52626 3.99231 7.03542 4.20321 7.41083 4.57861C7.78624 4.95402 7.99714 5.46318 7.99714 5.99408C7.99714 6.52499 7.78624 7.03415 7.41083 7.40955C7.03542 7.78496 6.52626 7.99586 5.99536 7.99586Z" fill="white"/>
                                <path d="M9.19863 3.51848C9.59537 3.51848 9.91698 3.19687 9.91698 2.80013C9.91698 2.4034 9.59537 2.08179 9.19863 2.08179C8.8019 2.08179 8.48029 2.4034 8.48029 2.80013C8.48029 3.19687 8.8019 3.51848 9.19863 3.51848Z" fill="white"/>
                                <path d="M11.6821 2.06975C11.5279 1.67138 11.2921 1.30961 10.99 1.00759C10.6879 0.705576 10.326 0.469972 9.92759 0.31586C9.46135 0.140842 8.9688 0.0462069 8.4709 0.0359839C7.82919 0.00799638 7.62594 0 5.99867 0C4.37139 0 4.16282 -6.70254e-08 3.52643 0.0359839C3.02891 0.0456842 2.53671 0.140339 2.07108 0.31586C1.67255 0.469792 1.31059 0.705333 1.00844 1.00737C0.706289 1.30941 0.47061 1.67127 0.316526 2.06975C0.141474 2.53595 0.0470554 3.02855 0.0373167 3.52643C0.00866281 4.16748 0 4.37072 0 5.99867C0 7.62594 -4.96485e-09 7.83319 0.0373167 8.4709C0.0473123 8.96935 0.14127 9.46113 0.316526 9.92825C0.471042 10.3266 0.70695 10.6883 1.00918 10.9903C1.3114 11.2923 1.6733 11.5279 2.07175 11.6821C2.5365 11.8642 3.0289 11.9656 3.52777 11.982C4.16948 12.01 4.37272 12.0187 6 12.0187C7.62728 12.0187 7.83585 12.0187 8.47223 11.982C8.97008 11.9719 9.46262 11.8775 9.92892 11.7028C10.3272 11.5483 10.689 11.3125 10.9911 11.0104C11.2932 10.7083 11.529 10.3466 11.6835 9.94825C11.8587 9.48179 11.9527 8.99 11.9627 8.49156C11.9913 7.85051 12 7.64727 12 6.01932C12 4.39138 12 4.18481 11.9627 3.54709C11.9549 3.04216 11.86 2.54237 11.6821 2.06975ZM10.8705 8.42159C10.8662 8.80562 10.7961 9.18608 10.6633 9.54642C10.5632 9.80555 10.41 10.0409 10.2135 10.2372C10.017 10.4336 9.78162 10.5867 9.52243 10.6866C9.16608 10.8188 8.78967 10.8889 8.4096 10.8938C7.77654 10.9231 7.59796 10.9305 5.97468 10.9305C4.35007 10.9305 4.18414 10.9305 3.53909 10.8938C3.15921 10.8892 2.78298 10.8191 2.42692 10.6866C2.16683 10.5873 1.93048 10.4345 1.73316 10.2381C1.53584 10.0417 1.38194 9.80605 1.28143 9.54642C1.15045 9.18995 1.08039 8.81398 1.07419 8.43425C1.04554 7.8012 1.03887 7.62261 1.03887 5.99933C1.03887 4.37539 1.03887 4.20946 1.07419 3.56375C1.0785 3.17993 1.14859 2.7997 1.28143 2.43958C1.48467 1.91382 1.90116 1.5 2.42692 1.29876C2.78316 1.16691 3.15928 1.09682 3.53909 1.09151C4.17281 1.06286 4.35073 1.05486 5.97468 1.05486C7.59862 1.05486 7.76522 1.05486 8.4096 1.09151C8.7897 1.09609 9.16617 1.1662 9.52243 1.29876C9.7816 1.39889 10.017 1.55211 10.2134 1.74858C10.4099 1.94504 10.5631 2.18041 10.6633 2.43958C10.7942 2.79606 10.8643 3.17203 10.8705 3.55175C10.8992 4.18547 10.9065 4.36339 10.9065 5.98734C10.9065 7.61062 10.9065 7.78521 10.8778 8.42226H10.8705V8.42159Z" fill="white"/>
                            </svg>
                        </a>
                        <a href="#">
                            <svg width="13" height="9" viewBox="0 0 13 9" fill="none" xmlns="http://www.w3.org/2000/svg">
                                <path d="M12.7355 1.415C12.6616 1.14357 12.517 0.896024 12.3162 0.697014C12.1154 0.498004 11.8654 0.354468 11.5911 0.280692C10.5739 0.00450089 6.5045 4.87928e-06 6.5045 4.87928e-06C6.5045 4.87928e-06 2.43578 -0.00449139 1.41795 0.259496C1.14379 0.336667 0.894302 0.482233 0.693428 0.68222C0.492554 0.882207 0.347041 1.1299 0.270859 1.40152C0.00259923 2.40737 9.51671e-07 4.49358 9.51671e-07 4.49358C9.51671e-07 4.49358 -0.0025972 6.59006 0.263714 7.58564C0.413109 8.13609 0.851549 8.57094 1.40885 8.71931C2.43643 8.9955 6.49476 9 6.49476 9C6.49476 9 10.5641 9.00449 11.5813 8.74115C11.8557 8.6675 12.106 8.52429 12.3073 8.32569C12.5086 8.12709 12.6539 7.87996 12.729 7.60876C12.998 6.60355 12.9999 4.51798 12.9999 4.51798C12.9999 4.51798 13.0129 2.42086 12.7355 1.415ZM5.20282 6.42628L5.20607 2.57244L8.58823 4.50257L5.20282 6.42628Z" fill="white"/>
                            </svg>
                        </a>
                    </div>
                </div>
                <hr class="border-gray-600"/>
                <p class="w-full text-center my-12 text-gray-600">Copyright © 2020 Ruhuna Schedule Ease</p>
            </div>
        </div>
    </div>
    </section>

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
