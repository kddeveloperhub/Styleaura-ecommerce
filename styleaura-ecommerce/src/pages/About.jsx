import React, { useEffect } from 'react';
import AOS from 'aos';
import 'aos/dist/aos.css';
import { Link } from 'react-router-dom';


import heroImage from '../assets/about-hero.png';
import journey1 from '../assets/journey-start.jpg';
import journey2 from '../assets/online-growth.jpg';
import journey3 from '../assets/sustainability.jpg';
import journey4 from '../assets/creativity.jpg';
import qualityImg from '../assets/quality.jpg';
import sustainabilityCommitmentImg from '../assets/sustainability_commitment.jpg';

import emmaImg from '../assets/emma.avif';
import jamesImg from '../assets/James.jpg';
import sofiaImg from '../assets/sofia.avif';
import michaelImg from '../assets/michael.avif';

import rebeccaImg from '../assets/testimonial1.jpg';
import davidImg from '../assets/testimonial2.jpg';
import jenniferImg from '../assets/testimonial3.jpg';

const About = () => {
  useEffect(() => {
    AOS.init({ duration: 1000, once: true });
  }, []);

  return (
    <div className="min-h-screen bg-white font-sans overflow-x-hidden">
      {/* Hero */}
      <section className="relative h-[500px] md:h-[550px] w-full">
  {/* Background Image */}
  <div
    className="absolute inset-0 bg-cover bg-center"
    style={{ backgroundImage: `url(${heroImage})` }}
  />
  {/* Dark Overlay */}
  <div className="absolute inset-0 bg-black bg-opacity-60" />

  {/* Hero Text Content */}
  <div className="relative z-10 container mx-auto px-6 h-full flex items-center justify-start">
    <div className="max-w-xl text-white" data-aos="fade-up">
      <h1 className="text-4xl md:text-5xl font-bold mb-4">Our Story</h1>
      <p className="text-lg mb-6 leading-relaxed">
        Founded in 2018, StyleAura has grown from a boutique to a global fashion brand.
        We blend timeless elegance with modern flair to empower individual style.
      </p>

      <button className="bg-pink-600 hover:bg-pink-700 text-white font-semibold px-6 py-2 rounded transition">
        Learn More
      </button>

      {/* Breadcrumbs (centered under button) */}
      <div className="text-lg text-center text-pink-200 mt-6">
        <nav aria-label="Breadcrumb">
          <ol className="flex  space-x-2">
            <li>
              <Link to="/" className="hover:underline hover:text-pink-300">Home</Link>
            </li>
            <li>/</li>
            <li className="text-white font-medium">About</li>
          </ol>
        </nav>
      </div>
    </div>
  </div>
</section>



<main className="px-4 sm:px-10 py-16 max-w-6xl mx-auto text-gray-800">
        {/* Our Journey */}
        <section>
          <h2 className="text-3xl font-bold text-center mb-10">Our Journey</h2>
          <div className="space-y-16">
            {[
              {
                year: '2018',
                title: 'The Beginning',
                text: 'Founded by Emma Chen and James Wilson to create stylish, quality fashion for everyone.',
                img: journey1,
                color: 'bg-pink-500',
              },
              {
                year: '2020',
                title: 'Digital Expansion',
                text: 'We launched our e-commerce platform to reach global audiences with personalized service.',
                img: journey2,
                color: 'bg-blue-400',
              },
              {
                year: '2022',
                title: 'Sustainability',
                text: 'Eco-conscious materials and energy-efficient production became our priority.',
                img: journey3,
                color: 'bg-pink-500',
              },
              {
                year: '2025',
                title: 'Global Brand',
                text: 'Recognized globally for our fusion of creativity, technology, and sustainability.',
                img: journey4,
                color: 'bg-blue-400',
              },
            ].map((item, idx) => (
              <div
                key={item.year}
                className={`flex flex-col md:flex-row ${idx % 2 !== 0 ? 'md:flex-row-reverse' : ''} items-center gap-6`}
                data-aos="fade-up"
              >
                <div className="md:w-1/2">
                  <span className={`inline-block mb-2 px-3 py-1 text-white rounded-full text-sm ${item.color}`}>
                    {item.year}
                  </span>
                  <h3 className="text-2xl font-semibold mb-2">{item.title}</h3>
                  <p className="text-gray-600">{item.text}</p>
                </div>
                <img src={item.img} alt={item.title} className="md:w-1/2 w-full h-60 object-cover rounded shadow" />
              </div>
            ))}
          </div>
        </section>

        {/* Commitment */}
        <section className="my-20" data-aos="fade-up">
          <h2 className="text-3xl font-bold text-center mb-10">Our Commitment</h2>
          <div className="grid md:grid-cols-2 gap-10">
            {[
              {
                img: qualityImg,
                title: 'Quality Craftsmanship',
                text: 'Every garment undergoes rigorous quality checks from fabric to stitch.',
                extra: 'We partner with artisans and offer a quality guarantee.',
              },
              {
                img: sustainabilityCommitmentImg,
                title: 'Sustainable Practices',
                text: 'We use eco-friendly materials and aim for carbon neutrality by 2026.',
                extra: 'Our packaging is recyclable and fabrics are organic or recycled.',
              },
            ].map((item) => (
              <div key={item.title} className="bg-gray-50 p-6 rounded-lg shadow hover:shadow-lg transition">
                <img src={item.img} alt={item.title} className="w-full h-48 object-cover rounded mb-4" />
                <h3 className="text-xl font-semibold mb-2">{item.title}</h3>
                <p>{item.text}</p>
                <p className="mt-2 text-sm text-gray-600">{item.extra}</p>
              </div>
            ))}
          </div>
        </section>

        {/* Team */}
        <section className="my-20" data-aos="fade-up">
          <h2 className="text-3xl font-bold text-center mb-10">Meet Our Team</h2>
          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-8 text-center">
            {[
              { name: 'Emma Chen', title: 'Co-Founder & CEO', bio: 'Leads with vision and passion.', img: emmaImg },
              { name: 'James Wilson', title: 'Co-Founder & Creative Director', bio: 'Designs the brand’s identity.', img: jamesImg },
              { name: 'Sofia Rodriguez', title: 'Head of Design', bio: 'Innovates with every collection.', img: sofiaImg },
              { name: 'Michael Thompson', title: 'Sustainability Officer', bio: 'Drives our ethical mission.', img: michaelImg },
            ].map((member) => (
              <div key={member.name} className="bg-white p-4 rounded shadow hover:shadow-md transition">
                <img
                  src={member.img}
                  alt={member.name}
                  className="w-full h-60 object-cover object-center rounded aspect-[3/4] mb-3"
                />
                <h4 className="font-semibold text-lg">{member.name}</h4>
                <p className="text-sm italic text-pink-600">{member.title}</p>
                <p className="mt-2 text-sm text-gray-600">{member.bio}</p>
              </div>
            ))}
          </div>
        </section>

        {/* Testimonials */}
        <section className="my-20" data-aos="fade-up">
          <h2 className="text-3xl font-bold text-center mb-10">What People Say About Us</h2>
          <div className="grid md:grid-cols-3 gap-6">
            {[
              {
                name: 'Rebecca Johnson',
                text: 'I’ve been a loyal customer since day one. The quality is unmatched!',
                img: rebeccaImg,
              },
              {
                name: 'David Martinez',
                text: 'Ethical, elegant, and always evolving—StyleAura is my go-to.',
                img: davidImg,
              },
              {
                name: 'Jennifer Williams',
                text: 'Amazing service and timeless pieces. I always feel confident!',
                img: jenniferImg,
              },
            ].map((review) => (
              <div key={review.name} className="bg-gray-100 p-6 rounded shadow text-center">
                <img src={review.img} alt={review.name} className="w-16 h-16 object-cover rounded-full mx-auto mb-4" />
                <p className="italic text-gray-700">“{review.text}”</p>
                <p className="mt-4 font-semibold">{review.name}</p>
              </div>
            ))}
          </div>
        </section>

        {/* FAQ */}
        <section className="my-20" data-aos="fade-up">
          <h2 className="text-3xl font-bold text-center mb-10">FAQs</h2>
          <div className="space-y-6 max-w-3xl mx-auto">
            {[
              {
                q: 'Do you ship internationally?',
                a: 'Yes, we offer worldwide shipping with tracking included.',
              },
              {
                q: 'What is your return policy?',
                a: '30-day hassle-free returns. Contact us and we’ll assist you quickly.',
              },
              {
                q: 'Are your materials sustainable?',
                a: 'We use certified organic, recycled, and eco-conscious materials.',
              },
            ].map((item, idx) => (
              <div key={idx} className="bg-white p-4 rounded shadow">
                <h4 className="font-semibold mb-2">{item.q}</h4>
                <p className="text-sm text-gray-700">{item.a}</p>
              </div>
            ))}
          </div>
        </section>

        {/* Join the Team */}
        <section className="my-20 text-center" data-aos="zoom-in">
          <div className="bg-gradient-to-r from-pink-500 to-cyan-500 text-white rounded-lg py-16 px-6 shadow-lg max-w-4xl mx-auto">
            <h2 className="text-3xl font-bold mb-4">Want to Join the StyleAura Team?</h2>
            <p className="mb-6">We’re always looking for passionate individuals to help shape the future of fashion.</p>
            <button className="bg-white text-pink-600 hover:bg-gray-100 font-semibold py-3 px-8 rounded transition">
              View Open Positions
            </button>
          </div>
        </section>
      </main>
    </div>
  );
};

export default About;
